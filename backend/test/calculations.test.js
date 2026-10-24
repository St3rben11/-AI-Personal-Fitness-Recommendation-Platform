// Unit tests for the rule-based recommendation engine (APF-14). Run: npm test
const test = require("node:test");
const assert = require("node:assert/strict");
const c = require("../src/calculations");

const base = { name: "Test", age: 25, height: 180, weight: 80, gender: "male", activity: "moderate" };

test("TC-U01 BMR uses Mifflin-St Jeor male constant (+5)", () => {
    // 10*80 + 6.25*180 - 5*25 + 5 = 1805
    assert.equal(c.calculateBmr(base), 1805);
});

test("TC-U02 BMR uses Mifflin-St Jeor female constant (-161)", () => {
    assert.equal(c.calculateBmr({ ...base, gender: "female" }), 1639);
});

test("TC-U03 activity multipliers are applied", () => {
    assert.equal(c.calculateTdee(1000, "low"), 1200);
    assert.equal(c.calculateTdee(1000, "moderate"), 1550);
    assert.equal(c.calculateTdee(1000, "high"), 1725);
});

test("TC-U04 goal changes calorie target in the expected direction", () => {
    const loss = c.generateRecommendation({ ...base, goal: "weight-loss" }).calories;
    const keep = c.generateRecommendation({ ...base, goal: "maintenance" }).calories;
    const gain = c.generateRecommendation({ ...base, goal: "muscle-gain" }).calories;
    assert.ok(loss < keep && keep < gain, `${loss} < ${keep} < ${gain}`);
    assert.equal(keep, Math.round(1805 * 1.55)); // maintenance == TDEE
});

test("TC-U05 calorie target never drops below the safety floor", () => {
    const tiny = { name: "T", age: 80, height: 145, weight: 38, gender: "female", activity: "low", goal: "weight-loss" };
    assert.equal(c.generateRecommendation(tiny).calories, c.MIN_CALORIES.female);
});

test("TC-U06 macronutrient energy adds up to the calorie target (+-10 kcal rounding)", () => {
    for (const goal of ["weight-loss", "maintenance", "muscle-gain"]) {
        const r = c.generateRecommendation({ ...base, goal });
        const m = r.macronutrients;
        const kcal = m.protein * 4 + m.carbohydrates * 4 + m.fats * 9;
        assert.ok(Math.abs(kcal - r.calories) <= 10, `${goal}: ${kcal} vs ${r.calories}`);
    }
});

test("TC-U07 protein stays within 1.4-2.0 g/kg", () => {
    for (const goal of ["weight-loss", "maintenance", "muscle-gain"]) {
        const p = c.generateRecommendation({ ...base, goal }).macronutrients.protein / base.weight;
        assert.ok(p >= 1.4 && p <= 2.0, `${goal}: ${p}`);
    }
});

test("TC-U08 workout plan depends on goal and activity level", () => {
    const beginner = c.recommendWorkout("muscle-gain", "low");
    const advanced = c.recommendWorkout("muscle-gain", "high");
    assert.equal(beginner.sessions_per_week, 3);
    assert.equal(advanced.sessions_per_week, 5);
    assert.notDeepEqual(c.recommendWorkout("weight-loss", "low").exercises, beginner.exercises);
});

test("TC-U09 different users get different recommendations (personalisation)", () => {
    const a = c.generateRecommendation({ name: "A", age: 20, height: 175, weight: 60, gender: "male", activity: "moderate", goal: "muscle-gain" });
    const b = c.generateRecommendation({ name: "B", age: 25, height: 170, weight: 90, gender: "male", activity: "low", goal: "weight-loss" });
    assert.notEqual(a.calories, b.calories);
    assert.notEqual(a.workout.summary, b.workout.summary);
});
