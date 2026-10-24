// Entry point: reads configuration from environment variables and starts the HTTP server.
// Copy backend/.env.example to backend/.env and run `npm start` (Node.js >= 22.13).

const path = require("node:path");
try { process.loadEnvFile(path.join(__dirname, "..", ".env")); } catch { /* .env is optional */ }

const { createApp } = require("./app");
const { openDatabase } = require("./db");

const PORT = Number(process.env.PORT) || 3000;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, "..", "data", "fitness.db");
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error("JWT_SECRET is not set. Copy backend/.env.example to backend/.env and set a value.");
    process.exit(1);
}

const db = openDatabase(DB_PATH);
const app = createApp({ db, jwtSecret: JWT_SECRET, corsOrigin: process.env.CORS_ORIGIN || "*" });

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
