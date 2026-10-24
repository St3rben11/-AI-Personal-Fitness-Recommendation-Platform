# 11. Scientific Supervisor Feedback

Scientific supervisor: Dana Yespenbetova

This log records the comments of the supervisor on key project results and how the team responded. Every entry comes from an actual review (meeting, message or comments on the documents). Add the date and the form of the review.

## 11.1 Review Log

| # | Date | Form (meeting / chat / document comments) | Artefact reviewed | Supervisor's comment | Decision / action taken | Where it changed (file, commit, YouTrack) | Status |
|---|---|---|---|---|---|---|---|
| 1 | 24.10.2026 | Chat | Project documentation and implementation | The project demonstrates good progress at the current pre-defense stage. The problem statement, target audience, project scope and supporting documentation are clearly defined. The separation of backend, frontend, database and recommendation logic provides a sound foundation. | Continue development based on the current architecture and documentation. | Project repository | Resolved |
| 2 | 24.10.2026 | Chat | Recommendation logic | Provide clear justification for the formulas and assumptions used to calculate daily calorie requirements, macronutrient targets and workout recommendations. Explain limitations and how inappropriate recommendations will be prevented. | Document the formulas, assumptions, limitations and safety considerations. | docs/06-requirements.md, recommendation module | Open |
| 3 | 24.10.2026 | Chat | AI / ML component | Define the KNN model's input features, target output, dataset source, preprocessing steps, evaluation metrics and validation methodology. Compare the ML model fairly with the rule-based baseline. | Finalize the dataset and ML evaluation methodology and document the comparison with the rule-based baseline. | docs/ai-model.md, ML implementation | Open |
| 4 | 24.10.2026 | Chat | Application functionality | Prioritize registration, login, user dashboard and recommendation history. Demonstrate the complete user journey from entering a fitness profile to generating, viewing and retrieving personalized recommendations. | Complete and test the main user workflow before the next defense. | Frontend/backend modules | Open |
| 5 | 24.10.2026 | Chat | Testing and security | In addition to code coverage, demonstrate calculation correctness, input validation, authentication, authorization and error handling. Verify that users cannot access or modify other users' profiles or recommendation histories. | Add security and integration tests and document implemented security measures and remaining limitations. | tests/, backend authentication/authorization modules | Open |
| 6 | 24.10.2026 | Chat | User experience and evaluation | Evaluate responsiveness on desktop and mobile, form validation, readability, navigation, feedback messages and accessibility. Consider usability testing with representative target users. | Perform responsive and usability testing and document the results. | Frontend and evaluation documentation | Open |
| 7 | 24.10.2026 | Chat | Project evaluation and documentation | Ensure implementation claims are supported by reproducible test results, screenshots, API examples and evaluation data. Keep documentation synchronized with the actual implementation and distinguish completed functionality from planned features. | Update documentation with implementation evidence and measurable results. | docs/, README, test results | Open |

## 11.2 Questions Prepared for the Supervisor
These are decisions where the team would like the supervisor's opinion:
1. Scope of AI. Is a profile-based KNN model compared against a rule-based baseline enough AI content for the diploma? Or should a second model type be compared as well?
2. Dataset. Is the public obesity / eating-habits dataset acceptable, or should we also collect our own anonymised data from students?
3. Frontend framework. Should we keep vanilla JS or move to React before building the dashboard?
4. Interviews / user research. Is the current user research evidence sufficient, or should we add a short online survey for more quantitative data?
5. LLM features. Should a RAG-based explanation layer stay in the future work section, or is it expected in the final version?

## 11.3 How Feedback Is Handled

1. Each supervisor comment is recorded in the review log.
2. If action is needed, the corresponding task or YouTrack issue is created or updated.
3. The implementation change is made on a branch and linked to the relevant commit or pull request.
4. The documentation is updated after the change is completed.
5. The entry is marked Resolved after the action is completed, or Open if the action is still in progress.