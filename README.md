# AI Personal Fitness Recommendation Platform

A web platform that turns a user's personal and physical data (age, sex, height, weight, activity level, goal) into **transparent, personalised recommendations** for daily calories, macronutrients and workouts. A rule-based recommendation engine serves as the baseline, and an ML model will be compared against it.

> Diploma project, Astana IT University, 2026–2027. Current version: **pre-defense 1** (tag `pre-defense-1`).

## Problem, users and expected results

- **Problem:** more than 25% of adults are insufficiently active, and most guidance is generic. Research recommenders are accurate but opaque and heavy; consumer apps are generic or put personalisation behind a paywall ([docs/01](docs/01-project-proposal.md), [docs/04](docs/04-system-comparison.md)).
- **Target users:** beginners and university students (18–30) who train on their own and want simple guidance.
- **Expected results:** a responsive web app with registration, a fitness profile, calorie and macro targets, workout plans, history and a dashboard; an ML recommendation component evaluated against the rule-based baseline; full project documentation.

## Team

| Member | Responsibilities |
|---|---|
| Arman Amankeldi | Frontend, user dashboard, deployment & integration |
| Abzal Bakhtiyarov | Fitness calculations, AI recommendation model, testing & evaluation |
| Bakhytzhan Abdilmazhit | System architecture, database, backend API, authentication |

**Scientific supervisor:** Dana Yespenbetova

## Scope

**In scope:** three goals (weight loss, muscle gain, maintenance); calorie target (Mifflin-St Jeor × activity, goal-adjusted, with a safety floor); macronutrients in grams; rule-based workout plans; registration and login (JWT); profile and history; ML component (KNN) compared with the baseline.
**Out of scope:** medical advice, meal plans and food logging, wearables, native mobile apps, payments, LLM chatbot. Full list: [docs/01 §1.7](docs/01-project-proposal.md).

## Current status (24.10.2026)

| Part | Status |
|---|---|
| Analysis and design documents (`docs/`) | ✅ v1 |
| Backend REST API: guest recommendation, register/login, profile, history | ✅ 16 automated tests passing, 98% line coverage |
| Database schema (SQLite) | ✅ |
| Rule-based recommendation engine | ✅ |
| Frontend: profile form + results | ✅ |
| Login/registration UI, dashboard | ⬜ planned (APF-11, APF-12) |
| ML recommendation model | ⬜ planned (APF-13) |
| Deployment | ⬜ planned (APF-16) |

## Technologies

Node.js ≥ 22.13 · Express 4 · SQLite (`node:sqlite`) · JWT (`jsonwebtoken`) + scrypt · HTML/CSS/JavaScript · `node:test` + supertest · Mermaid diagrams · planned: Python + scikit-learn for the ML model. Justification: [docs/05-technology-comparison.md](docs/05-technology-comparison.md).

## Links

- **YouTrack project (APF):** https://aipersonalfitness.youtrack.cloud
- **Documentation:**
  1. [Project proposal](docs/01-project-proposal.md)
  2. [Confirmation of relevance](docs/02-relevance.md)
  3. [Literature review](docs/03-literature-review.md)
  4. [Comparison of existing systems](docs/04-system-comparison.md)
  5. [Technology comparison](docs/05-technology-comparison.md)
  6. [Requirements specification](docs/06-requirements.md)
  7. [Architecture and diagrams](docs/07-architecture.md) (sources in `docs/architecture/source/`)
  8. [UX and prototype](docs/08-ux-prototype.md)
  9. [Verification and evaluation plan](docs/09-verification-plan.md)
  10. [Project management and risks](docs/10-project-management.md)
  11. [Supervisor feedback](docs/11-supervisor-feedback.md)

## Repository structure

```text
.
├── backend/                 Node.js + Express REST API
│   ├── src/
│   │   ├── server.js        entry point (reads .env)
│   │   ├── app.js           routes, error handling, serves frontend
│   │   ├── auth.js          scrypt hashing, JWT, auth middleware
│   │   ├── validation.js    input validation
│   │   ├── calculations.js  recommendation engine (BMR, TDEE, macros, workouts)
│   │   └── db.js            SQLite data access
│   ├── test/                unit + integration tests
│   ├── .env.example         configuration template
│   └── package.json
├── frontend/                index.html, style.css, script.js
├── database/schema.sql      database schema
├── docs/                    project documentation (01–11)
│   ├── architecture/        exported diagrams (PNG) + source/ (Mermaid .mmd)
│   └── prototype/           screenshots, API examples
└── tests/README.md          test overview
```

## Installation and running

Requirements: **Node.js 22.13 or newer**.

```bash
git clone https://github.com/St3rben11/prob-period-1.git
cd prob-period-1/backend
cp .env.example .env        # set JWT_SECRET to a long random string
npm install
npm start                   # http://localhost:3000 serves both the UI and the API
```

The SQLite database file is created automatically at `backend/data/fitness.db`.

## Testing

```bash
cd backend
npm test                    # 16 unit + integration tests
npm run test:coverage       # with line coverage
```

Test plan and test cases: [docs/09-verification-plan.md](docs/09-verification-plan.md).

## API overview

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | — | Service status |
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Log in, get JWT |
| GET / PUT | `/api/profile` | Bearer | Read / update fitness profile |
| POST | `/api/recommendation` | — | Guest recommendation (not stored) |
| POST | `/api/recommendations` | Bearer | Generate from profile and save |
| GET | `/api/recommendations` | Bearer | Recommendation history |

Examples: [docs/08-ux-prototype.md §8.4](docs/08-ux-prototype.md).

## Contribution workflow

Branch per YouTrack issue (`APF-8-backend-api`), commit messages prefixed with the issue ID (`APF-8: ...`), pull request with a description, the linked issue and test results, reviewed by another team member before merging into `main`. Details: [docs/10 §10.5](docs/10-project-management.md).

## Disclaimer

Recommendations are approximate and educational. They do not replace consultation with a doctor, dietitian or certified trainer.
