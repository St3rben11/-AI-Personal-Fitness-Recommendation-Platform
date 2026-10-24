// The 5 test cases from the project specification (section 17), run against the REST API
// with an in-memory SQLite database (APF-14).
const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const { createApp } = require("../src/app");
const { openDatabase } = require("../src/db");
const { WORKOUT_PROGRAMS } = require("../src/recommendation/aiModel");

const goalById = new Map(WORKOUT_PROGRAMS.map((p) => [p.id, p.goal]));

function setup() {
    return createApp({ db: openDatabase(":memory:"), jwtSecret: "test-secret", serveFrontend: false });
}

const person = { name: "Test User", age: 25, height: 180, weight: 80, gender: "male", activity: "moderate" };

function assertAiRecommendations(body, goal) {
    assert.equal(body.aiRecommendations.length, 3);
    for (const r of body.aiRecommendations) {
        assert.equal(r.source, "knn");
        assert.equal(goalById.get(r.id), goal);
    }
}

test("TC-T01 profile creation: valid data is stored and used for a saved recommendation", async () => {
    const app = setup();
    const reg = await request(app).post("/api/auth/register")
        .send({ email: "tz@example.com", password: "password-123", name: "Test User" });
    assert.equal(reg.status, 201);
    const token = `Bearer ${reg.body.token}`;

    const upd = await request(app).put("/api/profile").set("Authorization", token)
        .send({ ...person, goal: "maintenance", workoutPreference: "home" });
    assert.equal(upd.status, 200);
    assert.deepEqual(upd.body.profile, {
        age: 25, gender: "male", height: 180, weight: 80, activity: "moderate", goal: "maintenance", workoutPreference: "home"
    });

    const gen = await request(app).post("/api/recommendations").set("Authorization", token);
    assert.equal(gen.status, 201);
    assertAiRecommendations(gen.body, "maintenance");
    assert.equal(gen.body.aiRecommendations[0].equipment, "home");
});

test("TC-T02 weight loss: calorie deficit and weight-loss programs", async () => {
    const res = await request(setup()).post("/api/recommendation").send({ ...person, goal: "weight-loss" });
    assert.equal(res.status, 200);
    assert.ok(res.body.calories < res.body.tdee);
    assert.equal(res.body.calories, 2378);
    assert.ok(res.body.disclaimer.length > 0);
    assert.deepEqual(res.body.warnings, []);
    assertAiRecommendations(res.body, "weight-loss");
});

test("TC-T03 muscle gain: calorie surplus and muscle-gain programs", async () => {
    const res = await request(setup()).post("/api/recommendation").send({ ...person, goal: "muscle-gain" });
    assert.equal(res.status, 200);
    assert.ok(res.body.calories > res.body.tdee);
    assert.equal(res.body.calories, 3078);
    assertAiRecommendations(res.body, "muscle-gain");
});

test("TC-T04 maintenance: calories equal TDEE and maintenance programs", async () => {
    const res = await request(setup()).post("/api/recommendation").send({ ...person, goal: "maintenance" });
    assert.equal(res.status, 200);
    assert.equal(res.body.calories, res.body.tdee);
    assertAiRecommendations(res.body, "maintenance");
});

test("TC-T05 invalid input: error message and no calculation", async () => {
    const res = await request(setup()).post("/api/recommendation")
        .send({ ...person, age: -1, weight: "", goal: "fly" });
    assert.equal(res.status, 400);
    assert.equal(res.body.error, "Validation failed.");
    assert.equal(res.body.details.length, 3);
    assert.equal(res.body.calories, undefined);
    assert.equal(res.body.aiRecommendations, undefined);
});
