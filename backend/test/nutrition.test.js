// Unit tests for calories, macronutrients and safety rules (APF-6, APF-14). Run: npm test
const test = require("node:test");
const assert = require("node:assert/strict");
const c = require("../src/calculations");

const base = { name: "Test", age: 25, height: 180, weight: 80, gender: "male", activity: "moderate" };

test("TC-U10 calorie target: -15% for weight loss, TDEE for maintenance, +10% for muscle gain", () => {
    // TDEE = 1805 * 1.55 = 2797.75
    assert.equal(c.generateRecommendation({ ...base, goal: "weight-loss" }).calories, 2378);
    assert.equal(c.generateRecommendation({ ...base, goal: "maintenance" }).calories, 2798);
    assert.equal(c.generateRecommendation({ ...base, goal: "muscle-gain" }).calories, 3078);
});

test("TC-U11 BMR and TDEE match a hand calculation (female, low activity)", () => {
    // 10*60 + 6.25*165 - 5*30 - 161 = 1320.25; x 1.2 = 1584.3
    const p = { name: "F", age: 30, height: 165, weight: 60, gender: "female", activity: "low", goal: "maintenance" };
    assert.equal(c.calculateBmr(p), 1320.25);
    const r = c.generateRecommendation(p);
    assert.equal(r.bmr, 1320);
    assert.equal(r.tdee, 1584);
});

test("TC-U12 macronutrient calories are returned and add up to the target", () => {
    for (const goal of ["weight-loss", "maintenance", "muscle-gain"]) {
        const r = c.generateRecommendation({ ...base, goal });
        const m = r.macronutrients;
        const k = r.macronutrientCalories;
        assert.equal(k.protein, m.protein * 4);
        assert.equal(k.carbohydrates, m.carbohydrates * 4);
        assert.equal(k.fats, m.fats * 9);
        const total = k.protein + k.carbohydrates + k.fats;
        assert.ok(Math.abs(total - r.calories) <= 10, `${goal}: ${total} vs ${r.calories}`);
        const fatShare = k.fats / r.calories;
        assert.ok(fatShare >= 0.24 && fatShare <= 0.26, `${goal}: fat share ${fatShare}`);
    }
});

test("TC-U13 every recommendation carries the medical disclaimer and BMI", () => {
    const r = c.generateRecommendation({ ...base, goal: "maintenance" });
    assert.equal(r.disclaimer, c.DISCLAIMER);
    assert.match(r.disclaimer, /doctor/);
    assert.equal(r.bmi, 24.7);
});

test("TC-U14 a healthy adult gets no warnings", () => {
    assert.deepEqual(c.generateRecommendation({ ...base, goal: "maintenance" }).warnings, []);
});

test("TC-U15 protein uses adjusted body weight when BMI >= 30", () => {
    // BMI 37.0; weight at BMI 25 = 81 kg; adjusted = 81 + 0.25 * (120 - 81) = 90.75 kg
    const p = { name: "O", age: 40, height: 180, weight: 120, gender: "male", activity: "low", goal: "weight-loss" };
    assert.ok(Math.abs(c.calculateProteinWeight(p) - 90.75) < 1e-9);
    const r = c.generateRecommendation(p);
    assert.equal(r.macronutrients.protein, 163); // 90.75 * 1.8
    assert.ok(r.warnings.some((w) => w.includes("adjusted body weight")));
    // below BMI 30 the real weight is used
    assert.equal(c.calculateProteinWeight(base), 80);
});

test("TC-U16 users under 18 get at most a 10% deficit", () => {
    // BMR = 550 + 1031.25 - 80 - 161 = 1340.25; TDEE = 2077.39; x 0.9 = 1869.6
    const teen = { name: "T", age: 16, height: 165, weight: 55, gender: "female", activity: "moderate", goal: "weight-loss" };
    const r = c.generateRecommendation(teen);
    assert.equal(r.calories, 1870);
    assert.ok(r.warnings.some((w) => w.includes("under 18")));
    // the cap does not change muscle gain or adults
    assert.equal(c.calculateCalorieTarget(2000, "muscle-gain", "female", 16), 2200);
    assert.equal(c.calculateCalorieTarget(2000, "weight-loss", "female", 30), 1700);
});

test("TC-U17 safety floor above TDEE produces warnings instead of a hidden surplus", () => {
    const tiny = { name: "T", age: 80, height: 145, weight: 38, gender: "female", activity: "low", goal: "weight-loss" };
    const r = c.generateRecommendation(tiny);
    assert.equal(r.calories, 1200);
    assert.ok(r.calories >= r.tdee);
    assert.ok(r.warnings.some((w) => w.includes("safety minimum of 1200 kcal")));
    assert.ok(r.warnings.some((w) => w.includes("consult a doctor")));
    assert.ok(r.warnings.some((w) => w.includes("BMI is below 18.5")));
});
