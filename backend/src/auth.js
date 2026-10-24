// Authentication helpers (APF-10): password hashing with scrypt (Node crypto) and JWT access tokens.

const crypto = require("node:crypto");
const jwt = require("jsonwebtoken");

const TOKEN_TTL = "2h";

function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.scryptSync(password, salt, 64).toString("hex");
    return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
    const [salt, hash] = String(stored).split(":");
    if (!salt || !hash) return false;
    const candidate = crypto.scryptSync(password, salt, 64);
    const expected = Buffer.from(hash, "hex");
    return expected.length === candidate.length && crypto.timingSafeEqual(candidate, expected);
}

function signToken(user, secret) {
    return jwt.sign({ sub: String(user.id), email: user.email }, secret, { expiresIn: TOKEN_TTL });
}

/** Express middleware: requires "Authorization: Bearer <token>". */
function requireAuth(secret) {
    return (req, res, next) => {
        const header = req.get("authorization") || "";
        const [scheme, token] = header.split(" ");
        if (scheme !== "Bearer" || !token) {
            return res.status(401).json({ error: "Authentication required." });
        }
        try {
            const payload = jwt.verify(token, secret);
            req.userId = Number(payload.sub);
            return next();
        } catch {
            return res.status(401).json({ error: "Invalid or expired token." });
        }
    };
}

module.exports = { hashPassword, verifyPassword, signToken, requireAuth };
