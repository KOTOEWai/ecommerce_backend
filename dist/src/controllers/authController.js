"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const customError_1 = require("../utils/customError");
const catchAsync_1 = require("../utils/catchAsync");
const jwt_1 = require("../utils/jwt");
const userService = __importStar(require("../services/userService"));
const hash_1 = require("../utils/hash");
const hash_2 = require("../utils/hash");
exports.register = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { email, password, name, phone, role } = req.body;
    if (!email || !password)
        throw new customError_1.AppError("email and password required", 400);
    const passwordHash = await (0, hash_1.hashPassword)(password);
    const user = await userService.createUser({ email, passwordHash, name, phone, role });
    const token = (0, jwt_1.signToken)({ userId: user?.id, email: user?.email });
    //  return res.status(201).json({ user, token });
    res.success({ user, token }, "user successfully created", 201);
});
exports.login = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password)
        throw new customError_1.AppError("email and password required", 400);
    const user = await userService.findUserByEmail(email);
    if (!user)
        throw new customError_1.AppError("invalid credentials", 401);
    const ok = await (0, hash_2.verifyPassword)(password, user.passwordHash);
    if (!ok)
        throw new customError_1.AppError("invalid credentials", 401);
    const token = (0, jwt_1.signToken)({ userId: user.id, email: user.email });
    const safe = { id: user.id, email: user.email, name: user.name, phone: user.phone };
    //return res.json({ user: safe, token });
    res.success({ safe, token }, "user successfully logged in", 200);
});
