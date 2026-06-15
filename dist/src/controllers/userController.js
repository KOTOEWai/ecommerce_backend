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
exports.removeUser = exports.updateProfile = exports.getProfile = exports.getUser = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const customError_1 = require("../utils/customError");
const userService = __importStar(require("../services/userService"));
exports.getUser = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const users = await userService.listUsers();
    const getUsers = users.map(u => ({ id: u.id, email: u.email, name: u.name, phone: u.phone, createdAt: u.createdAt }));
    // res.status(200).json(users.map(u => ({ id: u.id, email: u.email, name: u.name, createdAt: u.createdAt })));\
    res.success(getUsers, "get users successfully", 200);
});
exports.getProfile = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const userId = req.userId;
    if (!userId)
        throw new customError_1.AppError("unauthorized", 401);
    const user = await userService.findUserById(userId);
    if (!user)
        throw new customError_1.AppError("not found", 404);
    // res.json({ id: user.id, email: user.email, name: user.name });
    res.success({ id: user.id, email: user.email, name: user.name, phone: user.phone }, "get profile successfully", 200);
});
exports.updateProfile = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const userId = req.userId;
    if (!userId)
        throw new customError_1.AppError("unauthorized", 401);
    const { name, phone } = req.body;
    const user = await userService.updateUser(userId, { name, phone });
    // res.json({ id: user.id, email: user.email, name: user.name, phone: user.phone });
    if (!user)
        throw new customError_1.AppError("user not found", 404);
    res.success({ id: userId }, "update profile successfully", 200);
});
exports.removeUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.userId;
    if (!userId)
        throw new customError_1.AppError("unauthorized", 401);
    await userService.deleteUser(userId);
    res.success({ id: userId }, "delete user successfully", 200);
});
