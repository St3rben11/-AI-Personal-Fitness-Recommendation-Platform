-- AI Personal Fitness Recommendation Platform
-- Initial database schema for MVP

CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INTEGER,
    gender VARCHAR(20),
    height_cm DECIMAL(5,2),
    weight_kg DECIMAL(5,2),
    fitness_level VARCHAR(30),
    fitness_goal VARCHAR(50),
    workout_preference VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fitness_data (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    daily_calories INTEGER,
    protein_g DECIMAL(6,2),
    carbohydrates_g DECIMAL(6,2),
    fats_g DECIMAL(6,2),
    activity_level VARCHAR(30),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE workout_recommendations (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    workout_type VARCHAR(50),
    exercise_name VARCHAR(100),
    sets INTEGER,
    repetitions INTEGER,
    duration_minutes INTEGER,
    difficulty VARCHAR(30),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE nutrition_recommendations (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    recommendation_type VARCHAR(50),
    description TEXT,
    calories INTEGER,
    protein_g DECIMAL(6,2),
    carbohydrates_g DECIMAL(6,2),
    fats_g DECIMAL(6,2),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
