# 1. Project Proposal

| Item | Value |
|---|---|
| **Project title** | AI Personal Fitness Recommendation Platform |
| **Project type** | Diploma project, web application |
| **Field** | Artificial intelligence, recommender systems, personalised health and fitness |
| **University** | Astana IT University |
| **Scientific supervisor** | Dana Altynbek |
| **Repository** | https://github.com/St3rben11/prob-period-1 |
| **Task tracker** | YouTrack project **APF**, https://aipersonalfitness.youtrack.cloud |

## 1.1 Team

| Member | Role | Area of responsibility |
|---|---|---|
| Arman Amankeldi | Frontend lead, project coordinator | User interface, user dashboard, deployment and system integration, requirements (APF-1, APF-11, APF-12, APF-16) |
| Abzal Bakhtiyarov | AI & evaluation lead | Calorie and macronutrient calculation, AI recommendation model, testing and evaluation (APF-6, APF-13, APF-14, APF-15) |
| Bakhytzhan Abdilmazhit | Backend lead | System architecture, database, backend REST API, authentication and authorization (APF-2, APF-3, APF-4, APF-8, APF-9, APF-10) |

## 1.2 Problem statement

Physical inactivity is one of the leading risk factors for early death. WHO data cited by Chen & Wang [2] show that **more than 25% of adults worldwide** do not meet the minimum physical activity guidelines. Public health programmes and most consumer fitness apps give **generic** advice. They do not take into account a person's age, sex, body size, activity level and goal [2, 3]. People who are just starting out run into two problems:

1. **They don't know their numbers.** Daily energy needs and macronutrient targets depend on several parameters, such as basal metabolic rate (BMR), activity multipliers and the goal-dependent energy deficit or surplus. Most beginners cannot calculate these correctly themselves.
2. **Personalisation is locked or fragmented.** Popular apps either focus on food logging only, or on workouts only, or they put the personalised features behind a subscription (see [04-system-comparison.md](04-system-comparison.md)).

Research prototypes show that machine-learning recommenders can personalise physical-activity advice [2, 4, 6, 7]. However, the reviews in [1, 3] report that most such systems are evaluated only in the laboratory, are not transparent, and rarely reach end users. **There is a gap between accurate but opaque research models and simple but generic consumer tools.**

## 1.3 Goal

To design and develop a web platform that turns a user's personal and physical data into **transparent, personalised recommendations** for daily calories, macronutrients and workouts. The platform must have an architecture in which the current rule-based recommendation engine can later be replaced by a machine-learning model without changing the API.

Core pipeline:

```
User data → Validation → Data processing → Recommendation logic → Personalised recommendations
```

## 1.4 Objectives (tasks)

| # | Objective | YouTrack |
|---|---|---|
| O1 | Review existing research on AI/ML-based fitness and health recommenders (≥ 12 sources) | — |
| O2 | Compare existing fitness applications on a common set of criteria | — |
| O3 | Confirm the problem with potential users (3–5 interviews) and derive requirements | APF-1 |
| O4 | Design the system architecture and diagrams (context, use case, component, ER) | APF-2 |
| O5 | Design and implement the database | APF-3 |
| O6 | Implement the backend REST API with validation and error handling | APF-8 |
| O7 | Implement authentication and authorization | APF-10 |
| O8 | Implement the user profile module | APF-4 |
| O9 | Implement calorie and macronutrient calculation | APF-6 |
| O10 | Implement rule-based fitness and workout recommendation logic | APF-5, APF-7 |
| O11 | Design and integrate an ML recommendation model (content-based / KNN) | APF-9, APF-13 |
| O12 | Develop the frontend and user dashboard | APF-11, APF-12 |
| O13 | Test the system (unit, integration, functional) | APF-14 |
| O14 | Evaluate results against the baseline and acceptance criteria | APF-15 |
| O15 | Deploy and integrate the final version | APF-16 |

## 1.5 Target users

- **Primary:** beginners in fitness, especially university students aged 18–30, who train on their own (home or gym) and want simple guidance without a personal trainer.
- **Secondary:** people with a specific body-composition goal (weight loss, muscle gain, maintenance) who want to know their calorie and macronutrient targets.
- **Not targeted:** people with medical conditions that need clinical supervision, professional athletes, and children under 14.

## 1.6 Expected results

1. A working web application, available in a browser on desktop and mobile, in which a user can:
   - register and log in;
   - enter and update a fitness profile (age, sex, height, weight, activity level, goal, workout preference);
   - receive a daily calorie target, a macronutrient split and a structured workout plan;
   - view a history of previous recommendations on a dashboard.
2. A documented REST API and database schema.
3. An ML-based recommendation component compared against the rule-based baseline (see [09-verification-plan.md](09-verification-plan.md)).
4. Project documentation: literature review, comparisons, requirements, architecture, test report and evaluation.

## 1.7 Project scope

| In scope (MVP + final version) | Out of scope |
|---|---|
| Three goals: weight loss, muscle gain, maintenance | Medical diagnosis or clinical nutrition therapy |
| Profile-based calorie calculation (Mifflin-St Jeor + activity multiplier) | Meal plans, recipes and food logging |
| Macronutrient split (protein / fat / carbohydrates) | Integration with wearables (Google Fit, Apple Health); planned as future work |
| Rule-based workout plans with sets/reps by goal and level | Video exercise instructions, computer-vision form checking |
| Registration, login (JWT), profile, history | Native mobile apps (the web UI is responsive instead) |
| ML recommendation component trained on a public dataset | Payment or subscription features |
| English-language web interface | LLM chatbot coach; discussed in the literature review as future work |

**Disclaimer.** All recommendations are approximate and educational. They do not replace advice from a doctor, dietitian or certified trainer. The UI shows this disclaimer.

## 1.8 Engineering complexity

The project is more than a simple calculator for the following reasons:

- **Multi-tier architecture:** a browser client, a stateless REST API, an authentication layer and a relational database, with clear interfaces between them.
- **Security:** password hashing (scrypt), token-based sessions (JWT), input validation, and protection of personal health-related data.
- **Recommendation engine designed for replacement:** the rule-based engine and the planned ML model share one interface (`generateRecommendation(profile)`). This allows A/B comparison with the baseline.
- **Evaluation:** the work is checked against measurable criteria, including calculation accuracy against reference formulas, ML metrics (precision@k, accuracy), API performance and a usability score (SUS).
- **Process:** Git branching with YouTrack-linked commits and pull requests, automated tests, and tagged pre-defense versions.

## 1.9 Current status (pre-defense 1, 24 October 2026)

| Component | Status |
|---|---|
| Analysis documents (this folder) | Done (v1) |
| Frontend MVP form + results | Done |
| Backend API: guest recommendation, register/login, profile, history | Done, 16 automated tests passing |
| Database schema (SQLite) | Done |
| Rule-based recommendation engine | Done (baseline) |
| User dashboard, login UI | Planned |
| ML recommendation model | Planned (design in [07-architecture.md](07-architecture.md)) |
| Deployment | Planned |
