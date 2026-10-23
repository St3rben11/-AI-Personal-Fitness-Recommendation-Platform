const form = document.getElementById("fitnessForm");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = {
        age: document.getElementById("age").value,
        gender: document.getElementById("gender").value,
        height: document.getElementById("height").value,
        weight: document.getElementById("weight").value,
        goal: document.getElementById("goal").value,
        activityLevel: document.getElementById("activityLevel").value
    };

    try {
        const response = await fetch("http://localhost:3000/api/recommendation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        document.getElementById("bmi").textContent = result.bmi;
        document.getElementById("resultGoal").textContent = result.goal;
        document.getElementById("recommendation").textContent =
            result.recommendation;

        document.getElementById("result").classList.remove("hidden");

    } catch (error) {
        alert("Could not connect to the backend.");
        console.error(error);
    }
});
