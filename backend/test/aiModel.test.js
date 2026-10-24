// Unit tests for the KNN content-based recommendation model (APF-13, APF-14). Run: npm test
const test = require("node:test");
const assert = require("node:assert/strict");
const ai = require("../src/recommendation/aiModel");

const byId = new Map(ai.WORKOUT_PROGRAMS.map((p) => [p.id, p]));
const goalOf = (rec) => byId.get(rec.id).goal;

const userA = { age: 20, height: 175, weight: 60, gender: "male", activity: "moderate", goal: "muscle-gain" };
const userB = { age: 25, height: 170, weight: 90, gender: "male", activity: "low", goal: "weight-loss" };

test("TC-M01 workout dataset is complete and consistent with the DB schema", () => {
    const programs = ai.WORKOUT_PROGRAMS;
    assert.ok(programs.length >= 20 && programs.length <= 30, `size ${programs.length}`);
    assert.equal(new Set(programs.map((p) => p.id)).size, programs.length, "ids are unique");
    for (const p of programs) {
        assert.ok(p.name && p.description, p.id);
        assert.ok(["weight-loss", "muscle-gain", "maintenance"].includes(p.goal), p.id);
        assert.ok(["beginner", "intermediate", "advanced"].includes(p.level), p.id);
        assert.ok(["cardio", "strength", "hiit", "mixed"].includes(p.type), p.id);
        assert.ok([1, 2, 3].includes(p.intensity), p.id);
        assert.ok(["home", "gym"].includes(p.equipment), p.id);
        assert.ok(Number.isInteger(p.daysPerWeek) && p.daysPerWeek >= 3 && p.daysPerWeek <= 5, p.id);
        assert.ok(Number.isInteger(p.durationMin) && p.durationMin > 0, p.id);
        assert.ok(p.exercises.length > 0, p.id);
        for (const e of p.exercises) {
            assert.ok(["strength", "cardio", "mobility"].includes(e.workout_type), `${p.id}: ${e.exercise_name}`);
        }
    }
    for (const goal of ["weight-loss", "muscle-gain", "maintenance"]) {
        assert.ok(programs.filter((p) => p.goal === goal && p.level === "beginner").length >= 3, goal);
    }
});

test("TC-M02 feature vector is normalised and one-hot encodes the goal", () => {
    for (const goal of ["weight-loss", "muscle-gain", "maintenance"]) {
        const v = ai.toFeatureVector({ ...userA, goal });
        assert.equal(v.length, 7);
        for (const x of v.slice(0, 3)) assert.ok(x >= -1 && x <= 1, String(x));
        assert.equal(v.slice(3, 6).filter((x) => x !== 0).length, 1);
        assert.equal(v[6], 0, "no equipment preference");
    }
    // extreme values are clipped
    const extreme = ai.toFeatureVector({ age: 100, height: 100, weight: 300, activity: "high", goal: "maintenance" });
    assert.deepEqual(extreme.slice(0, 3), [1, 1, 1]);
});

test("TC-M03 cosine similarity", () => {
    assert.equal(ai.cosineSimilarity([1, 0], [1, 0]), 1);
    assert.equal(ai.cosineSimilarity([1, 0], [0, 1]), 0);
    assert.equal(ai.cosineSimilarity([1, 0], [-1, 0]), -1);
    assert.equal(ai.cosineSimilarity([0, 0], [1, 0]), 0);
});

test("TC-M04 each goal gets k=3 KNN programs for that goal, best first", () => {
    for (const goal of ["weight-loss", "muscle-gain", "maintenance"]) {
        const recs = ai.recommendWorkouts({ ...userA, goal });
        assert.equal(recs.length, ai.DEFAULT_K);
        for (const r of recs) {
            assert.equal(r.source, "knn");
            assert.equal(goalOf(r), goal);
            assert.ok(r.score > 0 && r.score <= 1);
            assert.ok(r.reason.length > 0);
            for (const key of ["id", "name", "type", "daysPerWeek", "durationMin"]) assert.ok(key in r, key);
        }
        assert.ok(recs[0].score >= recs[1].score && recs[1].score >= recs[2].score);
    }
});

test("TC-M05 different users get different recommendations", () => {
    const a = ai.recommendWorkouts(userA).map((r) => r.id);
    const b = ai.recommendWorkouts(userB).map((r) => r.id);
    assert.equal(a.filter((id) => b.includes(id)).length, 0);

    // same goal, different body and activity
    const young = { age: 22, height: 175, weight: 65, activity: "high", goal: "maintenance" };
    const older = { age: 62, height: 165, weight: 90, activity: "low", goal: "maintenance" };
    const y = ai.recommendWorkouts(young);
    const o = ai.recommendWorkouts(older);
    assert.notDeepEqual(y.map((r) => r.id), o.map((r) => r.id));
    assert.equal(y[0].level, "advanced");
    assert.ok(o.every((r) => r.level === "beginner"));
});

test("TC-M06 safety: no advanced programs for low activity, no intensity 3 for age >= 60 or BMI >= 35", () => {
    for (const goal of ["weight-loss", "muscle-gain", "maintenance"]) {
        for (const recs of [
            ai.recommendWorkouts({ age: 20, height: 180, weight: 70, activity: "low", goal }),
            ai.recommendWorkouts({ age: 65, height: 175, weight: 70, activity: "high", goal }),
            ai.recommendWorkouts({ age: 30, height: 165, weight: 110, activity: "high", goal })
        ]) {
            assert.equal(recs.length, 3);
            assert.equal(recs[0].source, "knn");
        }
        assert.ok(ai.recommendWorkouts({ age: 20, height: 180, weight: 70, activity: "low", goal })
            .every((r) => r.level !== "advanced"));
        assert.ok(ai.recommendWorkouts({ age: 65, height: 175, weight: 70, activity: "high", goal })
            .every((r) => byId.get(r.id).intensity < 3));
        assert.ok(ai.recommendWorkouts({ age: 30, height: 165, weight: 110, activity: "high", goal })
            .every((r) => byId.get(r.id).intensity < 3));
    }
});

test("TC-M07 workout preference (home/gym) changes the top program", () => {
    const home = ai.recommendWorkouts({ ...userA, workoutPreference: "home" });
    const gym = ai.recommendWorkouts({ ...userA, workoutPreference: "gym" });
    assert.equal(home[0].equipment, "home");
    assert.equal(gym[0].equipment, "gym");
    assert.match(home[0].reason, /home preference/);
});

test("TC-M08 the model is deterministic", () => {
    assert.deepEqual(ai.recommendWorkouts(userB), ai.recommendWorkouts(userB));
});

test("TC-M09 incomplete profile falls back to the rule-based engine", () => {
    const recs = ai.recommendWorkouts({ goal: "weight-loss", activity: "low" });
    assert.equal(recs.length, 1);
    assert.equal(recs[0].source, "rule-based");
    assert.equal(recs[0].id, "rule-weight-loss-low");
    assert.equal(recs[0].daysPerWeek, 3);
    assert.equal(recs[0].score, null);
    assert.match(recs[0].reason, /incomplete profile/);

    const empty = ai.recommendWorkouts(null);
    assert.equal(empty[0].id, "rule-maintenance-low");
});

test("TC-M10 an error inside the model falls back to the rule-based engine", () => {
    const noData = ai.recommendWorkouts(userB, { programs: [] });
    assert.equal(noData[0].source, "rule-based");
    assert.match(noData[0].reason, /no suitable programs/);

    const broken = ai.recommendWorkouts(userB, { programs: [{ id: "x", goal: "weight-loss", level: "beginner", intensity: 9 }] });
    assert.equal(broken[0].source, "rule-based");
    assert.equal(broken[0].id, "rule-weight-loss-low");
});
