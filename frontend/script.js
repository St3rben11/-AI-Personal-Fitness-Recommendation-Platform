const form = document.getElementById("fitnessForm");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const age = Number(document.getElementById("age").value);
    const height = Number(document.getElementById("height").value);
    const weight = Number(document.getElementById("weight").value);
    const goal = document.getElementById("goal").value;
    const activity = document.getElementById("activity").value;

    try {
        const response = await fetch(
            "https://miniature-fishstick-5grvrxv67j9ghvp7r-3000.app.github.dev/api/recommendation",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    age,
                    height,
                    weight,
                    goal,
                    activity
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Something went wrong.");
        }

        document.getElementById("recommendation").textContent =
            `Hello ${data.name}! Based on your profile, here is your basic fitness recommendation.`;

        document.getElementById("calories").innerHTML = `
            <strong>Daily Calories:</strong> ${data.calories} kcal
        `;

        document.getElementById("macros").innerHTML = `
            <strong>Daily Macronutrients:</strong><br>
            Protein: ${data.macronutrients.protein} g<br>
            Carbohydrates: ${data.macronutrients.carbohydrates} g<br>
            Fats: ${data.macronutrients.fats} g
        `;

        document.getElementById("workout").innerHTML = `
            <strong>Workout Recommendation:</strong><br>
            ${data.workout}
        `;

    } catch (error) {
        document.getElementById("recommendation").textContent =
            "Unable to get recommendation.";

        document.getElementById("calories").textContent =
            error.message;

        document.getElementById("macros").textContent = "";

        document.getElementById("workout").textContent = "";
    }
});