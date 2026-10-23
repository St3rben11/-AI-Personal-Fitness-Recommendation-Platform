# 6. Requirements Specification

**Priorities (MoSCoW):** **M** = Must (needed for the diploma result), **S** = Should, **C** = Could, **W** = Won't (in this release).
**Source** refers to the evidence in [02-relevance.md](02-relevance.md) (F = confirmed finding, A = assumption) and in the literature review [n].
**Status** as of pre-defense 1: ✅ implemented and tested, 🟡 partly implemented, ⬜ not started.

Each requirement has an **acceptance criterion** that can be checked. The related test cases are listed in [09-verification-plan.md](09-verification-plan.md).

## 6.1 Functional requirements

| ID | Requirement | Priority | Source | Acceptance criterion | UC | Status |
|---|---|---|---|---|---|---|
| FR-01 | The user can register with email, password and name | M | A3 | `POST /api/auth/register` with a valid email and a password of ≥ 8 characters returns **201** and a token; a duplicate email returns **409**; invalid data returns **400** | UC-01 | ✅ backend, ⬜ UI |
| FR-02 | The user can log in and log out | M | A3 | Correct credentials return **200** + JWT; a wrong password returns **401**; after logout the token is removed from the client and protected pages are not shown | UC-02 | ✅ backend, ⬜ UI |
| FR-03 | The user can enter and update a fitness profile: name, age, sex, height, weight, activity level, goal, workout preference (home/gym) | M | F2, A5 | `PUT /api/profile` stores all fields; `GET /api/profile` returns the same values | UC-03 | ✅ backend, 🟡 UI (guest form) |
| FR-04 | The user selects one of 3 goals (weight loss, muscle gain, maintenance) and one of 3 activity levels (low, moderate, high) | M | F2 | Only these values are accepted; any other value returns 400 with a message naming the field | UC-04, UC-05 | ✅ |
| FR-05 | The system validates all input before processing | M | F5 | Age 14–100, height 100–250 cm, weight 30–300 kg, required fields present; invalid input returns **400** with a list of errors and the UI shows the message; no calculation is done | UC-10 | ✅ |
| FR-06 | The system calculates BMR (Mifflin-St Jeor) and TDEE (BMR × activity multiplier 1.2 / 1.55 / 1.725) | M | F2, [13] | For the reference profile (male, 25 y, 180 cm, 80 kg) BMR = **1805 kcal**; female, same data = **1639 kcal**; TDEE = BMR × multiplier ± 1 kcal | UC-06 | ✅ |
| FR-07 | The system calculates a daily calorie target adjusted to the goal: −15% (loss), 0% (maintenance), +10% (gain), never below 1500 kcal (men) / 1200 kcal (women) | M | F2, F5 | Loss < maintenance < gain for the same profile; maintenance = TDEE; the floor is applied | UC-06 | ✅ |
| FR-08 | The system calculates protein, fat and carbohydrate targets in grams | M | [15] | Protein 1.4–2.0 g/kg depending on goal; fat = 25% of kcal; energy of the macros = calorie target ± 10 kcal | UC-06 | ✅ |
| FR-09 | The system generates a workout plan for the goal and activity level: level, sessions per week, list of exercises with sets/reps or minutes | M | F3, [14] | Each of the 9 goal × activity combinations returns a non-empty plan; sessions per week = 3 / 4 / 5 for low / moderate / high | UC-07 | ✅ |
| FR-10 | Each recommendation of a logged-in user is saved and shown in the history (newest first) | S | A3, [1] | After `POST /api/recommendations`, `GET /api/recommendations` returns it with its exercises; other users cannot see it | UC-08 | ✅ backend, ⬜ UI |
| FR-11 | Dashboard: profile summary, current targets, latest workout plan and history | S | [1, 9] | A logged-in user sees all four blocks on one page, filled from the API | UC-09 | ⬜ (APF-12) |
| FR-12 | Guest mode: a calculation without registration, nothing stored | S | A3 | `POST /api/recommendation` works without a token; no rows are written to the DB | UC-06, UC-07 | ✅ |
| FR-13 | ML recommendation component (KNN profile classifier) available behind the same interface as the rule engine | S | [2, 6] | The model is trained on a public dataset; the backend can switch engine by configuration; evaluation report compares it with the baseline (doc 09) | UC-07 | ⬜ (APF-9, APF-13) |
| FR-14 | A medical disclaimer is shown together with every recommendation | M | F5 | The disclaimer text is visible on the results view and the dashboard | — | 🟡 (in docs, UI pending) |
| FR-15 | The administrator can maintain the exercise library and rule parameters without code changes | C | — | Exercises are loaded from a DB table or config file; a change is visible after restart | UC-11 | ⬜ |
| FR-16 | The user can delete the account and all personal data | C | [10] | `DELETE /api/profile` removes the user and the history (cascade) | — | ⬜ |
| FR-17 | Import of activity data from wearables | W | [4, 8] | — (future work) | — | — |
| FR-18 | LLM chat coach | W | [9, 11, 12] | — (future work, RAG-grounded) | — | — |

## 6.2 Non-functional requirements

| ID | Category | Requirement | Priority | Acceptance criterion / measurement | Status |
|---|---|---|---|---|---|
| NFR-01 | Performance | The recommendation endpoint responds quickly | S | p95 latency < **300 ms** at 50 concurrent users (autocannon, local server) | ⬜ to measure |
| NFR-02 | Usability | The main scenario is easy for a beginner | S | System Usability Scale (SUS) ≥ **70** with ≥ 5 target users; the task "get a recommendation" is completed in < 2 min without help | ⬜ |
| NFR-03 | Responsiveness | UI works on phones | M | No horizontal scroll and all controls usable at 360 px width (screenshot `docs/prototype/04-mobile.png`) | ✅ |
| NFR-04 | Security | Credentials and sessions are protected | M | Passwords are stored only as salted scrypt hashes; the hash is never returned by the API; JWT expires after 2 h; protected endpoints return **401** without a valid token (tests TC-A06, TC-A07) | ✅ |
| NFR-05 | Privacy | Only necessary personal data is collected and secrets are not committed | M | No secrets in Git (`.env` is in `.gitignore`, `.env.example` has placeholders); no data collected beyond FR-03 | ✅ |
| NFR-06 | Reliability | Invalid requests never crash the server | M | Malformed JSON and invalid values return 4xx with JSON `{error, details}`; no 5xx in the test suite | ✅ |
| NFR-07 | Maintainability | Code is modular and covered by tests | S | Calculation, validation, auth and DB are separate modules; line coverage ≥ **80%** for `calculations.js` and `validation.js` | ✅ |
| NFR-08 | Safety | Recommendations stay within safe ranges | M | Calorie floor (1500/1200 kcal), protein 1.4–2.0 g/kg, input ranges per FR-05 (tests TC-U05, TC-U07) | ✅ |
| NFR-09 | Portability / deployment | Easy to run and deploy | M | `npm install && npm start` runs the full app (API + UI) on Node ≥ 22.13 with no extra services | ✅ |
| NFR-10 | Accuracy | Calculations match reference formulas | M | BMR equals the Mifflin-St Jeor value to ± 1 kcal for all test profiles | ✅ |
| NFR-11 | Compatibility | Works in current browsers | S | The main scenario works in the latest Chrome, Firefox and Safari | ⬜ |
| NFR-12 | Explainability | The user can see how targets were obtained | S | BMR and TDEE are shown with the calorie target; the formulas are documented | ✅ |

## 6.3 Use cases (summary)

| UC | Name | Actor | Main success scenario |
|---|---|---|---|
| UC-01 | Register account | Guest | Opens sign-up → enters name, email, password → account created, logged in |
| UC-02 | Log in / log out | Registered user | Enters email and password → receives a session → can open the dashboard |
| UC-03 | Enter / update fitness profile | Guest, registered user | Fills in the form (includes UC-04, UC-05, UC-10) → profile saved (registered) or used once (guest) |
| UC-04 | Select fitness goal | (included) | Chooses weight loss / muscle gain / maintenance |
| UC-05 | Select activity level | (included) | Chooses low / moderate / high |
| UC-06 | Get calorie & macronutrient targets | Guest, registered user | Submits profile → sees calories, BMR, TDEE, protein, fat, carbs |
| UC-07 | Get workout recommendation | Guest, registered user | Submits profile → sees plan summary, sessions per week, exercises |
| UC-08 | View recommendation history | Registered user | Opens history → sees past recommendations, newest first |
| UC-09 | View dashboard | Registered user | Opens dashboard → profile, current targets, latest plan, history |
| UC-10 | Validate input data | (included) | Invalid values → error message, no calculation |
| UC-11 | Maintain exercise library & rules | Administrator | Edits exercise list / parameters → new recommendations use them |

## 6.4 Traceability

| Requirement | Design element | YouTrack | Test |
|---|---|---|---|
| FR-01, FR-02, NFR-04 | `auth.js`, `/api/auth/*` | APF-10 | TC-A05, TC-A06, TC-A07 |
| FR-03, FR-04, FR-05 | `validation.js`, `/api/profile`, `users` table | APF-4, APF-8 | TC-A03, TC-A04, TC-A05 |
| FR-06 to FR-08, NFR-08, NFR-10 | `calculations.js` | APF-6 | TC-U01 to TC-U07 |
| FR-09 | `calculations.js` (`recommendWorkout`) | APF-5, APF-7 | TC-U08, TC-U09 |
| FR-10 | `db.js`, `recommendations`, `workout_items` tables | APF-3, APF-8 | TC-A05 |
| FR-11 | Dashboard page | APF-12 | TC-F05 (planned) |
| FR-12 | `/api/recommendation` | APF-8, APF-11 | TC-A02 |
| FR-13 | ML module | APF-9, APF-13 | EV-02 |
