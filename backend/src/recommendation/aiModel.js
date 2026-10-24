// AI recommendation component (APF-13): content-based KNN over a library of workout programs.
// The user profile and every program are mapped into the same feature space, and the k programs
// with the highest cosine similarity are recommended. On incomplete input or any error the
// rule-based engine from calculations.js is used instead. Pure JavaScript, no dependencies.

const WORKOUT_PROGRAMS = require("../data/workouts.json");
const { calculateBmi, recommendWorkout } = require("../calculations");
const { GOALS, ACTIVITIES } = require("../validation");

const DEFAULT_K = 3;

// Normalisation ranges; values outside are clipped to 0..1.
const BMI_RANGE = [15, 40];
const AGE_RANGE = [14, 80];
const ACTIVITY_LEVEL = { low: 0, moderate: 0.5, high: 1 };
const PROGRAM_LEVEL = { beginner: 0, intermediate: 0.5, advanced: 1 };

// The user a program of each intensity suits best, in normalised units:
// low intensity -> higher BMI and older users, high intensity -> lower BMI and younger users.
const INTENSITY_TARGET = {
    1: { bmi: 0.8, age: 0.7 },   // ~BMI 35, ~60 years
    2: { bmi: 0.5, age: 0.4 },   // ~BMI 27.5, ~40 years
    3: { bmi: 0.25, age: 0.2 }   // ~BMI 21, ~27 years
};

// Feature weights: with 3 the goal always dominates the other features,
// the equipment preference (home/gym) only breaks ties between similar programs.
const GOAL_WEIGHT = 3;
const EQUIPMENT_WEIGHT = 0.5;

// Safety constraints applied before ranking (NFR-08).
const MAX_LEVEL_STEP = 0.5;                          // low activity -> no advanced programs
const HIGH_INTENSITY_LIMITS = { bmi: 35, age: 60 };  // no intensity 3 at or above these values

const GOAL_LABEL = { "weight-loss": "weight loss", "muscle-gain": "muscle gain", "maintenance": "maintenance" };

function normalise(value, [min, max]) {
    return Math.min(Math.max((value - min) / (max - min), 0), 1);
}

// Maps 0..1 to -1..1 so that cosine similarity compares directions around an "average" user.
function centre(value) {
    return value * 2 - 1;
}

function goalOneHot(goal) {
    return GOALS.map((g) => (g === goal ? GOAL_WEIGHT : 0));
}

function equipmentFeature(equipment) {
    if (equipment === "home") return -EQUIPMENT_WEIGHT;
    if (equipment === "gym") return EQUIPMENT_WEIGHT;
    return 0;
}

/** User features: [BMI, age, activity, goal one-hot (3), equipment preference]. */
function toFeatureVector(profile) {
    return [
        centre(normalise(calculateBmi(profile), BMI_RANGE)),
        centre(normalise(profile.age, AGE_RANGE)),
        centre(ACTIVITY_LEVEL[profile.activity]),
        ...goalOneHot(profile.goal),
        equipmentFeature(profile.workoutPreference)
    ];
}

/** Program features in the same space: intensity -> target BMI and age, level -> activity. */
function programToVector(program) {
    const target = INTENSITY_TARGET[program.intensity];
    return [
        centre(target.bmi),
        centre(target.age),
        centre(PROGRAM_LEVEL[program.level]),
        ...goalOneHot(program.goal),
        equipmentFeature(program.equipment)
    ];
}

function cosineSimilarity(a, b) {
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/** Returns a clean copy of the fields the model needs, or null if the profile is incomplete. */
function readProfile(profile) {
    if (!profile || typeof profile !== "object") return null;
    const user = {
        age: Number(profile.age),
        height: Number(profile.height),
        weight: Number(profile.weight),
        goal: profile.goal,
        activity: profile.activity,
        workoutPreference: profile.workoutPreference
    };
    const numbersOk = [user.age, user.height, user.weight].every((v) => Number.isFinite(v) && v > 0);
    if (!numbersOk || !GOALS.includes(user.goal) || !ACTIVITIES.includes(user.activity)) return null;
    return user;
}

function isSafeFor(program, user) {
    if (PROGRAM_LEVEL[program.level] - ACTIVITY_LEVEL[user.activity] > MAX_LEVEL_STEP) return false;
    if (program.intensity === 3 &&
        (user.bmi >= HIGH_INTENSITY_LIMITS.bmi || user.age >= HIGH_INTENSITY_LIMITS.age)) return false;
    return true;
}

function explain(program, user) {
    const parts = [
        `Built for ${GOAL_LABEL[program.goal]}`,
        `${program.level} level for your ${user.activity} activity`,
        `intensity ${program.intensity}/3 for BMI ${user.bmi.toFixed(1)} and age ${user.age}`
    ];
    if (user.workoutPreference === program.equipment) parts.push(`matches your ${program.equipment} preference`);
    return parts.join("; ") + ".";
}

function toResult(program, score, reason) {
    return {
        id: program.id,
        name: program.name,
        type: program.type,
        level: program.level,
        equipment: program.equipment,
        daysPerWeek: program.daysPerWeek,
        durationMin: program.durationMin,
        score,
        reason,
        source: "knn",
        description: program.description,
        exercises: program.exercises.map((e) => ({ ...e }))
    };
}

/** Rule-based plan in the same output format; unknown goal/activity default to the safest values. */
function ruleBasedFallback(profile, cause) {
    const goal = GOALS.includes(profile?.goal) ? profile.goal : "maintenance";
    const activity = ACTIVITIES.includes(profile?.activity) ? profile.activity : "low";
    const plan = recommendWorkout(goal, activity);
    // Duration estimate: about 2 minutes per strength set plus the cardio/mobility minutes.
    const durationMin = plan.exercises.reduce((sum, e) => sum + (e.duration_minutes ?? e.sets * 2), 0);
    return [{
        id: `rule-${goal}-${activity}`,
        name: `Rule-based ${GOAL_LABEL[goal]} plan`,
        type: "mixed",
        level: plan.level,
        equipment: null,
        daysPerWeek: plan.sessions_per_week,
        durationMin,
        score: null,
        reason: `Rule-based fallback (${cause}).`,
        source: "rule-based",
        description: plan.summary,
        exercises: plan.exercises
    }];
}

/**
 * Recommends the k most similar workout programs for a profile
 * ({ age, height, weight, goal, activity, workoutPreference? }).
 * Returns [{ id, name, type, level, equipment, daysPerWeek, durationMin, score, reason, source, description, exercises }].
 */
function recommendWorkouts(profile, { k = DEFAULT_K, programs = WORKOUT_PROGRAMS } = {}) {
    const user = readProfile(profile);
    if (!user) return ruleBasedFallback(profile, "incomplete profile");
    try {
        user.bmi = calculateBmi(user);
        const userVector = toFeatureVector(user);
        const ranked = programs
            .filter((p) => isSafeFor(p, user))
            .map((p) => ({ program: p, score: cosineSimilarity(userVector, programToVector(p)) }))
            .sort((a, b) => b.score - a.score);
        if (ranked.length === 0) throw new Error("no suitable programs");
        return ranked.slice(0, k).map(({ program, score }) =>
            toResult(program, Math.round(score * 1000) / 1000, explain(program, user)));
    } catch (err) {
        return ruleBasedFallback(user, err.message);
    }
}

module.exports = {
    DEFAULT_K,
    WORKOUT_PROGRAMS,
    toFeatureVector,
    programToVector,
    cosineSimilarity,
    recommendWorkouts
};
