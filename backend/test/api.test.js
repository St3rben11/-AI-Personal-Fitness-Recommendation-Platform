// Integration tests for the REST API with an in-memory SQLite database (APF-8, APF-10, APF-14).
const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const { createApp } = require("../src/app");
const { openDatabase } = require("../src/db");

function setup() {
    const db = openDatabase(":memory:");
    return createApp({ db, jwtSecret: "test-secret", serveFrontend: false });
}

const profile = { name: "Aruzhan", age: 22, height: 165, weight: 58, gender: "female", goal: "maintenance", activity: "moderate" };

test("TC-A01 health endpoint responds", async () => {
    const res = await request(setup()).get("/api/health");
    assert.equal(res.status, 200);
    assert.equal(res.body.status, "ok");
});

test("TC-A02 guest recommendation returns calories, macros and workout", async () => {
    const res = await request(setup()).post("/api/recommendation").send(profile);
    assert.equal(res.status, 200);
    assert.ok(res.body.calories > 0);
    assert.ok(res.body.macronutrients.protein > 0);
    assert.ok(Array.isArray(res.body.workout.exercises) && res.body.workout.exercises.length > 0);
});

test("TC-A03 invalid input is rejected with 400 and details", async () => {
    const app = setup();
    for (const bad of [{ ...profile, age: -5 }, { ...profile, weight: "abc" }, { ...profile, goal: "fly" }, { ...profile, height: "" }, {}]) {
        const res = await request(app).post("/api/recommendation").send(bad);
        assert.equal(res.status, 400, JSON.stringify(bad));
        assert.ok(res.body.details.length > 0);
    }
});

test("TC-A04 malformed JSON returns 400", async () => {
    const res = await request(setup()).post("/api/recommendation").set("Content-Type", "application/json").send("{bad");
    assert.equal(res.status, 400);
});

test("TC-A05 register, login, update profile, generate and read history", async () => {
    const app = setup();
    const creds = { email: "student@example.com", password: "secret-pass-1", name: "Student" };

    const reg = await request(app).post("/api/auth/register").send(creds);
    assert.equal(reg.status, 201);
    assert.ok(reg.body.token);

    const dup = await request(app).post("/api/auth/register").send(creds);
    assert.equal(dup.status, 409);

    const login = await request(app).post("/api/auth/login").send({ email: creds.email, password: creds.password });
    assert.equal(login.status, 200);
    const token = `Bearer ${login.body.token}`;

    const incomplete = await request(app).post("/api/recommendations").set("Authorization", token);
    assert.equal(incomplete.status, 422);

    const upd = await request(app).put("/api/profile").set("Authorization", token).send({ ...profile, workoutPreference: "home" });
    assert.equal(upd.status, 200);
    assert.equal(upd.body.profile.weight, 58);

    const gen = await request(app).post("/api/recommendations").set("Authorization", token);
    assert.equal(gen.status, 201);

    const hist = await request(app).get("/api/recommendations").set("Authorization", token);
    assert.equal(hist.status, 200);
    assert.equal(hist.body.length, 1);
    assert.equal(hist.body[0].daily_calories, gen.body.calories);
    assert.ok(hist.body[0].exercises.length > 0);
});

test("TC-A06 wrong password and missing token are rejected", async () => {
    const app = setup();
    await request(app).post("/api/auth/register").send({ email: "a@b.kz", password: "password123", name: "A" });
    const bad = await request(app).post("/api/auth/login").send({ email: "a@b.kz", password: "wrongpass1" });
    assert.equal(bad.status, 401);
    const noToken = await request(app).get("/api/profile");
    assert.equal(noToken.status, 401);
    const fakeToken = await request(app).get("/api/profile").set("Authorization", "Bearer abc.def.ghi");
    assert.equal(fakeToken.status, 401);
});

test("TC-A07 password is never stored or returned in plain text", async () => {
    const db = openDatabase(":memory:");
    const app = createApp({ db, jwtSecret: "s", serveFrontend: false });
    const res = await request(app).post("/api/auth/register").send({ email: "x@y.kz", password: "plaintext-pw", name: "X" });
    assert.ok(!JSON.stringify(res.body).includes("plaintext-pw"));
    assert.ok(!db.findUserByEmail("x@y.kz").password_hash.includes("plaintext-pw"));
});
