# 5. Technology Comparison

Each key technical decision is compared with 2–3 alternatives. Every choice is justified by the requirements (IDs from [06-requirements.md](06-requirements.md)) and by the team's constraints: 3 students, about 7 months, no budget, and existing skills in JavaScript.

Scores range from 1 (poor) to 5 (excellent). Weights reflect the importance of each criterion for this project.

## D1. Backend platform

| Criterion (weight) | **Node.js + Express** | Python + FastAPI | Java + Spring Boot |
|---|---|---|---|
| Team experience (0.30) | 5: whole team knows JS; the MVP was already started in Express | 3: known by one member | 2: little experience |
| Same language as frontend (0.15) | 5: shared JS, shared validation ideas | 2 | 2 |
| ML ecosystem (0.20) | 2: limited (TF.js, ml.js) | 5: scikit-learn, pandas | 3 |
| Speed of development for a small REST API (0.20) | 5 | 5 | 3: more boilerplate |
| Performance for our load, NFR-01 (0.15) | 4: non-blocking I/O, more than enough for <100 concurrent users | 4 | 5 |
| **Weighted score** | **4.25** | 3.80 | 2.85 |

**Decision: Node.js 22 + Express 4.** It best fits the team and the already-written code (FR-01 to FR-12, NFR-09). The weak ML ecosystem is mitigated by D6: the ML model is trained in Python offline, and only the trained model or rules are served.

## D2. Data storage

| Criterion (weight) | **SQLite** (via built-in `node:sqlite`) | PostgreSQL | MongoDB |
|---|---|---|---|
| Fit to data model (0.30): users → recommendations → workout items, fixed fields | 5: relational, foreign keys, CHECK constraints | 5: relational | 3: documents fit, but referential integrity is manual |
| Setup and deployment effort (0.25) | 5: single file, no server, nothing to install | 3: separate server or managed service | 3: separate server or Atlas |
| Data integrity / validation in the DB, NFR-06 and NFR-08 (0.20) | 4: CHECK, FK, transactions | 5 | 2 |
| Scalability (0.10) | 2: single writer | 5 | 5 |
| Testability, NFR-07 (0.15) | 5: in-memory DB per test | 3: needs a test container | 3 |
| **Weighted score** | **4.50** | 4.20 | 3.00 |

**Decision: SQLite for the MVP and diploma demo, with SQL kept portable to PostgreSQL.** Our data is small, strongly structured and relational. The built-in `node:sqlite` module needs no native compilation. Tests run against an in-memory database (16 automated tests). If the platform is deployed for many users, migration to PostgreSQL only means changing `db.js`, because the schema uses standard SQL types. MongoDB was rejected because the data has fixed relations and we want constraints (age 14–100, enumerated goals) enforced by the database.

## D3. Interaction between components

| Criterion (weight) | **REST + JSON over HTTP** | GraphQL | gRPC |
|---|---|---|---|
| Simplicity for browser client (0.35) | 5: native `fetch` | 3: needs a client library and a schema | 1: browser needs gRPC-Web proxy |
| Fit to our resources (0.25): few, simple resources | 5 | 3: flexible querying is not needed | 3 |
| Tooling and testability (0.20) | 5: curl, Postman, supertest | 4 | 3 |
| Performance (0.10) | 4 | 4 | 5 |
| Team experience (0.10) | 5 | 2 | 1 |
| **Weighted score** | **4.90** | 3.20 | 2.30 |

**Decision: REST + JSON.** The API has a small number of resources (auth, profile, recommendations), and a browser is the only client. REST is the simplest option to implement, test and document (see API examples in [08-ux-prototype.md](08-ux-prototype.md)).

## D4. Authentication

| Criterion (weight) | **JWT access token (stateless)** | Server-side session + cookie | External provider (Firebase Auth / OAuth) |
|---|---|---|---|
| Security when implemented correctly, NFR-04 (0.30) | 4: signed, short expiry (2 h) | 5: easy revocation | 5 |
| Fit with stateless REST API (0.25) | 5 | 3: needs a session store | 4 |
| Independence from third parties / data privacy, NFR-05 (0.20) | 5 | 5 | 2: user data held by a third party |
| Implementation effort (0.15) | 4 | 4 | 3: SDK setup, accounts |
| Learning value for the diploma (0.10) | 5 | 4 | 2 |
| **Weighted score** | **4.55** | 4.25 | 3.55 |

**Decision: JWT (HS256, 2-hour expiry) + scrypt password hashing** with Node's built-in `crypto`. The main drawback of JWT is that a token cannot be revoked before it expires. This is mitigated by the short expiry; refresh tokens or a deny-list will be considered for the final version.

## D5. Frontend

| Criterion (weight) | **Vanilla HTML/CSS/JS** | React | Vue |
|---|---|---|---|
| Complexity of our UI (0.30): form, results, dashboard | 4: enough for 3–4 views | 5 | 5 |
| Setup and build tooling (0.20) | 5: no build step; served by Express | 3: bundler | 3 |
| Team experience (0.25) | 5 | 3 | 2 |
| Maintainability as UI grows (0.25) | 2 | 5 | 4 |
| **Weighted score** | **3.95** | 4.10 | 3.60 |

**Decision: keep vanilla HTML/CSS/JS for pre-defense 1 and re-evaluate before building the dashboard (APF-12).** The scores are close. React wins only on maintainability, which becomes important when the dashboard and the login pages are added. The decision will be reviewed with the supervisor (logged in doc 11).

## D6. Recommendation / AI component

| Criterion (weight) | **Rule-based engine in Node + offline-trained KNN (Python, scikit-learn) exported to the backend** | TensorFlow.js model trained and served in Node | External LLM API generating recommendations |
|---|---|---|---|
| Works without user history, cold start (0.25) | 5 | 3: needs training data | 5 |
| Transparency and testability (0.25) | 5: deterministic, unit-tested | 3 | 1: non-deterministic, hard to test |
| Safety, NFR-08 (0.20) | 5: hard rules | 4 | 2: hallucination risk [11, 12] |
| Cost and privacy (0.15) | 5: free, local | 5 | 2: paid per call; user data sent to a third party |
| ML quality potential (0.15) | 3 | 4 | 4 |
| **Weighted score** | **4.70** | 3.65 | 2.80 |

**Decision:** keep the **rule-based engine as the baseline** (implemented in `calculations.js`). For APF-13, train a **KNN profile classifier** in Python (following the design of Lee & Jeong [6]) on a public dataset and serve it behind the same `generateRecommendation(profile)` interface. An LLM is only considered as a future explanation layer, grounded with RAG [11].

## 5.7 Summary of the selected stack

| Layer | Technology | Version |
|---|---|---|
| Frontend | HTML5, CSS3, vanilla JavaScript (fetch API) | — |
| Backend | Node.js, Express | Node ≥ 22.13, Express 4.21 |
| Auth | jsonwebtoken (JWT), Node `crypto.scrypt` | jsonwebtoken 9 |
| Database | SQLite via `node:sqlite` | SQLite 3.50 |
| Testing | `node:test`, supertest | supertest 7 |
| ML (planned) | Python 3, scikit-learn, pandas (offline training) | — |
| Diagrams | Mermaid (sources in `docs/architecture/source`) | — |
| Process | Git + GitHub (branches, PRs, tags), YouTrack | — |
