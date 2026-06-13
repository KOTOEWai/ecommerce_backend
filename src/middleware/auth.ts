import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export const protect = (req: Request, res: Response, next: NextFunction) => {
  try {
    const rawAuth = req.headers.authorization;
    if (!rawAuth) return res.status(401).json({ error: "missing token" });
    // headers can be string | string[]; normalize to a definite string
    const auth: string = Array.isArray(rawAuth) ? rawAuth[0] : rawAuth;
    const parts = auth.split(" ");
    if (parts.length !== 2) return res.status(401).json({ error: "invalid token" });
    const token = parts[1];
    const payload = verifyToken(token);
    req.userId = payload.userId;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: "invalid token" });
  }
};
