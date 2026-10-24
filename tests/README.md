# Testing

## Purpose

The testing section is used to verify the main functionality of the AI Personal Fitness Recommendation Platform.

## Test Areas

The following functionality should be tested:

- User profile input
- Fitness goal selection
- Activity level selection
- Calorie calculation
- Macronutrient calculation
- Workout recommendation
- Form validation
- Frontend interaction
- Backend API response

## Functional Test Cases

| Test Case | Input | Expected Result |
|---|---|---|
| Valid user profile | Name, age, height and weight | Fitness recommendation is generated |
| Weight loss goal | Goal = Weight Loss | Daily calories are reduced |
| Muscle gain goal | Goal = Muscle Gain | Daily calories are increased |
| Low activity | Activity = Low | Low activity multiplier is applied |
| Moderate activity | Activity = Moderate | Moderate activity multiplier is applied |
| High activity | Activity = High | High activity multiplier is applied |
| Invalid age | Empty or invalid age | Validation prevents submission |
| Invalid weight | Empty or invalid weight | Validation prevents submission |
| Invalid height | Empty or invalid height | Validation prevents submission |

## Expected Outcome

The system should correctly process user fitness information and provide basic personalized recommendations based on the selected fitness goal and activity level.

## Testing Status

- Frontend functionality: Implemented
- Recommendation logic: Implemented
- Database schema: Implemented
- Backend API: Implemented
- Automated testing: Implemented (16 tests in `backend/test/`, run with `cd backend && npm test`)

The full test plan, test case IDs and evaluation metrics are in [docs/09-verification-plan.md](../docs/09-verification-plan.md).
