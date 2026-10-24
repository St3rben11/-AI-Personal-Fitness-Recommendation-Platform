// Fitness calculations (rule-based recommendation engine, MVP baseline).
// Related YouTrack issues: APF-5, APF-6, APF-7.
// Pure functions only: no I/O, so they can be unit-tested and later replaced by an ML model.

const ACTIVITY_MULTIPLIERS = {
    low: 1.2,        // sedentary / little exercise
    moderate: 1.55,  // exercise 3-5 days per week
    high: 1.725      // hard exercise 6-7 days per week
};

const GOAL_CALORIE_ADJUSTMENT = {
    "weight-loss": -0.15,  // ~15 % deficit
    "maintenance": 0,
    "muscle-gain": 0.10    // ~10 % surplus
};

// Protein g per kg body weight; all values inside the 1.4-2.0 g/kg range of the ISSN position stand.
const PROTEIN_PER_KG = {
    "weight-loss": 1.8,
    "maintenance": 1.4,
    "muscle-gain": 1.8
};

const FAT_SHARE_OF_CALORIES = 0.25;

// Safety floor: the engine never recommends less than this daily intake.
const MIN_CALORIES = { male: 1500, female: 1200 };

// Safety rules (APF-6, NFR-08): smaller deficit for teenagers, adjusted body weight for protein when BMI >= 30.
const ADULT_AGE = 18;
const MINOR_MAX_DEFICIT = -0.10;
const OBESITY_BMI = 30;
const UNDERWEIGHT_BMI = 18.5;
const REFERENCE_BMI = 25;

const DISCLAIMER = "These values are approximate estimates for general fitness guidance. " +
    "They do not replace a consultation with a doctor or a registered dietitian.";

/** Body mass index, kg / m^2. */
function calculateBmi({ weight, height }) {
    const meters = height / 100;
    return weight / (meters * meters);
}

/**
 * Body weight used for the protein target. For BMI >= 30 the adjusted body weight is used:
 * weight at BMI 25 plus 25 % of the excess, so protein is not inflated by fat mass.
 */
function calculateProteinWeight({ weight, height }) {
    if (calculateBmi({ weight, height }) < OBESITY_BMI) return weight;
    const meters = height / 100;
    const referenceWeight = REFERENCE_BMI * meters * meters;
    return referenceWeight + 0.25 * (weight - referenceWeight);
}

/** Basal metabolic rate, Mifflin-St Jeor equation (1990). */
function calculateBmr({ weight, height, age, gender }) {
    const base = 10 * weight + 6.25 * height - 5 * age;
    return gender === "female" ? base - 161 : base + 5;
}

/** Total daily energy expenditure = BMR x activity multiplier. */
function calculateTdee(bmr, activity) {
    return bmr * ACTIVITY_MULTIPLIERS[activity];
}

function calculateCalorieTarget(tdee, goal, gender, age) {
    let adjustment = GOAL_CALORIE_ADJUSTMENT[goal];
    if (age < ADULT_AGE) adjustment = Math.max(adjustment, MINOR_MAX_DEFICIT);
    const target = tdee * (1 + adjustment);
    return Math.round(Math.max(target, MIN_CALORIES[gender]));
}

function calculateMacros(calories, weight, goal) {
    const protein = Math.round(weight * PROTEIN_PER_KG[goal]);
    const fats = Math.round((calories * FAT_SHARE_OF_CALORIES) / 9);
    const remaining = calories - protein * 4 - fats * 9;
    const carbohydrates = Math.max(Math.round(remaining / 4), 0);
    return { protein, carbohydrates, fats };
}

const WORKOUT_LIBRARY = {
    "weight-loss": {
        summary: "Full-body strength circuits combined with moderate-intensity cardio",
        cardioMinutes: 30,
        exercises: [
            { exercise_name: "Bodyweight squat", workout_type: "strength", sets: 3, repetitions: "12-15" },
            { exercise_name: "Push-up (knee or full)", workout_type: "strength", sets: 3, repetitions: "8-12" },
            { exercise_name: "Dumbbell row", workout_type: "strength", sets: 3, repetitions: "12" },
            { exercise_name: "Plank", workout_type: "strength", sets: 3, repetitions: "30-45 s" },
            { exercise_name: "Brisk walking / cycling", workout_type: "cardio", duration_minutes: 30 }
        ]
    },
    "muscle-gain": {
        summary: "Progressive-overload strength training with compound lifts",
        cardioMinutes: 15,
        exercises: [
            { exercise_name: "Barbell or goblet squat", workout_type: "strength", sets: 4, repetitions: "6-10" },
            { exercise_name: "Bench press / push-up", workout_type: "strength", sets: 4, repetitions: "6-10" },
            { exercise_name: "Romanian deadlift", workout_type: "strength", sets: 3, repetitions: "8-10" },
            { exercise_name: "Pull-up / lat pulldown", workout_type: "strength", sets: 3, repetitions: "6-10" },
            { exercise_name: "Overhead press", workout_type: "strength", sets: 3, repetitions: "8-10" },
            { exercise_name: "Light cardio cool-down", workout_type: "cardio", duration_minutes: 15 }
        ]
    },
    "maintenance": {
        summary: "Balanced full-body training with cardio and mobility",
        cardioMinutes: 25,
        exercises: [
            { exercise_name: "Lunge", workout_type: "strength", sets: 3, repetitions: "10 per leg" },
            { exercise_name: "Push-up", workout_type: "strength", sets: 3, repetitions: "10-12" },
            { exercise_name: "Dumbbell row", workout_type: "strength", sets: 3, repetitions: "10-12" },
            { exercise_name: "Jogging / cycling", workout_type: "cardio", duration_minutes: 25 },
            { exercise_name: "Stretching / mobility", workout_type: "mobility", duration_minutes: 10 }
        ]
    }
};

// Sessions per week depend on the current activity level so that beginners are not overloaded.
const SESSIONS_PER_WEEK = { low: 3, moderate: 4, high: 5 };

function recommendWorkout(goal, activity) {
    const template = WORKOUT_LIBRARY[goal];
    const sessions = SESSIONS_PER_WEEK[activity];
    const level = activity === "low" ? "beginner" : activity === "moderate" ? "intermediate" : "advanced";
    return {
        level,
        sessions_per_week: sessions,
        summary: `${template.summary}, ${sessions} times per week (${level} level).`,
        exercises: template.exercises.map((e) => ({ ...e }))
    };
}

/** Full pipeline: validated profile -> calories, macros, workout. */
function generateRecommendation(profile) {
    const bmr = calculateBmr(profile);
    const tdee = calculateTdee(bmr, profile.activity);
    const calories = calculateCalorieTarget(tdee, profile.goal, profile.gender, profile.age);
    const bmi = calculateBmi(profile);
    const macronutrients = calculateMacros(calories, calculateProteinWeight(profile), profile.goal);
    return {
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        calories,
        macronutrients,
        workout: recommendWorkout(profile.goal, profile.activity),
        bmi: Math.round(bmi * 10) / 10,
        macronutrientCalories: {
            protein: macronutrients.protein * 4,
            carbohydrates: macronutrients.carbohydrates * 4,
            fats: macronutrients.fats * 9
        },
        warnings: collectWarnings(profile, { tdee, calories, bmi }),
        disclaimer: DISCLAIMER
    };
}

/** Human-readable safety notes shown next to the recommendation (APF-6, NFR-08). */
function collectWarnings(profile, { tdee, calories, bmi }) {
    const warnings = [];
    const floor = MIN_CALORIES[profile.gender];
    if (profile.goal === "weight-loss" && profile.age < ADULT_AGE) {
        warnings.push(`Users under ${ADULT_AGE} get at most a 10% calorie deficit. ` +
            "Weight loss for teenagers should be supervised by a doctor.");
    }
    if (profile.goal === "weight-loss" && bmi < UNDERWEIGHT_BMI) {
        warnings.push(`BMI is below ${UNDERWEIGHT_BMI}: weight loss is not recommended.`);
    }
    if (calories === floor && tdee * (1 + GOAL_CALORIE_ADJUSTMENT[profile.goal]) < floor) {
        warnings.push(`The calorie target was raised to the safety minimum of ${floor} kcal.`);
        if (profile.goal === "weight-loss" && calories >= tdee) {
            warnings.push("The safety minimum is not below your maintenance energy, so no calorie deficit is applied. " +
                "Please consult a doctor before trying to lose weight.");
        }
    }
    if (bmi >= OBESITY_BMI) {
        warnings.push("Protein is calculated from an adjusted body weight because BMI is 30 or higher.");
    }
    return warnings;
}

module.exports = {
    ACTIVITY_MULTIPLIERS,
    MIN_CALORIES,
    DISCLAIMER,
    calculateBmi,
    calculateProteinWeight,
    calculateBmr,
    calculateTdee,
    calculateCalorieTarget,
    calculateMacros,
    recommendWorkout,
    generateRecommendation
};
