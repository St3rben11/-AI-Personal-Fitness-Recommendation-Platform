// Database access layer (APF-3). Uses SQLite through Node's built-in node:sqlite module,
// so no native dependency has to be compiled. Schema lives in /database/schema.sql.

const fs = require("node:fs");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");

const SCHEMA_PATH = path.join(__dirname, "..", "..", "database", "schema.sql");

function openDatabase(filename = ":memory:") {
    if (filename !== ":memory:") {
        fs.mkdirSync(path.dirname(path.resolve(filename)), { recursive: true });
    }
    const db = new DatabaseSync(filename);
    db.exec(fs.readFileSync(SCHEMA_PATH, "utf8"));
    return createRepository(db);
}

function createRepository(db) {
    const stmts = {
        insertUser: db.prepare(
            "INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)"
        ),
        userByEmail: db.prepare("SELECT * FROM users WHERE email = ?"),
        userById: db.prepare("SELECT * FROM users WHERE id = ?"),
        updateProfile: db.prepare(`
            UPDATE users SET name = ?, age = ?, gender = ?, height_cm = ?, weight_kg = ?,
                activity_level = ?, fitness_goal = ?, workout_preference = ?, updated_at = datetime('now')
            WHERE id = ?`),
        insertRecommendation: db.prepare(`
            INSERT INTO recommendations (user_id, weight_kg, fitness_goal, activity_level, bmr, tdee,
                daily_calories, protein_g, carbohydrates_g, fats_g, workout_summary)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`),
        insertWorkoutItem: db.prepare(`
            INSERT INTO workout_items (recommendation_id, exercise_name, workout_type, sets, repetitions, duration_minutes)
            VALUES (?, ?, ?, ?, ?, ?)`),
        historyByUser: db.prepare(`
            SELECT * FROM recommendations WHERE user_id = ? ORDER BY created_at DESC, id DESC LIMIT ?`),
        itemsByRecommendation: db.prepare("SELECT * FROM workout_items WHERE recommendation_id = ? ORDER BY id")
    };

    return {
        raw: db,
        createUser(email, passwordHash, name) {
            const result = stmts.insertUser.run(email, passwordHash, name);
            return Number(result.lastInsertRowid);
        },
        findUserByEmail: (email) => stmts.userByEmail.get(email),
        findUserById: (id) => stmts.userById.get(id),
        updateProfile(id, p) {
            stmts.updateProfile.run(p.name, p.age, p.gender, p.height, p.weight, p.activity, p.goal,
                p.workoutPreference ?? null, id);
        },
        saveRecommendation(userId, profile, rec) {
            db.exec("BEGIN");
            try {
                const { lastInsertRowid } = stmts.insertRecommendation.run(
                    userId, profile.weight, profile.goal, profile.activity, rec.bmr, rec.tdee, rec.calories,
                    rec.macronutrients.protein, rec.macronutrients.carbohydrates, rec.macronutrients.fats,
                    rec.workout.summary
                );
                for (const e of rec.workout.exercises) {
                    stmts.insertWorkoutItem.run(lastInsertRowid, e.exercise_name, e.workout_type,
                        e.sets ?? null, e.repetitions ?? null, e.duration_minutes ?? null);
                }
                db.exec("COMMIT");
                return Number(lastInsertRowid);
            } catch (err) {
                db.exec("ROLLBACK");
                throw err;
            }
        },
        getHistory(userId, limit = 20) {
            return stmts.historyByUser.all(userId, limit).map((r) => ({
                ...r,
                exercises: stmts.itemsByRecommendation.all(r.id)
            }));
        },
        close: () => db.close()
    };
}

module.exports = { openDatabase };
