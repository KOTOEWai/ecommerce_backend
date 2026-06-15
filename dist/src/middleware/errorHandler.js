"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const customError_1 = require("../utils/customError");
const errorHandler = (err, _req, res, _next) => {
    const error = err instanceof customError_1.AppError ? err : new customError_1.AppError("Internal Server Error", 500);
    const response = {
        status: "error",
        message: error.message,
        ...(process.env.NODE_ENV !== "production" && { stack: error.stack })
    };
    res.status(error.statusCode).json(response);
};
exports.errorHandler = errorHandler;
