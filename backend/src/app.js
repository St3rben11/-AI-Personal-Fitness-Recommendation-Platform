// Express application (APF-8 Backend API). Created by a factory so tests can inject an in-memory DB.

const path = require("node:path");
const express = require("express");
const cors = require("cors");

const { validateProfile, validateCredentials } = require("./validation");
const { generateRecommendation } = require("./calculations");
const { recommendWorkouts } = require("./recommendation/aiModel");
const { hashPassword, verifyPassword, signToken, requireAuth } = require("./auth");

function toPublicUser(u) {
    return {
        id: u.id,
        email: u.email,
        name: u.name,
        profile: {
            age: u.age,
            gender: u.gender,
            height: u.height_cm,
            weight: u.weight_kg,
            activity: u.activity_level,
            goal: u.fitness_goal,
            workoutPreference: u.workout_preference
        }
    };
}

function createApp({ db, jwtSecret, corsOrigin = "*", serveFrontend = true }) {
    if (!jwtSecret) throw new Error("jwtSecret is required");
    const app = express();
    const auth = requireAuth(jwtSecret);

    app.use(cors({ origin: corsOrigin }));
    app.use(express.json({ limit: "10kb" }));

    app.get("/api/health", (req, res) => {
        res.json({ status: "ok", service: "AI Personal Fitness Recommendation Platform API" });
    });

    // ---------- Authentication ----------
    app.post("/api/auth/register", (req, res) => {
        const { value, errors } = validateCredentials(req.body, { requireName: true });
        if (errors.length) return res.status(400).json({ error: "Validation failed.", details: errors });
        if (db.findUserByEmail(value.email)) {
            return res.status(409).json({ error: "An account with this email already exists." });
        }
        const id = db.createUser(value.email, hashPassword(value.password), value.name);
        const user = db.findUserById(id);
        return res.status(201).json({ token: signToken(user, jwtSecret), user: toPublicUser(user) });
    });

    app.post("/api/auth/login", (req, res) => {
        const { value, errors } = validateCredentials(req.body);
        if (errors.length) return res.status(400).json({ error: "Validation failed.", details: errors });
        const user = db.findUserByEmail(value.email);
        if (!user || !verifyPassword(value.password, user.password_hash)) {
            return res.status(401).json({ error: "Invalid email or password." });
        }
        return res.json({ token: signToken(user, jwtSecret), user: toPublicUser(user) });
    });

    // ---------- Profile ----------
    app.get("/api/profile", auth, (req, res) => {
        const user = db.findUserById(req.userId);
        if (!user) return res.status(404).json({ error: "User not found." });
        return res.json(toPublicUser(user));
    });

    app.put("/api/profile", auth, (req, res) => {
        const { value, errors } = validateProfile(req.body);
        if (errors.length) return res.status(400).json({ error: "Validation failed.", details: errors });
        const pref = ["home", "gym"].includes(req.body.workoutPreference) ? req.body.workoutPreference : null;
        db.updateProfile(req.userId, { ...value, workoutPreference: pref });
        return res.json(toPublicUser(db.findUserById(req.userId)));
    });

    // ---------- Recommendations ----------
    // Anonymous calculation (guest mode, used by the MVP form). Nothing is stored.
    app.post("/api/recommendation", (req, res) => {
        const { value, errors } = validateProfile(req.body);
        if (errors.length) return res.status(400).json({ error: "Validation failed.", details: errors });
        const rec = generateRecommendation(value);
        return res.json({ name: value.name, goal: value.goal, activity: value.activity, ...rec,
            aiRecommendations: recommendWorkouts({ ...value, workoutPreference: req.body.workoutPreference }) });
    });

    // Authenticated: uses the stored profile, saves the result to history.
    app.post("/api/recommendations", auth, (req, res) => {
        const u = db.findUserById(req.userId);
        const { value, errors } = validateProfile({
            name: u.name, age: u.age, gender: u.gender, height: u.height_cm, weight: u.weight_kg,
            goal: u.fitness_goal, activity: u.activity_level
        });
        if (errors.length) {
            return res.status(422).json({ error: "Complete your profile first.", details: errors });
        }
        const rec = generateRecommendation(value);
        const id = db.saveRecommendation(req.userId, value, rec);
        return res.status(201).json({ id, name: value.name, goal: value.goal, activity: value.activity, ...rec,
            aiRecommendations: recommendWorkouts({ ...value, workoutPreference: u.workout_preference }) });
    });

    app.get("/api/recommendations", auth, (req, res) => {
        const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
        return res.json(db.getHistory(req.userId, limit));
    });

    // ---------- Static frontend ----------
    if (serveFrontend) {
        app.use(express.static(path.join(__dirname, "..", "..", "frontend")));
    }

    app.use("/api", (req, res) => res.status(404).json({ error: "Endpoint not found." }));

    // eslint-disable-next-line no-unused-vars
    app.use((err, req, res, next) => {
        if (err.type === "entity.parse.failed") return res.status(400).json({ error: "Malformed JSON body." });
        console.error(err);
        return res.status(500).json({ error: "Internal server error." });
    });

    return app;
}

module.exports = { createApp };
