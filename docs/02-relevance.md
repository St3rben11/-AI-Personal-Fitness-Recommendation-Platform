2. Confirmation of Relevance

This section records the evidence that the problem is real and that our requirements come from facts rather than from guesses. Confirmed findings (backed by data or sources) are kept separate from assumptions (still to be confirmed).

2.1 Evidence sources
#	Source of evidence	Type	Status
E1	Interviews with 3 potential users (students who train on their own)	Primary	✅ Done, see 2.3 and 2.4
E2	Published data on physical inactivity and on limitations of fitness recommenders	Secondary (literature)	✅ Done, see 2.2
E3	Hands-on analysis of 4 existing apps (MyFitnessPal, Fitbod, Freeletics, Nike Training Club)	Secondary (product analysis)	✅ Done, see 04-system-comparison.md
E4	Discussion of scope with the scientific supervisor (Dana Altynbek)	Expert	✅ Done, see 11-supervisor-feedback.md
2.2 Evidence from data and literature
Finding	Evidence	Implication for the project
Physical inactivity is widespread	WHO data cited in [2]: more than 25% of adults do not meet minimum activity guidelines	There is a large potential user base that needs guidance
Generic programmes ignore individual differences	[2] reports that national programmes "lack the granularity required to address individual variability"	Recommendations must depend on the profile (age, sex, height, weight, activity, goal)
Personalised AI recommenders work in studies but are rarely transparent or deployed	[1] (34 studies) and [3] (24 studies): lab evaluation, no standard protocols, short-term only	Keep the logic explainable; show BMR/TDEE behind each number; evaluate against a clear baseline
New users have no history, which is the cold-start problem	[1, 6, 7, 8] all name cold start as a key difficulty	The MVP must work from the profile alone (rule-based / content-based), not from interaction history
Unsafe advice is a real risk	[12] shows large variability in the safety awareness of LLM coaches; [11] discusses hallucination	Add safety rules (calorie floor, protein limits, input ranges) and a disclaimer
Existing apps split features across apps or behind paywalls	Product analysis in doc 04 (e.g. gram-level macro goals are Premium in MyFitnessPal; Freeletics sells nutrition separately)	Combine calories, macros and workouts free of charge in one flow
2.3 Interview protocol (for E1)

Who: 3–5 people from the target group (age 18–30, train at least occasionally or want to start). Each team member interviews 1–2 people. Format: 10–15 minutes, in person or by call, in any language, with notes taken. Consent: explain the purpose, record no names (use R1, R2…), and collect no health data beyond what the respondent chooses to share.

Questions:

How often do you exercise now? At home or in a gym?
What is your main goal (lose weight, gain muscle, maintain, other)?
How do you currently decide what to train and how much to eat? (apps, YouTube, friends, trainer, nothing)
Which fitness or nutrition apps have you tried? What did you like or dislike? Did you pay?
Do you know your daily calorie needs? How did you find out?
Would you trust a recommendation more if the app showed how it was calculated?
Which data would you be comfortable entering (age, weight, height, sex, activity level, health conditions)?
Would you create an account to keep a history, or would you prefer to use it without registration?
What would make you stop using such an app?
On a scale of 1–5, how useful would a free tool that gives calories, macros and a workout plan in one place be for you?
2.4 Interview results

We interviewed 3 respondents from the target group. Answers were recorded in a shared form, without names. The answers to each question are listed below.

Question	Answers
Age	All three respondents are 18–22
How often do you exercise?	5 or more times a week; 3–4 times a week; does not exercise and does not plan to
Main fitness goal	Lose weight; gain muscle; maintain current shape (one respondent each)
How do you decide how to train and how much to eat?	Two respondents do not really plan it; one uses YouTube / social media. Nobody uses fitness apps, a personal trainer or advice from friends
Difficulties when planning workouts or diet; do current apps give personalised recommendations?	"It is difficult to create a workout and diet plan that matches my goals and schedule. Most fitness apps provide general recommendations rather than fully personalized ones."
"I actually don't use any apps because all of them cost money, and I can manage my body for free."
"It's hard to stay consistent because my schedule changes every week, and I don't know how to balance calories and protein without spending too much time on tracking."
Would you use an app that creates workout and nutrition recommendations from your personal data?	"Yes, if the recommendations are accurate and easy to follow."
"Maybe."
"Yes, if it adapts to my goals and daily routine and keeps my data private and secure."
How much more would you trust a recommendation if the app showed how it was calculated? (1–5)	5; 5; 4

Summary of interviews:

All respondents are students aged 18–22 with different goals (lose weight, gain muscle, maintain), so recommendations must depend on the user's goal and profile (supports F2).
Most respondents do not plan their training or nutrition at all, and the one who does relies on YouTube. Nobody uses fitness apps or a trainer.
Main pain points: generic, non-personalised recommendations; apps that cost money; and the effort of balancing calories and protein when the schedule changes (supports F4 and a simple, low-effort flow).
All respondents rated transparency highly (5, 5, 4): showing how a number was calculated increases trust (confirms A2).
Willingness to use the app depends on accuracy, ease of use, adaptation to the user's goals and routine, and data privacy (supports NFR-05).
2.5 Confirmed findings vs assumptions
ID	Statement	Status	Based on	Requirements affected
F1	Many adults are insufficiently active and need guidance	Confirmed	E2 [2]	Overall goal
F2	Recommendations must depend on individual characteristics	Confirmed	E2 [2, 3], E3, E1	FR-03, FR-06 to FR-09
F3	Users have no activity history at first (cold start)	Confirmed	E2 [1, 6, 7]	FR-06, FR-09 (profile-only logic)
F4	Existing apps split nutrition and workout features, or put them behind a paywall	Confirmed	E3, E1	FR-06 to FR-09 in one free flow
F5	Safety constraints are necessary	Confirmed	E2 [11, 12]	FR-05, NFR-08
A1	Beginners do not know their calorie needs	Assumption, check with Q5	E1	FR-06
A2	Users trust recommendations more when the calculation is shown	Confirmed (ratings 5, 5, 4)	E1	FR-07, UI
A3	Users are willing to register to keep a history	Assumption, check with Q8	E1	FR-01, FR-02, FR-10
A4	A free combined tool would be rated ≥ 4/5 by the target group	Assumption, check with Q10	E1	Overall value
A5	Users are comfortable sharing age, sex, height and weight	Assumption, check with Q7	E1	FR-03, NFR-05


After the interviews, move each assumption to *Confirmed* or *Rejected* and update [06-requirements.md](06-requirements.md) where needed.
