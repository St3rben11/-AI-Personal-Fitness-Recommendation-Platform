# 4. Comparison of Existing Systems

## 4.1 Selection of systems

We selected four widely used consumer applications. Together they cover the two halves of our problem, nutrition targets and workout recommendations:

| System | Why it was selected |
|---|---|
| **MyFitnessPal** (MFP) | The best-known calorie and macronutrient tracker; computes a calorie goal from the profile |
| **Fitbod** | Algorithmic strength-workout generator; publicly documents its personalisation logic |
| **Freeletics** | "AI Coach" that builds bodyweight and gym training plans; sells nutrition coaching separately |
| **Nike Training Club** (NTC) | Large free workout library with programmes; a free benchmark without a paywall |

Research prototypes from the literature review ([4], [6], [7]) are not included in this table, because they are not available to end users. They are compared at the method level in [03-literature-review.md](03-literature-review.md).

**Method.** The information comes from official app-store listings, the vendors' own help and blog pages, and one independent review, all accessed on 24 October 2026 (sources S1–S5 below). "Not stated" means that no public source confirmed the feature. Hands-on verification of each app by the team is planned before pre-defense 2.

## 4.2 Comparison criteria

| ID | Criterion | Why it matters for our users |
|---|---|---|
| C1 | Calorie target from personal profile | Beginners don't know their energy needs (A1) |
| C2 | Gram-level macronutrient targets | Needed to act on the goal (weight loss / muscle gain) |
| C3 | Personalised workout recommendations | The second half of the problem |
| C4 | Nutrition and training in **one** product | Fragmentation is a pain point (F4) |
| C5 | Works for a new user without history (cold start) | Literature [1, 6, 7]; first-use experience |
| C6 | Transparency of how recommendations are produced | Trust (A2); opaque models are a known limitation [1, 4] |
| C7 | Cost of the personalised features | Students' budget |
| C8 | Platform / access | Our target group uses laptops and phones |

## 4.3 Comparison table

| Criterion | MyFitnessPal | Fitbod | Freeletics | Nike Training Club | **Our platform (target)** |
|---|---|---|---|---|---|
| **C1** Calorie target from profile | ✅ From weight, goal weight, activity level and weekly goal [S1] | ❌ Not stated (training-focused) [S2] | ⚠️ Only in separate Nutrition app / bundle [S3] | ❌ Not stated [S4] | ✅ Mifflin-St Jeor × activity, adjusted to goal |
| **C2** Gram-level macro targets | ⚠️ **Premium only**; free plan has total calories [S1] | ❌ | ⚠️ Paid bundle [S3] | ❌ | ✅ Protein / fat / carbs in grams, free |
| **C3** Personalised workouts | ❌ Exercise *logging* only [S1] | ✅ Scores 800+ exercises by muscle recovery, goal, experience, equipment, history [S2] | ✅ AI Coach from goal, level, preferences, equipment, time, feedback [S3] | ⚠️ Programmes chosen by level; no adaptive personalisation described [S4] | ✅ Rule-based by goal + activity level (ML planned) |
| **C4** Nutrition + training in one product | ❌ | ❌ | ❌ Two apps / bundle [S3] | ❌ | ✅ |
| **C5** Works without history | ✅ | ✅ Onboarding questions; new exercises seeded from similar users [S2] | ✅ Onboarding questions [S3] | ✅ (static content) | ✅ Profile-only |
| **C6** Transparency | ⚠️ Goal shown, formula not explained in the app | ✅ Algorithm described publicly (recovery %, estimated 1RM) [S2] | ❌ "AI Coach" not explained | n/a (no algorithm) | ✅ BMR, TDEE and rules shown and documented |
| **C7** Cost | Free basic; Premium $19.99/mo or $79.99/yr [S1] | Subscription, e.g. $12.99–15.99/mo or $79.99–95.99/yr; free trial [S5] | Limited free tier (34 HIIT workouts); paid plans $34.99–89.99 per 3–12 months [S3] | Free [S4] | Free (academic project) |
| **C8** Platform | Mobile + web | Mobile (iOS/Android) | Mobile (iOS/Android) | Mobile (iOS/Android) | Responsive web (desktop and mobile browser) |

✅ supported  ⚠️ partly / paid  ❌ not supported or not stated

## 4.4 Analysis

- **No single free product covers C1 to C4 together.** MFP is strong for calories but gives no workouts, and its gram-level macro goals are paid. Fitbod and Freeletics personalise training well, but nutrition is either absent or sold separately. NTC is free but static.
- **The strongest personalisation (Fitbod, Freeletics) is behind a subscription.** That is a barrier for students.
- **Transparency varies.** Fitbod is the positive example: it publicly explains its scoring (muscle recovery, estimated one-rep max). We follow that approach and show intermediate values such as BMR and TDEE.
- **Lessons we adopt:** onboarding questions solve cold start (all four apps do this); recovery and history-aware adaptation (Fitbod) is a good *future* extension once our users have logged history.

## 4.5 Why the proposed solution is needed

The comparison supports confirmed finding **F4** in [02-relevance.md](02-relevance.md). Our target users need a **single, free, transparent** tool that turns a basic profile into calorie, macronutrient *and* workout guidance from the first use. Our platform does not try to beat Fitbod's workout engine or MFP's food database. Its value is the **combination and the explainability**, together with an architecture prepared for an ML model that can be measured against the rule-based baseline.

**Limitations of this comparison.** It is based on public descriptions, and features and prices change often. Features hidden inside the apps may be missing. The team will verify the table hands-on (task added to YouTrack) and update it for pre-defense 2.

## 4.6 Sources

- [S1] RepReturn, "MyFitnessPal Review: Free vs. Premium — Is It Worth It?", https://repreturn.com/myfitnesspal-review/ (accessed 24.10.2026)
- [S2] Fitbod, "How the Fitbod algorithm works", https://fitbod.me/blog/fitbod-algorithm (accessed 24.10.2026)
- [S3] Freeletics: Workouts & Fitness, Apple App Store listing, https://apps.apple.com/app/id654810212 (accessed 24.10.2026)
- [S4] Nike Training Club, Apple App Store listing, https://apps.apple.com/us/app/-/id301521403 (accessed 24.10.2026)
- [S5] Fitbod: Gym & Fitness Planner, Apple App Store listing, https://apps.apple.com/app/id1041517543 (accessed 24.10.2026)
