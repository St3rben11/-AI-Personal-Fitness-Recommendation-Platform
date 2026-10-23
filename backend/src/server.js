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
    const {
        age,
        gender,
        height,
        weight,
        goal,
        activityLevel
    } = req.body;

    const heightInMeters = Number(height) / 100;
    const weightNumber = Number(weight);

    const bmi = weightNumber / (heightInMeters * heightInMeters);

    let recommendation;

    if (goal === "gain") {
        recommendation = "Focus on strength training and a moderate calorie surplus.";
    } else if (goal === "lose") {
        recommendation = "Focus on regular training and a moderate calorie deficit.";
    } else {
        recommendation = "Focus on maintaining a balanced diet and regular physical activity.";
    }

    res.json({
        success: true,
        profile: {
            age,
            gender,
            height,
            weight,
            activityLevel
        },
        bmi: Number(bmi.toFixed(2)),
        goal,
        recommendation
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
