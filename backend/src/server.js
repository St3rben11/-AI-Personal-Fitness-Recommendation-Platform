const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "AI Personal Fitness Recommendation Platform API",
        status: "running"
    });
});

app.post("/api/recommendation", (req, res) => {
    const { name, age, height, weight, goal, activity } = req.body;

    // Validate input
    if (!name || !age || !height || !weight || !goal || !activity) {
        return res.status(400).json({
            error: "All fields are required."
        });
    }

    if (age <= 0 || height <= 0 || weight <= 0) {
        return res.status(400).json({
            error: "Age, height and weight must be positive numbers."
        });
    }

    // Basic BMR calculation
    const bmr =
        10 * Number(weight) +
        6.25 * Number(height) -
        5 * Number(age) +
        5;

    // Activity multiplier
    let activityMultiplier;

    if (activity === "low") {
        activityMultiplier = 1.2;
    } else if (activity === "moderate") {
        activityMultiplier = 1.55;
    } else {
        activityMultiplier = 1.725;
    }

    let calories = Math.round(bmr * activityMultiplier);

    // Adjust calories according to fitness goal
    if (goal === "weight-loss") {
        calories -= 300;
    } else if (goal === "muscle-gain") {
        calories += 300;
    }

    // Basic macronutrient calculation
    const protein = Math.round(Number(weight) * 1.6);
    const fats = Math.round(Number(weight) * 0.8);

    const proteinCalories = protein * 4;
    const fatCalories = fats * 9;

    const remainingCalories = Math.max(
        calories - proteinCalories - fatCalories,
        0
    );

    const carbohydrates = Math.round(remainingCalories / 4);

    // Workout recommendation
    let workout;

    if (goal === "weight-loss") {
        workout =
            "Full-body workout with moderate cardio, 3–4 times per week.";
    } else if (goal === "muscle-gain") {
        workout =
            "Strength training focused on progressive overload, 3–4 times per week.";
    } else {
        workout =
            "Balanced full-body training with moderate cardio, 3 times per week.";
    }

    res.json({
        name,
        goal,
        activity,
        calories,
        macronutrients: {
            protein,
            carbohydrates,
            fats
        },
        workout
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});