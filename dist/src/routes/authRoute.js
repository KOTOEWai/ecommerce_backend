"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const validate_1 = __importDefault(require("../middleware/validate"));
const auth_1 = require("../validation/auth");
const router = (0, express_1.Router)();
router.post("/register", (0, validate_1.default)(auth_1.registerSchema), authController_1.register);
router.post("/login", (0, validate_1.default)(auth_1.loginSchema), authController_1.login);
exports.default = router;
