# 11. Scientific Supervisor Feedback

**Scientific supervisor:** Dana Altynbek

This log records the comments of the supervisor on key results and how the team responded. Every entry must come from an actual review (meeting, message or comments on the documents). Add the date and the form of the review.

> ⚠️ **To be filled in by the team with the supervisor's real comments.** The committee checks whether the supervisor reviewed the work and whether the review led to real improvements.

## 11.1 Review log

| # | Date | Form (meeting / chat / document comments) | Artefact reviewed | Supervisor's comment | Decision / action taken | Where it changed (file, commit, YouTrack) | Status |
|---|---|---|---|---|---|---|---|
| 1 | | | Project topic and proposal (doc 01) | | | | |
| 2 | | | Scope and target users | | | | |
| 3 | | | Literature review (doc 03) | | | | |
| 4 | | | Requirements and architecture (docs 06–07) | | | | |
| 5 | | | | | | | |

## 11.2 Questions prepared for the supervisor

These are decisions where the team would like the supervisor's opinion:

1. **Scope of "AI".** Is a profile-based KNN model compared against a rule-based baseline (doc 05 D6, doc 09 EV-02) enough AI content for the diploma? Or should a second model type (e.g. XGBoost as in [2]) be compared as well?
2. **Dataset.** Is the public obesity / eating-habits dataset used in [6] acceptable, or should we also collect our own anonymised data from students (this needs ethics and consent procedures)?
3. **Frontend framework.** Should we keep vanilla JS or move to React before building the dashboard (doc 05 D5)?
4. **Interviews.** Are 5 interviews with students enough evidence, or should we add a short online survey for more quantitative data?
5. **LLM features.** Should a RAG-grounded explanation layer [11] stay in "future work", or is it expected in the final version?

## 11.3 How feedback is handled

1. Each comment is logged in the table above within one day.
2. If action is needed, a YouTrack issue is created or updated and linked in the table.
3. The change is made on a branch, and the PR description references the comment number (e.g. "Supervisor comment #3").
4. The entry is marked **Resolved** after the PR is merged, or **Discussed / not applied** with a short justification.
