# 2. Confirmation of Relevance

This section records the evidence that the problem is real and that our requirements come from facts rather than from guesses. **Confirmed findings** (backed by data or sources) are kept separate from **assumptions** (still to be confirmed).

## 2.1 Evidence sources

| # | Source of evidence | Type | Status |
|---|---|---|---|
| E1 | Interviews with 3–5 potential users (students who train on their own) | Primary | ⚠️ **To be completed by the team, see 2.3 and 2.4** |
| E2 | Published data on physical inactivity and on limitations of fitness recommenders | Secondary (literature) | ✅ Done, see 2.2 |
| E3 | Hands-on analysis of 4 existing apps (MyFitnessPal, Fitbod, Freeletics, Nike Training Club) | Secondary (product analysis) | ✅ Done, see [04-system-comparison.md](04-system-comparison.md) |
| E4 | Discussion of scope with the scientific supervisor (Dana Altynbek) | Expert | ⚠️ To be recorded in [11-supervisor-feedback.md](11-supervisor-feedback.md) |

## 2.2 Evidence from data and literature

| Finding | Evidence | Implication for the project |
|---|---|---|
| Physical inactivity is widespread | WHO data cited in [2]: more than 25% of adults do not meet minimum activity guidelines | There is a large potential user base that needs guidance |
| Generic programmes ignore individual differences | [2] reports that national programmes "lack the granularity required to address individual variability" | Recommendations must depend on the profile (age, sex, height, weight, activity, goal) |
| Personalised AI recommenders work in studies but are rarely transparent or deployed | [1] (34 studies) and [3] (24 studies): lab evaluation, no standard protocols, short-term only | Keep the logic explainable; show BMR/TDEE behind each number; evaluate against a clear baseline |
| New users have no history, which is the *cold-start* problem | [1, 6, 7, 8] all name cold start as a key difficulty | The MVP must work from the profile alone (rule-based / content-based), not from interaction history |
| Unsafe advice is a real risk | [12] shows large variability in the *safety awareness* of LLM coaches; [11] discusses hallucination | Add safety rules (calorie floor, protein limits, input ranges) and a disclaimer |
| Existing apps split features across apps or behind paywalls | Product analysis in doc 04 (e.g. gram-level macro goals are Premium in MyFitnessPal; Freeletics sells nutrition separately) | Combine calories, macros and workouts free of charge in one flow |

## 2.3 Interview protocol (for E1)

**Who:** 3–5 people from the target group (age 18–30, train at least occasionally or want to start). Each team member interviews 1–2 people. **Format:** 10–15 minutes, in person or by call, in any language, with notes taken. **Consent:** explain the purpose, record no names (use R1, R2…), and collect no health data beyond what the respondent chooses to share.

Questions:

1. How often do you exercise now? At home or in a gym?
2. What is your main goal (lose weight, gain muscle, maintain, other)?
3. How do you currently decide *what* to train and *how much* to eat? (apps, YouTube, friends, trainer, nothing)
4. Which fitness or nutrition apps have you tried? What did you like or dislike? Did you pay?
5. Do you know your daily calorie needs? How did you find out?
6. Would you trust a recommendation more if the app showed *how* it was calculated?
7. Which data would you be comfortable entering (age, weight, height, sex, activity level, health conditions)?
8. Would you create an account to keep a history, or would you prefer to use it without registration?
9. What would make you stop using such an app?
10. On a scale of 1–5, how useful would a free tool that gives calories, macros and a workout plan in one place be for you?

## 2.4 Interview results (to be filled in)

> ⚠️ **Fill this table with the real answers before submission.** Do not invent responses. The committee checks whether requirements are based on *actual* data.

| ID | Profile (age, activity, goal) | Current approach | Main pain points | Apps tried / paid? | Wants transparency? (Q6) | Account vs guest (Q8) | Usefulness 1–5 (Q10) | Interviewer, date |
|---|---|---|---|---|---|---|---|---|
| R1 | | | | | | | | |
| R2 | | | | | | | | |
| R3 | | | | | | | | |
| R4 | | | | | | | | |
| R5 | | | | | | | | |

**Summary of interviews** (write 3–5 bullet points after filling the table):

- …

## 2.5 Confirmed findings vs assumptions

| ID | Statement | Status | Based on | Requirements affected |
|---|---|---|---|---|
| F1 | Many adults are insufficiently active and need guidance | **Confirmed** | E2 [2] | Overall goal |
| F2 | Recommendations must depend on individual characteristics | **Confirmed** | E2 [2, 3], E3 | FR-03, FR-06 to FR-09 |
| F3 | Users have no activity history at first (cold start) | **Confirmed** | E2 [1, 6, 7] | FR-06, FR-09 (profile-only logic) |
| F4 | Existing apps split nutrition and workout features, or put them behind a paywall | **Confirmed** | E3 | FR-06 to FR-09 in one free flow |
| F5 | Safety constraints are necessary | **Confirmed** | E2 [11, 12] | FR-05, NFR-08 |
| A1 | Beginners do not know their calorie needs | Assumption, check with Q5 | E1 | FR-06 |
| A2 | Users trust recommendations more when the calculation is shown | Assumption, check with Q6 | E1 | FR-07, UI |
| A3 | Users are willing to register to keep a history | Assumption, check with Q8 | E1 | FR-01, FR-02, FR-10 |
| A4 | A free combined tool would be rated ≥ 4/5 by the target group | Assumption, check with Q10 | E1 | Overall value |
| A5 | Users are comfortable sharing age, sex, height and weight | Assumption, check with Q7 | E1 | FR-03, NFR-05 |

After the interviews, move each assumption to *Confirmed* or *Rejected* and update [06-requirements.md](06-requirements.md) where needed.
