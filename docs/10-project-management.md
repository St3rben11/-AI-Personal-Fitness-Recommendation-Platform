# 10. Project Management and Risks

## 10.1 Tools and links

| Tool | Link | Use |
|---|---|---|
| GitHub repository | https://github.com/St3rben11/prob-period-1 | Code, documentation, diagrams, tests, tags |
| YouTrack project **APF** | https://aipersonalfitness.youtrack.cloud (project *AI Personal Fitness*) | Tasks, assignees, priorities, states, agile board, Gantt chart |
| Scientific supervisor | Dana Altynbek | Reviews of key results (doc 11) |

## 10.2 Team responsibilities

| Member | Responsibility | YouTrack issues |
|---|---|---|
| **Arman Amankeldi** | Frontend, user dashboard, deployment & integration; requirements coordination | APF-1, APF-11, APF-12, APF-16 |
| **Abzal Bakhtiyarov** | Fitness calculations, AI recommendation model, testing & evaluation | APF-6, APF-13, APF-14, APF-15 (+ APF-5, APF-7 proposed, see 10.3) |
| **Bakhytzhan Abdilmazhit** (YouTrack user *231012*) | System architecture, database, backend API, authentication, AI integration into the backend | APF-2, APF-3, APF-4, APF-8, APF-9, APF-10 |

## 10.3 Task backlog (YouTrack snapshot, 24.10.2026)

All issues are of type *Task* and are on the board *AI Personal Fitness*. Each issue description lists the expected result. The deadlines and acceptance criteria below are **proposed and must be entered in YouTrack**: the committee requires every task to have an owner, an expected result, acceptance criteria and a deadline.

| ID | Summary | Assignee | Priority | State | Proposed deadline | Acceptance criteria (short) | Deliverable / evidence |
|---|---|---|---|---|---|---|---|
| APF-1 | Define project requirements | Arman | Major | In Progress | 24.10.2026 | FR/NFR with priorities and acceptance criteria; reviewed by supervisor | `docs/06-requirements.md` |
| APF-2 | Design system architecture | Bakhytzhan | Major | In Progress | 24.10.2026 | Context, use case, component diagrams consistent with requirements | `docs/07-architecture.md`, `docs/architecture/` |
| APF-3 | Design database structure | Bakhytzhan | Major | In Progress → **Done** | 24.10.2026 | Schema with constraints and ER diagram; used by backend; tests pass | `database/schema.sql`, ER diagram |
| APF-4 | Develop user profile module | Bakhytzhan | Major | Open → **In Progress** | 15.11.2026 | `GET/PUT /api/profile` with validation; UI form saves the profile | `backend/src/app.js`, TC-A05 |
| APF-5 | Implement fitness recommendation logic | 231012 → *Abzal (proposed)* | Major | Open → **In Progress** | 15.11.2026 | Calories/macros/workout depend on profile; TC-U04, TC-U09 pass | `calculations.js` |
| APF-6 | Implement calorie and macronutrient calculation | Abzal | Major | Open → **In Progress** | 08.11.2026 | Mifflin-St Jeor, goal adjustment, safety floor; TC-U01 to TC-U07 pass | `calculations.js` |
| APF-7 | Develop workout recommendation module | 231012 → *Abzal (proposed)* | Major | Open | 29.11.2026 | Plans for all 9 goal × activity combinations; exercise library configurable | `calculations.js` / DB table |
| APF-8 | Develop backend API | Bakhytzhan | Major | Open → **In Progress** | 15.11.2026 | All endpoints in doc 07 §7.7; consistent error format; integration tests pass | `backend/`, TC-A01 to TC-A07 |
| APF-9 | Integrate AI recommendation component | Bakhytzhan | Major | Open | 31.01.2027 | Engine selectable by config; ML and rule outputs share one format | backend + `ml/` |
| APF-10 | Implement authentication and authorization | Bakhytzhan | Major | Open → **In Progress** | 15.11.2026 | Register/login, hashed passwords, JWT, 401 on protected routes; TC-A05 to TC-A07 pass | `auth.js` |
| APF-11 | Develop frontend application | Arman | Major | In Progress | 13.12.2026 | Login, registration, profile, results pages connected to API; responsive | `frontend/` |
| APF-12 | Implement user dashboard | Arman | Normal | In Progress | 13.12.2026 | Profile, targets, plan and history on one page (FR-11) | `frontend/` |
| APF-13 | Design and integrate AI recommendation model | Abzal | Major | In Progress | 31.01.2027 | KNN model trained and evaluated vs baseline (EV-02) | `ml/`, evaluation notebook |
| APF-14 | Implement system testing | Abzal | Normal | Open → **In Progress** | ongoing, 28.02.2027 | Test plan executed; report with expected/actual results | `docs/09`, test report |
| APF-15 | Evaluate system results | Abzal | Normal | Open | 31.03.2027 | EV-01 to EV-07 measured; tables/graphs; limitations discussed | `docs/evaluation-report.md` |
| APF-16 | Prepare deployment and system integration | Arman | Normal | Open | 30.04.2027 | Public URL; environment config; all components communicate | Deployment link |

**Issues to add in YouTrack:** APF-17 *Literature review and comparisons* (all), APF-18 *Relevance interviews (3–5 users)* (all, 1–2 interviews each), APF-19 *Pre-defense 1 documentation and README* (all), APF-20 *Hands-on verification of competitor apps* (Arman).

## 10.4 Stages and milestones

| Stage | Period | Main results | Milestone / Git tag |
|---|---|---|---|
| 1. Analysis & design | Sep – 24 Oct 2026 | Proposal, relevance, literature review, comparisons, requirements, architecture, prototype, verification plan, backend MVP | **`pre-defense-1`** (24.10.2026) |
| 2. Core implementation | 25 Oct – Dec 2026 | Auth UI, profile, dashboard, history, workout module, interviews done, usability test v1 | **`pre-defense-2`** (date set by department) |
| 3. AI component | Dec 2026 – Feb 2027 | KNN model, integration, ML evaluation vs baseline | — |
| 4. Testing & evaluation | Feb – Mar 2027 | Full test report, EV-01 to EV-07, fixes | — |
| 5. Deployment & thesis | Mar – May 2027 | Public deployment, thesis text, presentation | **`final-pre-defense`** |

Dates after pre-defense 1 are planned and will be adjusted to the official department schedule.

## 10.5 Development process (Git ↔ YouTrack)

- `main` holds only reviewed, working versions. All work happens on branches named `APF-<id>-<short-description>`, e.g. `APF-8-backend-api`.
- Commit messages start with the issue ID: `APF-10: Add JWT authentication middleware`.
- Each change goes through a **pull request** that names the YouTrack issue, describes the change and how it was tested (`npm test` output), and is **reviewed by another team member** before merging.
- The YouTrack issue gets a link to the PR or commit, and it is closed only when its acceptance criteria are met.
- Each member commits from **their own GitHub account**; shared accounts are not used.
- A Git tag marks each pre-defense version (`pre-defense-1`, `pre-defense-2`, `final-pre-defense`). Tags are never moved.
- Secrets are never committed (`.env` is ignored; `.env.example` has placeholders).

## 10.6 Risk register

Probability (P) and impact (I) are rated 1–3. Score = P × I.

| ID | Risk | P | I | Score | Mitigation | Owner |
|---|---|---|---|---|---|---|
| R1 | No suitable public dataset to train or evaluate the ML model | 2 | 3 | 6 | Use the obesity / eating-habits dataset already used in [6]; the rule-based engine remains a working fallback | Abzal |
| R2 | The ML model does not beat the rule-based baseline | 2 | 2 | 4 | Treat it as a valid research result (doc 09, EV-02); report honestly and keep rules | Abzal |
| R3 | Uneven contribution / commits from a single account | 2 | 3 | 6 | Branch-per-issue, own accounts, PR reviews, weekly check of the YouTrack board | All |
| R4 | Unsafe or incorrect recommendations harm a user | 1 | 3 | 3 | Safety rules (NFR-08), exhaustive grid test (EV-04), disclaimer (FR-14) | Abzal, Bakhytzhan |
| R5 | Leak of personal data | 1 | 3 | 3 | Hashing, JWT, minimal data, no secrets in Git, HTTPS on deployment | Bakhytzhan |
| R6 | Too few interview / usability participants | 2 | 2 | 4 | Recruit fellow students early; each member is responsible for 1–2 participants | All |
| R7 | Scope creep (meal plans, wearables, chatbot) | 2 | 2 | 4 | Fixed scope (doc 01 §1.7); new ideas go to the "Won't" list | Arman |
| R8 | `node:sqlite` is still marked experimental in Node 22 | 1 | 2 | 2 | Pin Node ≥ 22.13; the data layer is isolated in `db.js`, so switching to `better-sqlite3`/PostgreSQL is cheap | Bakhytzhan |
| R9 | Deployment platform limits (free tier sleeps, no persistent disk) | 2 | 2 | 4 | Choose a host with a persistent volume, or use managed PostgreSQL for deployment | Arman |
| R10 | Deadline conflicts with exams and other courses | 3 | 2 | 6 | Buffer weeks in the plan; priorities follow MoSCoW | All |

## 10.7 Dependencies

| Task | Depends on | Reason |
|---|---|---|
| APF-4 profile, APF-8 API | APF-3 database | Tables must exist |
| APF-10 auth | APF-8 API | Middleware protects endpoints |
| APF-11, APF-12 frontend & dashboard | APF-8, APF-10 | Need API and tokens |
| APF-5, APF-7 recommendation logic | APF-6 calculations | Calories and macros are inputs |
| APF-9 AI integration | APF-13 model, APF-8 API | Needs model and endpoint |
| APF-14 testing, APF-15 evaluation | All implementation tasks | Measures the finished system |
| APF-16 deployment | APF-8, APF-11 | Something to deploy |

## 10.8 Next steps (after pre-defense 1)

1. Conduct and record the 3–5 interviews (doc 02 §2.4) and update requirements.
2. Enter deadlines and acceptance criteria into YouTrack; reassign APF-5 and APF-7 if the team agrees.
3. Build the login, registration and dashboard UI on top of the existing API (APF-11, APF-12).
4. Prepare the dataset and train the first KNN model (APF-13).
5. Run the first usability test (EV-05) with the dashboard.
