"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const roleRoute_1 = __importDefault(require("./routes/roleRoute"));
const addressRoute_1 = __importDefault(require("./routes/addressRoute"));
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
app.use(express_1.default.json());
if (process.env.NODE_ENV !== "test") {
    app.use((0, morgan_1.default)("dev"));
}
const responseHandler = (_req, res, next) => {
    res.success = function (data, message = "Success", statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    };
    next();
};
app.use(responseHandler);
app.get("/", (_req, res) => {
    res.json({ message: "Express server is running!" });
});
app.use("/api/auth", authRoute_1.default);
app.use("/api/users", userRoute_1.default);
app.use("/api/roles", roleRoute_1.default);
app.use("/api/addresses", addressRoute_1.default);
app.use(errorHandler_1.errorHandler);
exports.default = app;
