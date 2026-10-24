-- AI Personal Fitness Recommendation Platform
-- Database schema (SQLite dialect, MVP). Applied automatically by backend/src/db.js.
-- Related YouTrack issue: APF-3 (Design database structure)

PRAGMA foreign_keys = ON;

-- Registered users: authentication data + fitness profile (1:1, kept in one table for the MVP)
CREATE TABLE IF NOT EXISTS users (
    id                 INTEGER PRIMARY KEY AUTOINCREMENT,
    email              TEXT    NOT NULL UNIQUE,
    password_hash      TEXT    NOT NULL,              -- scrypt hash, format "salt:hash" (hex)
    name               TEXT    NOT NULL,
    age                INTEGER CHECK (age BETWEEN 14 AND 100),
    gender             TEXT    CHECK (gender IN ('male', 'female')),
    height_cm          REAL    CHECK (height_cm BETWEEN 100 AND 250),
    weight_kg          REAL    CHECK (weight_kg BETWEEN 30 AND 300),
    activity_level     TEXT    CHECK (activity_level IN ('low', 'moderate', 'high')),
    fitness_goal       TEXT    CHECK (fitness_goal IN ('weight-loss', 'muscle-gain', 'maintenance')),
    workout_preference TEXT    CHECK (workout_preference IN ('home', 'gym')),
    created_at         TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at         TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Every recommendation generated for a user (history; input snapshot + calculated output)
CREATE TABLE IF NOT EXISTS recommendations (
    id                 INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id            INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    weight_kg          REAL    NOT NULL,
    fitness_goal       TEXT    NOT NULL,
    activity_level     TEXT    NOT NULL,
    bmr                INTEGER NOT NULL,
    tdee               INTEGER NOT NULL,
    daily_calories     INTEGER NOT NULL,
    protein_g          INTEGER NOT NULL,
    carbohydrates_g    INTEGER NOT NULL,
    fats_g             INTEGER NOT NULL,
    workout_summary    TEXT    NOT NULL,
    created_at         TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Individual exercises of the workout plan attached to a recommendation
CREATE TABLE IF NOT EXISTS workout_items (
    id                 INTEGER PRIMARY KEY AUTOINCREMENT,
    recommendation_id  INTEGER NOT NULL REFERENCES recommendations(id) ON DELETE CASCADE,
    exercise_name      TEXT    NOT NULL,
    workout_type       TEXT    NOT NULL CHECK (workout_type IN ('strength', 'cardio', 'mobility')),
    sets               INTEGER,
    repetitions        TEXT,
    duration_minutes   INTEGER
);

CREATE INDEX IF NOT EXISTS idx_recommendations_user ON recommendations(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_workout_items_rec ON workout_items(recommendation_id);
