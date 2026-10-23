# 9. Verification and Evaluation Plan

The plan answers one question: **how will we prove that the project goal has been reached?** The goal is personalised, correct and safe recommendations delivered through a usable web platform. We use two complementary checks:

- **Verification**: "did we build it right?" This means tests against the requirements in [06-requirements.md](06-requirements.md).
- **Evaluation**: "did we build the right thing, and is it better than the baseline?" This means metrics measured under fixed conditions.

## 9.1 Test levels and tools

| Level | What | Tool | Who | When |
|---|---|---|---|---|
| Unit | `calculations.js`, `validation.js` | `node:test` (built in) | Abzal, Bakhytzhan | Every commit (`npm test`) |
| Integration (API + DB) | All endpoints with an in-memory SQLite DB | `node:test` + supertest | Bakhytzhan | Every commit |
| Functional / end-to-end | User scenarios in the browser | Manual checklist; Playwright planned | Arman, Abzal | Before each pre-defense |
| Performance | Latency under load | autocannon | Bakhytzhan | Pre-defense 2 |
| Usability | SUS questionnaire + task completion | Google Form, observation | Whole team | Pre-defense 2 (≥ 5 users) |
| ML evaluation | Model vs baseline | Python, scikit-learn | Abzal | After APF-13 |

**Rule:** a pull request is merged only if `npm test` passes and another team member has reviewed it.

## 9.2 Test cases

### Automated (implemented, 16/16 passing as of 24.10.2026)

| ID | Requirement | Input | Expected result | Status |
|---|---|---|---|---|
| TC-U01 | FR-06, NFR-10 | male, 25 y, 180 cm, 80 kg | BMR = 1805 | ✅ Pass |
| TC-U02 | FR-06 | same, female | BMR = 1639 | ✅ Pass |
| TC-U03 | FR-06 | BMR 1000 × each level | 1200 / 1550 / 1725 | ✅ Pass |
| TC-U04 | FR-07 | same profile, 3 goals | loss < maintenance < gain; maintenance = TDEE | ✅ Pass |
| TC-U05 | FR-07, NFR-08 | female, 80 y, 145 cm, 38 kg, low, loss | calories = 1200 (floor) | ✅ Pass |
| TC-U06 | FR-08 | 3 goals | macro energy = calories ± 10 kcal | ✅ Pass |
| TC-U07 | FR-08, NFR-08 | 3 goals | protein 1.4–2.0 g/kg | ✅ Pass |
| TC-U08 | FR-09 | muscle gain, low vs high | 3 vs 5 sessions; plans differ by goal | ✅ Pass |
| TC-U09 | FR-09 (personalisation) | User A vs User B from the project description | different calories and plans | ✅ Pass |
| TC-A01 | NFR-09 | `GET /api/health` | 200 | ✅ Pass |
| TC-A02 | FR-12 | valid guest profile | 200 with calories, macros, exercises | ✅ Pass |
| TC-A03 | FR-05 | age −5; weight "abc"; goal "fly"; empty height; empty body | 400 with details for each | ✅ Pass |
| TC-A04 | NFR-06 | malformed JSON | 400 (not 500) | ✅ Pass |
| TC-A05 | FR-01 to FR-03, FR-10 | register → duplicate → login → recommendation before profile → profile → recommendation → history | 201 → 409 → 200 → 422 → 200 → 201 → 1 history item with exercises | ✅ Pass |
| TC-A06 | FR-02, NFR-04 | wrong password; no token; fake token | 401 each | ✅ Pass |
| TC-A07 | NFR-04 | register | password not in response or in the DB | ✅ Pass |

Line coverage (`npm run test:coverage`): `calculations.js` 100%, `validation.js` 100%, `auth.js` 100%, `app.js` 94%, `db.js` 94%; **98% overall** (NFR-07 ✅).

### Manual functional tests (to run before each pre-defense)

| ID | Scenario | Expected result |
|---|---|---|
| TC-F01 | Guest fills in the form with valid data for each of the 3 goals | A recommendation is shown; calories change with the goal |
| TC-F02 | Guest enters invalid values (negative age, empty weight) | Error message names the field; no numbers shown |
| TC-F03 | Open on a phone at 360–390 px width | No horizontal scroll; all controls usable |
| TC-F04 | Register → log in → edit profile → generate → see history | All steps succeed; data persists after a page reload |
| TC-F05 | Dashboard shows profile, targets, plan, history | All four blocks filled (after APF-12) |
| TC-F06 | Log out → open dashboard | Redirected to log in |

## 9.3 Evaluation metrics, measurement conditions and baseline

| ID | Question | Metric | Measurement conditions | Baseline / reference | Target |
|---|---|---|---|---|---|
| EV-01 | Are the calculations correct? | Absolute error of BMR and TDEE | 30 synthetic profiles (all sex × goal × activity combinations, ages 18–65, BMI 17–35) computed independently in a spreadsheet | Reference formula [13] computed by hand | 0 profiles with error > 1 kcal |
| EV-02 | Does the ML component improve on the rules? | Segment classification accuracy and macro-F1; precision@3 of recommended workout templates | Public obesity / eating-habits dataset as used in [6] (2,111 records); stratified 70/30 split, 5-fold CV, fixed random seed | **Rule-based engine** (current `calculations.js`) and a majority-class classifier | ML ≥ baseline accuracy and macro-F1 > 0.75; otherwise keep the rules and report why |
| EV-03 | Are recommendations really personalised? | Number of distinct plans and coefficient of variation of calories over the 30 test profiles | Same 30 profiles | "Generic" app = one plan for all | All 9 goal × activity combinations produce distinct outputs |
| EV-04 | Are recommendations safe? | Number of outputs that violate a safety rule (calories < floor, protein outside 1.4–2.0 g/kg, plan > 5 sessions for low activity) | Exhaustive grid: age 14–100 step 5, height 100–250 step 10, weight 30–300 step 10, all enums | — | **0 violations** |
| EV-05 | Is the platform usable? | SUS score; task success rate; time on task | ≥ 5 target users (students, 18–30), task: "get your recommendation" and "find your history"; observed, no help | SUS 68 = industry average | SUS ≥ 70; success ≥ 90%; < 2 min |
| EV-06 | Is it fast enough? | p50/p95 latency, error rate | `autocannon -c 50 -d 30` against `POST /api/recommendation` on a local laptop, production mode | — | p95 < 300 ms; 0 errors |
| EV-07 | Is it fair across groups? | Difference in EV-04 violations and EV-05 SUS between sexes and age groups | Same data split by group | Fairness analysis approach from [2] | No group with violations; SUS gap reported |

**Note on the ML baseline.** Results in [3] show that ML models do not always beat simpler approaches, because performance depends on the data. Our success criterion is therefore an *honest comparison* with the rule-based engine, and keeping the rules is an acceptable result if ML does not improve on them.

## 9.4 Reporting

- Test results are attached to each pull request (CI output or a screenshot of `npm test`).
- The evaluation results (EV-01 to EV-07) go into `docs/evaluation-report.md` (APF-15) with tables and charts, and the limitations found are discussed.
- Defects are logged as YouTrack issues of type *Bug*, linked to the failing test ID.
