// Frontend logic for the MVP form (APF-11). The page is served by the backend,
// so the API is reached by a relative URL; when opened as a local file it falls back to localhost.
const API_BASE = window.location.protocol === "file:" ? "http://localhost:3000" : "";

const form = document.getElementById("fitnessForm");

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = String(text);
    return div.innerHTML;
}

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const payload = {
        name: document.getElementById("name").value,
        age: Number(document.getElementById("age").value),
        height: Number(document.getElementById("height").value),
        weight: Number(document.getElementById("weight").value),
        gender: document.getElementById("gender").value,
        goal: document.getElementById("goal").value,
        activity: document.getElementById("activity").value
    };

    try {
        const response = await fetch(`${API_BASE}/api/recommendation`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            const details = data.details ? " " + data.details.join(" ") : "";
            throw new Error((data.error || "Something went wrong.") + details);
        }

        document.getElementById("recommendation").textContent =
            `Hello ${data.name}! Based on your profile, here is your personalized recommendation.`;

        document.getElementById("calories").innerHTML = `
            <strong>Daily Calories:</strong> ${data.calories} kcal
            <br><small>BMR ${data.bmr} kcal · maintenance (TDEE) ${data.tdee} kcal</small>
        `;

        document.getElementById("macros").innerHTML = `
            <strong>Daily Macronutrients:</strong><br>
            Protein: ${data.macronutrients.protein} g<br>
            Carbohydrates: ${data.macronutrients.carbohydrates} g<br>
            Fats: ${data.macronutrients.fats} g
        `;

        const items = data.workout.exercises.map((e) => {
            const dose = e.sets ? `${e.sets} × ${e.repetitions}` : `${e.duration_minutes} min`;
            return `<li>${escapeHtml(e.exercise_name)} — ${escapeHtml(dose)}</li>`;
        }).join("");

        document.getElementById("workout").innerHTML = `
            <strong>Workout Recommendation:</strong><br>
            ${escapeHtml(data.workout.summary)}
            <ul>${items}</ul>
        `;

    } catch (error) {
        document.getElementById("recommendation").textContent = "Unable to get recommendation.";
        document.getElementById("calories").textContent = error.message;
        document.getElementById("macros").textContent = "";
        document.getElementById("workout").textContent = "";
    }
});
