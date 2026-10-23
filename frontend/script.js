const form = document.getElementById("fitnessForm");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const age = Number(document.getElementById("age").value);
    const height = Number(document.getElementById("height").value);
    const weight = Number(document.getElementById("weight").value);
    const goal = document.getElementById("goal").value;
    const activity = document.getElementById("activity").value;

    // Basic BMR calculation
    const bmr = 10 * weight + 6.25 * height - 5 * age + 5;

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
    const protein = Math.round(weight * 1.6);
    const fats = Math.round(weight * 0.8);
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
        workout = "Full-body workout with moderate cardio, 3–4 times per week.";
    } else if (goal === "muscle-gain") {
        workout = "Strength training focused on progressive overload, 3–4 times per week.";
    } else {
        workout = "Balanced full-body training with moderate cardio, 3 times per week.";
    }

    document.getElementById("recommendation").textContent =
        `Hello ${name}! Based on your profile, here is your basic fitness recommendation.`;

    document.getElementById("calories").innerHTML = `
        <strong>Daily Calories:</strong> ${calories} kcal
    `;

    document.getElementById("macros").innerHTML = `
        <strong>Daily Macronutrients:</strong><br>
        Protein: ${protein} g<br>
        Carbohydrates: ${carbohydrates} g<br>
        Fats: ${fats} g
    `;

    document.getElementById("workout").innerHTML = `
        <strong>Workout Recommendation:</strong><br>
        ${workout}
    `;
});
