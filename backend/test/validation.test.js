// Unit tests for input validation (FR-05, APF-14). Run: npm test
const test = require("node:test");
const assert = require("node:assert/strict");
const { validateProfile, validateCredentials } = require("../src/validation");

const valid = { name: "Abzal", age: 21, height: 178, weight: 72, gender: "male", goal: "maintenance", activity: "moderate" };

test("TC-V01 a valid profile has no errors and numeric strings are converted", () => {
    const { value, errors } = validateProfile({ ...valid, age: "21", height: "178", weight: "72" });
    assert.deepEqual(errors, []);
    assert.equal(value.age, 21);
    assert.equal(value.height, 178);
    assert.equal(value.weight, 72);
});

test("TC-V02 boundary values are accepted", () => {
    for (const p of [{ age: 14 }, { age: 100 }, { height: 100 }, { height: 250 }, { weight: 30 }, { weight: 300 }]) {
        assert.deepEqual(validateProfile({ ...valid, ...p }).errors, [], JSON.stringify(p));
    }
});

test("TC-V03 each invalid field produces an error that names the field", () => {
    const cases = [
        ["age", { age: 13 }], ["age", { age: 101 }], ["age", { age: "" }],
        ["height", { height: 99 }], ["height", { height: 251 }],
        ["weight", { weight: 29 }], ["weight", { weight: 301 }], ["weight", { weight: "abc" }],
        ["gender", { gender: undefined }], ["goal", { goal: "fly" }], ["goal", { goal: undefined }],
        ["activity", { activity: "extreme" }], ["name", { name: "   " }]
    ];
    for (const [field, override] of cases) {
        const { errors } = validateProfile({ ...valid, ...override });
        assert.ok(errors.length > 0, JSON.stringify(override));
        assert.ok(errors.some((e) => e.includes(field)), `${field}: ${errors.join(" ")}`);
    }
});

test("TC-V04 an empty body lists all required fields", () => {
    const { errors } = validateProfile({});
    assert.equal(errors.length, 7);
});

test("TC-V05 credentials need a valid email and a password of 8+ characters", () => {
    assert.deepEqual(validateCredentials({ email: "a@b.kz", password: "12345678" }).errors, []);
    assert.equal(validateCredentials({ email: "not-an-email", password: "12345678" }).errors.length, 1);
    assert.equal(validateCredentials({ email: "a@b.kz", password: "short" }).errors.length, 1);
});
