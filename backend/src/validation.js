// Input validation for the fitness profile and auth payloads (APF-8, APF-10).

const GOALS = ["weight-loss", "muscle-gain", "maintenance"];
const ACTIVITIES = ["low", "moderate", "high"];
const GENDERS = ["male", "female"];

const RANGES = {
    age: [14, 100],
    height: [100, 250],
    weight: [30, 300]
};

function isNumberInRange(value, [min, max]) {
    return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
}

/**
 * Validates a fitness profile. Returns { value, errors }.
 * Numeric strings are accepted and converted ("70" -> 70).
 */
function validateProfile(body = {}) {
    const errors = [];
    const value = {
        name: typeof body.name === "string" ? body.name.trim() : "",
        age: body.age === "" || body.age == null ? NaN : Number(body.age),
        height: body.height === "" || body.height == null ? NaN : Number(body.height),
        weight: body.weight === "" || body.weight == null ? NaN : Number(body.weight),
        gender: body.gender,
        goal: body.goal,
        activity: body.activity
    };

    if (!value.name) errors.push("name is required.");
    if (value.name.length > 100) errors.push("name must be at most 100 characters.");
    for (const field of ["age", "height", "weight"]) {
        const [min, max] = RANGES[field];
        if (!isNumberInRange(value[field], RANGES[field])) {
            errors.push(`${field} must be a number between ${min} and ${max}.`);
        }
    }
    if (!GENDERS.includes(value.gender)) errors.push(`gender must be one of: ${GENDERS.join(", ")}.`);
    if (!GOALS.includes(value.goal)) errors.push(`goal must be one of: ${GOALS.join(", ")}.`);
    if (!ACTIVITIES.includes(value.activity)) errors.push(`activity must be one of: ${ACTIVITIES.join(", ")}.`);

    return { value, errors };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateCredentials(body = {}, { requireName = false } = {}) {
    const errors = [];
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!EMAIL_RE.test(email)) errors.push("A valid email is required.");
    if (password.length < 8) errors.push("Password must be at least 8 characters.");
    if (requireName && !name) errors.push("name is required.");
    return { value: { email, password, name }, errors };
}

module.exports = { validateProfile, validateCredentials, GOALS, ACTIVITIES, GENDERS, RANGES };
