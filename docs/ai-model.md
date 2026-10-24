# AI Recommendation Model (APF-13)

This document describes the workout recommendation model in `backend/src/recommendation/aiModel.js` and its programme library in `backend/src/data/workouts.json`. It is written for the API integration (APF-9) and for the evaluation (APF-15, see [evaluation.md](evaluation.md)).

## 1. Task

The rule-based engine (`calculations.js`, `recommendWorkout`) gives one of 9 fixed plans, chosen only by goal and activity level. The model chooses from a library of 24 programmes and also takes BMI, age and the home/gym preference into account. It returns the 3 most suitable programmes with a similarity score and a short explanation.

## 2. Data: programme library

`backend/src/data/workouts.json` has 24 programmes: 8 per goal, spread over 3 levels, 4 types and 2 equipment settings.

| Field | Values | Used for |
|---|---|---|
| `id`, `name`, `description` | text | output |
| `goal` | `weight-loss`, `muscle-gain`, `maintenance` | feature (one-hot) |
| `level` | `beginner`, `intermediate`, `advanced` | feature (matched to activity) and safety rule |
| `type` | `cardio`, `strength`, `hiit`, `mixed` | output |
| `intensity` | 1–3 | feature (matched to BMI and age) and safety rule |
| `daysPerWeek`, `durationMin` | 3–5, minutes | output |
| `equipment` | `home`, `gym` | feature (matched to `workoutPreference`) |
| `exercises` | `{ exercise_name, workout_type, sets, repetitions }` or `{ ..., duration_minutes }` | output; same format as the rule-based plan and the `workout_items` table |

The programmes were written by the team from general training guidelines. They are not a clinical dataset.

## 3. Features

Both the user and each programme are turned into a vector of 7 numbers in the same space.

| # | User feature | Programme feature | Encoding |
|---|---|---|---|
| 1 | BMI, clipped to 15–40 | target BMI for its intensity (1 → ~35, 2 → ~27.5, 3 → ~21) | min-max to 0..1, then centred to −1..1 |
| 2 | Age, clipped to 14–80 | target age for its intensity (1 → ~60, 2 → ~40, 3 → ~27) | min-max to 0..1, then centred to −1..1 |
| 3 | Activity: low 0, moderate 0.5, high 1 | Level: beginner 0, intermediate 0.5, advanced 1 | centred to −1..1 |
| 4–6 | Goal one-hot | Goal one-hot | weight 3 |
| 7 | Preference: home −0.5, gym +0.5, none 0 | Equipment: home −0.5, gym +0.5 | weight 0.5 |

**Why centring.** Cosine similarity compares directions. Centring puts the "average" user at 0, so "low BMI and young" and "high BMI and older" point in opposite directions and are told apart.

**Why goal weight 3.** For any user, a programme with the right goal always scores higher than a programme for another goal. With weight 3 the goal part of the dot product is 9, while the other features add at most ±3.25. The equipment weight is small, so the preference only decides between otherwise similar programmes.

## 4. Algorithm

```
recommendWorkouts(profile, { k = 3, programs = workouts.json })
  1. read and check the profile (age, height, weight > 0; valid goal and activity)
        incomplete -> rule-based fallback
  2. safety filter (NFR-08):
        - no programme more than one level above the user's activity (low activity -> no advanced)
        - no intensity 3 programme if age >= 60 or BMI >= 35
  3. user vector u = toFeatureVector(profile); programme vector p = programToVector(programme)
  4. score = cosine(u, p) = (u · p) / (|u| |p|)
  5. sort by score (stable, so ties keep the library order) and return the top k (k-nearest neighbours)
  6. any error or no programme left -> rule-based fallback
```

This is a **content-based recommender with k-nearest neighbours**. There is no training step: the "model" is the programme library together with the feature mapping. It is deterministic: the same input always gives the same output.

### Why this approach

| Option | Why not chosen now / why chosen |
|---|---|
| Collaborative filtering (user–item matrix, SVD) | Needs the history and ratings of many users. The MVP has none (cold start). |
| Supervised classifier (KNN/RF on a public dataset, e.g. obesity levels [6]) | Predicts a body-type class, not a workout programme. A mapping class → programme would still be hand-made. This is planned as the next step (see `docs/09`, EV-02). |
| **Content-based KNN + cosine** ✅ | Works without user history, is explainable (the `reason` field), needs no new dependency (pure JavaScript, in line with NFR-09), and runs in microseconds. |
| Deep learning / LLM | Out of scope for the MVP (no data, no explainability, cost). |

## 5. Interface for APF-9

```js
const { recommendWorkouts } = require("./recommendation/aiModel");

recommendWorkouts({
    age: 25, height: 180, weight: 80,          // numbers (numeric strings are accepted)
    goal: "weight-loss",                       // weight-loss | muscle-gain | maintenance
    activity: "moderate",                      // low | moderate | high
    workoutPreference: "home"                  // optional: home | gym
});
```

The function returns an array, normally of 3 items, sorted from best to worst:

```json
[
    {
        "id": "wl-05",
        "name": "Metabolic Strength Circuit",
        "type": "mixed",
        "level": "intermediate",
        "equipment": "home",
        "daysPerWeek": 4,
        "durationMin": 45,
        "score": 0.98,
        "reason": "Built for weight loss; intermediate level for your moderate activity; intensity 2/3 for BMI 24.7 and age 25; matches your home preference.",
        "source": "knn",
        "description": "Dumbbell circuit with minimal rest to keep the heart rate up.",
        "exercises": [{ "exercise_name": "Goblet squat", "workout_type": "strength", "sets": 3, "repetitions": "12-15" }]
    }
]
```

The example shows the shape of the output only; the values are illustrative and the exercise list is shortened. Real outputs are in [evaluation.md](evaluation.md).

- `score` is the cosine similarity rounded to 3 decimals, or `null` for the fallback.
- `source` is `"knn"` for a model result and `"rule-based"` for the fallback. A fallback returns **one** item with `id` = `rule-<goal>-<activity>`. Its `reason` is `Rule-based fallback (<cause>).`, and `equipment` is `null`.
- The function never throws.

**Current integration.** In `backend/src/app.js` both `POST /api/recommendation` (guest) and `POST /api/recommendations` (logged in) add the field `aiRecommendations` to their response. The rest of the response is unchanged, and so is what is saved to the history.

**Not done yet (APF-9 / APF-11 / APF-12):**
- the AI programmes are not stored in the history table;
- the frontend does not show them;
- the guest form has no home/gym selector.

## 6. Limitations

- The intensity → BMI/age mapping and the feature weights were chosen by hand, not learned from data.
- 24 programmes is a small library. Within a goal, programmes with the same level, intensity and equipment get the same score, and the library order decides between them.
- Sex is not a feature of the model. It is used only in the calorie calculation.
- There is no feedback loop yet. Planned next steps: user ratings → collaborative filtering, workout history, and a supervised model compared with this baseline (EV-02).
