# 3. Literature Review

## 3.1 Method

**Research questions**

- **RQ1.** Which AI/ML approaches are used to personalise physical-activity, exercise and nutrition recommendations?
- **RQ2.** What data do they need, and how are they evaluated?
- **RQ3.** What limitations are reported, and which of them must our platform take into account?

**Search.** We searched Google Scholar, ScienceDirect, PubMed, IEEE Xplore, MDPI and arXiv with combinations of *"fitness recommendation"*, *"exercise recommender system"*, *"physical activity" AND "machine learning"*, *"personalized nutrition" AND "artificial intelligence"*, *"collaborative filtering" AND diet*, *"health chatbot"* and *"LLM" AND "fitness coaching"*.

**Inclusion criteria:** peer-reviewed articles or preprints from 2021–2026 that propose or review a personalised recommendation method for physical activity, exercise, nutrition or health behaviour. **Exclusion criteria:** papers about clinical treatment only, papers without a described method, and non-English papers without an English abstract.

**Result:** 12 scientific publications were selected and analysed in depth: 5 reviews/surveys, 6 original method papers and 1 benchmark. All 12 were published in the last five years (2021–2026). Three foundational, older sources [13–15] were added because the calculation logic of the platform directly depends on them. In total, **15 sources** are used, of which **15 are scientific**.

## 3.2 Thematic review

### A. Overviews: AI for physical activity and healthy habits

**Lopez-Barreiro et al. (2024) [1]** conducted a PRISMA systematic review of **34 studies** on AI-powered recommender systems for healthy habits and active ageing. Collaborative filtering (CF), content-based and hybrid recommenders are the main families. CF captures preferences well, but it suffers from **data sparsity and the cold-start problem**. Hybrid methods, user profiling and data imputation are the usual remedies. The authors' key critical finding is that, *"although there are many proposals, they often lack a systematic process and mechanisms to encourage adherence"*. Systems also tend to perform well in closed environments but fail to engage users in real life. They call for **traceable, verifiable** recommendation systems.

**An et al. (2024) [3]** reviewed **24 studies** that apply ML, deep learning (DL) and reinforcement learning (RL) to physical-activity interventions. In most studies AI models predicted better than traditional statistics. However, comparisons between AI models gave mixed results, because performance depends strongly on the dataset and the task. The authors note a shift from classic ML towards DL and RL. They list six future directions: personalised interventions, real-time adaptation, multimodal data, evaluation of effectiveness, wider access, and injury prevention. Limitations they report include short-term effects only, **no standardised protocols** and unreliable cross-study comparisons.

*Critical note.* Both reviews agree that personalisation is promising. They also agree that the evidence is weak because it comes from laboratory settings and non-standard evaluation. For our project this means two things. First, a clear, reproducible **evaluation protocol with a baseline** matters more than choosing the "most advanced" model. Second, a simple, transparent model is a defensible starting point.

### B. ML on profile data for personalised fitness prescription

**Chen & Wang (2025) [2]** built a framework on the US **NHANES** survey, enriched with behavioural variables from BRFSS. They used **XGBoost, Decision Trees and an ANN** both to estimate weekly activity minutes (regression) and to assign risk groups (classification). XGBoost performed best (MeanIoU 0.789, F1 > 0.79 for every risk class), with fairness gaps below 0.05 across age, gender and ethnicity. The paper is close to our use case because it starts from **demographic and biometric profile data**, as our platform does. Its limitations are a cross-sectional dataset (no change over time), self-reported activity (recall bias) and under-represented minorities.

**Lee & Jeong (2021) [6]** propose a home-training exercise recommender. First, a **k-nearest-neighbour** classifier groups users by obesity level from eating habits and physical condition (Kaggle obesity dataset, 2,111 records, 17 attributes; ≈ 84% accuracy with k = 3). Then **SVD**, a model-based collaborative-filtering method, recommends exercises within each group, using a calories-burned-per-activity dataset. Dimensionality reduction addresses the **sparsity and scalability** problems of memory-based CF. The work is small-scale and uses public, non-local datasets. Even so, its two-step design (*classify the user profile → recommend within the segment*) can be reproduced with student-level resources. **We adopt it as the reference design for our ML component (APF-13).**

### C. Deep and sequential recommenders for exercise

**Chatterjee et al. (2023) [4]** combine deep learning with a semantic **ontology (OntoeCoach)** for activity eCoaching. Time-series forecasting (CNN1D, LSTM, GRU, autoregression) predicts activity; classifiers (MLP, Rocket/MiniRocket) assign activity levels; and SPARQL queries over the ontology turn the results into readable recommendations. CNN1D reached 97% forecasting accuracy and MLP 74% classification accuracy on PMData and a private dataset. The strength of this work is its **interpretability**: rules in the ontology explain *why* something is recommended. The weaknesses are that it needs continuous wearable data and has high system complexity.

**Mahyari, Pirolli & LeBlanc (2022) [7]** develop a deep **recurrent neural network with user-profile and temporal attention** to recommend daily exercises (mHealth study with 72 adults and 44 exercises; also tested on MovieLens). They point out a key difference from movie or music recommenders: **exercise apps do not get click feedback**. They therefore propose a real-time **expert-in-the-loop active learner**, which asks a human expert when the model's certainty is low. Accuracy improved after the expert feedback was added. This supports our decision to keep a **rule-based, expert-defined baseline** and to treat ML as an add-on.

**Zhen & Wang (2024) [8]** recommend physical-education courses from IoT data (smart bracelets, environment sensors, social interaction) and academic data. They use an improved conditional GAN (**RP-CFGAN**) to fight **sparsity and cold start**. Top-N metrics (P@N, R@N, NDCG@N) beat classic models on a MOOCCube-based dataset. The approach is powerful, but it depends on IoT infrastructure and large interaction logs that our MVP does not have. Its open issues include privacy, regularisation and cross-platform use.

### D. Nutrition personalisation

**Silva et al. (2022) [5]** compared **user-based (UBCF) and item-based (IBCF) collaborative filtering** for dietary advice using food-frequency questionnaires from **12,667 participants** of the ELSA-Brasil cohort. Precision was similar (88–91%), and UBCF had lower error (RMSE 1.49 vs 1.67). This shows that simple CF can give useful diet suggestions. However, the questionnaire does not capture preferences, allergies or restrictions, and the data date from 2008–2010.

**Agrawal et al. (2025) [10]** review AI in personalised nutrition and food manufacturing: real-time dietary recommendations, meal planning from biomarkers, deep learning, federated learning and computer vision for food recognition. They stress open challenges in **algorithmic transparency, data privacy and equitable access**. For our project, the review confirms that our scope (calorie and macro targets) is the foundation that richer nutrition AI builds on. It also confirms that privacy must be designed in from the start.

### E. Conversational AI, LLMs and safety

**Aggarwal et al. (2023) [9]** systematically reviewed **15 studies** of AI chatbots for health behaviour change. Chatbots were effective for healthy lifestyle (40% of studies), smoking cessation and adherence. The most effective strategies were **goal setting, monitoring, real-time feedback and on-demand support**. The evidence quality was moderate to low, with a high risk of bias and poor descriptions of the AI techniques.

**Abo El-Enen, Saad & Nazmy (2025) [11]** survey **retrieval-augmented generation (RAG)** for healthcare (Naive, Advanced and Modular RAG). RAG reduces two problems of large language models (LLMs), **hallucination and static knowledge**, by grounding answers in trusted sources. It still depends on retrieval quality and needs transparency about its sources.

**Li et al. (2026) [12] (MoveBench)** evaluated **15 LLMs on 809 sports-and-health coaching questions with 5,012 rubric criteria**, including a *safety redline* mechanism. Overall scores ranged from 0.875 to 0.943. Open-ended coaching scores varied more widely (0.812–0.917), especially in safety awareness, structured programme design and personalisation. The authors call this a gap *"between knowing and doing"*. They explicitly state that the benchmark is *not a certification of safe coaching*.

*Critical note.* LLM coaches are the most visible trend. However, [11] and [12] show that they still need grounding and safety checks, and [9] shows that the evidence for chatbots is weak. We therefore **do not use an LLM to generate the numbers**. Calories, macros and workout structure come from deterministic, testable logic. An LLM explanation layer grounded with RAG over our own rules is listed as future work.

### F. Foundational sources used directly in the calculation logic

- **Mifflin et al. (1990) [13]**: the Mifflin-St Jeor equation for resting energy expenditure, `10·kg + 6.25·cm − 5·age + 5 (men) / −161 (women)`. This is the equation implemented in `backend/src/calculations.js`.
- **Bull et al. (2020) [14]**: WHO 2020 guidelines (150–300 min of moderate or 75–150 min of vigorous activity per week, plus muscle-strengthening activity on 2 or more days). These justify the session counts in the workout plans.
- **Jäger et al. (2017) [15]**: ISSN position stand, protein intake of 1.4–2.0 g/kg/day for exercising individuals. All our protein targets stay within this range.

## 3.3 Analytical table of publications

| # | Reference | Type | Data | Method / model | Key result | Reported limitations | Use in our project |
|---|---|---|---|---|---|---|---|
| 1 | Lopez-Barreiro et al., 2024, *Appl. Sci.* | Systematic review (PRISMA) | 34 studies | CF, content-based, hybrid, ML/DL recommenders | AI recommenders promising; cold start and sparsity are common | Lab-only evaluation; no adherence mechanisms; no comparable tests | Motivates a transparent, verifiable baseline and adherence features (history, dashboard) |
| 2 | Chen & Wang, 2025, *Sci. Rep.* | Original | NHANES + BRFSS | XGBoost, DT, ANN | XGBoost MeanIoU 0.789, F1 > 0.79, fairness gap < 0.05 | Cross-sectional; self-reported activity; minorities under-represented | Profile features (age, sex, BMI, activity) as model inputs; fairness check by sex/age in evaluation |
| 3 | An et al., 2024, *J. Sport Health Sci.* | Scoping review | 24 studies | ML, DL, RL in PA interventions | AI beats statistics; model ranking depends on data | Short-term; no standard protocols; unreliable comparisons | Need for a fixed evaluation protocol and baseline (doc 09) |
| 4 | Chatterjee et al., 2023, *Sci. Rep.* | Original | PMData, MOX2-5 | CNN1D/LSTM/GRU forecasting + MLP + OWL ontology + SPARQL | CNN1D 97% forecast acc.; MLP 74% classification | Needs wearable time series; complex | Explainable, rule-based layer; show reasoning (BMR/TDEE) to the user |
| 5 | Silva et al., 2022, *IJERPH* | Original (cross-sectional) | ELSA-Brasil, n = 12,667 | User-based vs item-based CF | Precision 88–91%; UBCF RMSE 1.49 | FFQ ignores preferences and allergies; old data | CF needs many users, so not suitable for the MVP; possible later for nutrition |
| 6 | Lee & Jeong, 2021, *J. Korea Soc. Comput. Inf.* | Original | Kaggle obesity (2,111 records) + calories-burned dataset | KNN classification + SVD (model-based CF) | KNN ≈ 84% accuracy; SVD reduces sparsity | Small public datasets; no user study | **Reference design for the ML component**: KNN profile segmentation, then recommendation |
| 7 | Mahyari et al., 2022, *IEEE J. Biomed. Health Inform.* | Original | mHealth study (72 adults, 44 exercises), MovieLens | Attention RNN + expert-in-the-loop active learning | Accuracy improved with expert feedback | No implicit feedback in exercise apps; needs an expert | Keep an expert-defined rule baseline; collect explicit feedback later |
| 8 | Zhen & Wang, 2024, *Heliyon* | Original | MOOCCube-based, IoT data | RP-CFGAN (conditional GAN) | Better P@N, R@N, NDCG@N than baselines | Privacy; needs IoT; regularisation | Use top-N metrics (precision@k) in evaluation; wearables out of scope |
| 9 | Aggarwal et al., 2023, *J. Med. Internet Res.* | Systematic review | 15 studies | AI chatbots for behaviour change | Effective for healthy lifestyle in 40% of studies | Low evidence quality; AI techniques poorly described | Goal setting and feedback as UX principles; chatbot only as future work |
| 10 | Agrawal et al., 2025, *Front. Nutr.* | Review | — | DL, federated learning, CV for nutrition | AI moves nutrition from population-level to individual | Transparency, privacy, equity challenges | Privacy-by-design (NFR-05); nutrition limited to calorie and macro targets |
| 11 | Abo El-Enen et al., 2025, *Neural Comput. Appl.* | Survey | — | Naive / Advanced / Modular RAG with LLMs | RAG reduces hallucination by grounding answers | Retrieval errors; interpretability of sources | Future LLM explanation layer must be grounded (RAG) over our rules |
| 12 | Li et al., 2026, *arXiv* (MoveBench) | Benchmark | 809 questions, 5,012 rubric criteria | Rubric-based multi-judge LLM evaluation with a safety redline | 15 LLMs score 0.875–0.943; weak on safety and personalisation | Judge disagreement; not a safety certification | Numbers not produced by an LLM; safety rules (NFR-08) |
| 13 | Mifflin et al., 1990, *Am. J. Clin. Nutr.* | Foundational | Healthy adults | Regression equation for REE | Mifflin-St Jeor equation | Population-level estimate | Implemented BMR formula |
| 14 | Bull et al., 2020, *Br. J. Sports Med.* | Guideline | WHO evidence review | — | 150–300 min moderate activity per week + strength on 2+ days | General population guidance | Session frequency in workout plans |
| 15 | Jäger et al., 2017, *J. Int. Soc. Sports Nutr.* | Position stand | Evidence review | — | Protein 1.4–2.0 g/kg/day for exercising people | General recommendation | Protein targets and test TC-U07 |

## 3.4 Synthesis: what is known and what gaps remain

1. **Approaches (RQ1).** There are three families: (a) *collaborative filtering* (user/item CF [5], SVD [6]), which needs interaction data from many users; (b) *profile- or content-based ML* (KNN [6], XGBoost [2]), which works from the user's own attributes; and (c) *deep sequential models* (RNN/attention [7], CNN/LSTM [4], GAN [8]), which need time-series or IoT data. LLM-based coaching [9, 11, 12] is emerging but is not yet safe enough to produce numbers unsupervised.
2. **Data and evaluation (RQ2).** Studies use very different data (surveys, wearables, course logs) and metrics (accuracy, RMSE, MeanIoU, P@N, NDCG, rubric scores). This makes cross-study comparison unreliable [3].
3. **Limitations (RQ3) and how we account for them:**

| Limitation found in the literature | How our project takes it into account |
|---|---|
| Cold start: new users have no history [1, 6, 7, 8] | Recommendations are computed from the profile alone; ML component is profile-based (KNN), not CF |
| Opaque models, low trust [1, 4, 10] | Deterministic rules with shown intermediate values (BMR, TDEE); rules referenced to [13–15] |
| Laboratory-only, non-standard evaluation [1, 3] | Fixed evaluation plan with a rule-based **baseline**, defined metrics and test data (doc 09) |
| Safety of automated advice [11, 12] | Calorie floor, protein range, input-range validation, medical disclaimer |
| Privacy of health data [8, 10] | Hashed passwords, JWT, minimal data collection, no secrets in the repository |
| Fairness across demographic groups [2] | Evaluation reports results separately by sex and age group |
| Lack of adherence support [1, 9] | Goal setting, recommendation history and dashboard (feedback loop) |

**Gap addressed by this project.** Research systems are accurate but heavy (they need wearables, large logs or IoT) and opaque. Consumer apps are easy to use but generic or behind paywalls. Our contribution is a **transparent, profile-based recommender that works from the first use (no cold start)**, in which an ML component can be measured against an explicit rule-based baseline.

## 3.5 References

[1] J. Lopez-Barreiro, J. L. Garcia-Soidan, L. Alvarez-Sabucedo, J. M. Santos-Gago, "Artificial Intelligence-Powered Recommender Systems for Promoting Healthy Habits and Active Aging: A Systematic Review," *Applied Sciences*, vol. 14, 10220, 2024. doi:10.3390/app142210220

[2] J. Chen, Y. Wang, "Personalized fitness recommendations using machine learning for optimized national health strategy," *Scientific Reports*, vol. 15, 41652, 2025. doi:10.1038/s41598-025-25566-4

[3] R. An, J. Shen, J. Wang, Y. Yang, "A scoping review of methodologies for applying artificial intelligence to physical activity interventions," *Journal of Sport and Health Science*, vol. 13, pp. 428–441, 2024.

[4] A. Chatterjee, A. Prinz, M. A. Riegler, Y. K. Meena, "An automatic and personalized recommendation modelling in activity eCoaching with deep learning and ontology," *Scientific Reports*, vol. 13, 10182, 2023. doi:10.1038/s41598-023-37233-7

[5] V. C. Silva, B. Gorgulho, D. M. Marchioni, et al., "Recommender System Based on Collaborative Filtering for Personalized Dietary Advice: A Cross-Sectional Analysis of the ELSA-Brasil Study," *Int. J. Environ. Res. Public Health*, vol. 19, 14934, 2022. doi:10.3390/ijerph192214934

[6] H.-Y. Lee, O.-R. Jeong, "A personalized exercise recommendation system using dimension reduction algorithms," *Journal of The Korea Society of Computer and Information*, vol. 26, no. 6, pp. 19–28, 2021. doi:10.9708/jksci.2021.26.06.019

[7] A. Mahyari, P. Pirolli, J. A. LeBlanc, "Real-Time Learning from an Expert in Deep Recommendation Systems with Application to mHealth for Physical Exercises," *IEEE Journal of Biomedical and Health Informatics*, 2022.

[8] A. Zhen, X. Wang, "The deep learning-based physical education course recommendation system under the internet of things," *Heliyon*, vol. 10, e38907, 2024.

[9] A. Aggarwal, C. C. Tam, D. Wu, X. Li, S. Qiao, "Artificial Intelligence–Based Chatbots for Promoting Health Behavioral Changes: Systematic Review," *J. Med. Internet Res.*, vol. 25, e40789, 2023. doi:10.2196/40789

[10] K. Agrawal, P. Goktas, N. Kumar, M.-F. Leung, "Artificial intelligence in personalized nutrition and food manufacturing: a comprehensive review of methods, applications, and future directions," *Frontiers in Nutrition*, vol. 12, 1636980, 2025. doi:10.3389/fnut.2025.1636980

[11] M. Abo El-Enen, S. Saad, T. Nazmy, "A survey on retrieval-augmentation generation (RAG) models for healthcare applications," *Neural Computing and Applications*, vol. 37, pp. 28191–28267, 2025. doi:10.1007/s00521-025-11666-9

[12] Y. Li, J. Bian, J. Wang, P. Ding, C. Gu, "MoveBench: A Rubric-Based Benchmark for Evaluating Large Language Models in Sports and Health Coaching," arXiv:2610.26185, 2026.

[13] M. D. Mifflin, S. T. St Jeor, L. A. Hill, B. J. Scott, S. A. Daugherty, Y. O. Koh, "A new predictive equation for resting energy expenditure in healthy individuals," *American Journal of Clinical Nutrition*, vol. 51, no. 2, pp. 241–247, 1990.

[14] F. C. Bull, S. S. Al-Ansari, S. Biddle, et al., "World Health Organization 2020 guidelines on physical activity and sedentary behaviour," *British Journal of Sports Medicine*, vol. 54, pp. 1451–1462, 2020.

[15] R. Jäger, C. M. Kerksick, B. I. Campbell, et al., "International Society of Sports Nutrition Position Stand: protein and exercise," *Journal of the International Society of Sports Nutrition*, vol. 14, 20, 2017.
