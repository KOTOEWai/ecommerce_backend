"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().nonempty({ message: 'Email is required' }).email({ message: 'Invalid email address' }),
    password: zod_1.z.string().min(6, { message: 'Password must be at least 6 characters' }),
    name: zod_1.z.string().nonempty({ message: 'Name is required' }),
    phone: zod_1.z.string().nonempty({ message: 'Phone number is required' }).regex(/^\d{10}$/, { message: 'Phone number must be 10 digits' }),
    role: zod_1.z.string().optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().nonempty({ message: 'Email is required' }).email({ message: 'Invalid email address' }),
    password: zod_1.z.string().nonempty({ message: 'Password is required' }),
});
