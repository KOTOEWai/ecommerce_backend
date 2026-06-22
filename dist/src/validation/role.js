"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoleSchema = exports.createRoleSchema = void 0;
const zod_1 = require("zod");
exports.createRoleSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2, { message: "Role name must be at least 2 characters" }),
});
exports.updateRoleSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2, { message: "Role name must be at least 2 characters" }).optional(),
});
