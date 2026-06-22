"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const roleRoute_1 = __importDefault(require("./routes/roleRoute"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const errorHandler_1 = require("./middleware/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 5000;
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
const responseHandler = (req, res, next) => {
    res.success = function (data, message = "Success", statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message: message,
            data: data
        });
    };
    next();
};
app.use(responseHandler);
app.get('/', (req, res) => {
    res.json({ message: "Express server is running!" });
});
app.use("/api/auth", authRoute_1.default);
app.use("/api/users", userRoute_1.default);
app.use("/api/roles", roleRoute_1.default);
app.get('/api/test', (req, res) => {
    console.log(req.headers); // 👈 Terminal တွင် Object အကြီးကြီး ထွက်လာမည်
    res.send("စစ်ဆေးပြီးပါပြီ");
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
// Global error handler (must be after all routes)
app.use(errorHandler_1.errorHandler);
