"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = void 0;
const zod_1 = require("zod");
const customError_1 = require("../utils/customError");
const validateBody = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        return next();
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            const message = err.issues.map((issue) => {
                const path = Array.isArray(issue.path) && issue.path.length ? issue.path.join('.') : 'body';
                return `${path}: ${issue.message}`;
            }).join('; ');
            return next(new customError_1.AppError(message || 'Invalid request body', 400));
        }
        // Fallback for other errors
        const fallback = err?.message || 'Invalid request body';
        return next(new customError_1.AppError(fallback, 400));
    }
};
exports.validateBody = validateBody;
exports.default = exports.validateBody;
