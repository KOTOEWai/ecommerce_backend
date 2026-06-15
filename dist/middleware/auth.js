"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jwt_1 = require("../utils/jwt");
const protect = (req, res, next) => {
    try {
        const rawAuth = req.headers.authorization;
        if (!rawAuth)
            return res.status(401).json({ error: "missing token" });
        // headers can be string | string[]; normalize to a definite string
        const auth = Array.isArray(rawAuth) ? rawAuth[0] : rawAuth;
        const parts = auth.split(" ");
        if (parts.length !== 2)
            return res.status(401).json({ error: "invalid token" });
        const token = parts[1];
        const payload = (0, jwt_1.verifyToken)(token);
        req.userId = payload.userId;
        next();
    }
    catch (err) {
        console.error(err);
        return res.status(401).json({ error: "invalid token" });
    }
};
exports.protect = protect;
