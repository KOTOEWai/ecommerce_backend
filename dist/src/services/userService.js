"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.listUsers = exports.findUserById = exports.findUserByEmail = exports.createUser = void 0;
const prisma_1 = require("../../lib/prisma");
const customError_1 = require("../utils/customError");
const createUser = async (input) => {
    // normalize
    const email = input.email.trim().toLowerCase();
    // simple validation
    if (!email || !input.passwordHash) {
        throw new Error("email and passwordHash are required");
    }
    try {
        return await prisma_1.prisma.$transaction(async (tx) => {
            //Transaction ဆိုတာ "အလုပ်တွေ အကုန်အောင်မြင်မှ Save မယ်၊ တစ်ခုခုမှားရင် အကုန် ပြန်ဖျက်မယ်" ဆိုတဲ့ သဘောပါ။
            //ဒီနေရာမှာ Role ကို ရှာတယ်၊ ပြီးမှ User ကို Create လုပ်တယ်။ တကယ်လို့ User Create လုပ်တဲ့နေရာမှာ Error တက်ခဲ့ရင် ခုနက ရှာထားတဲ့ Role အချက်အလက်တွေပါ အလကားဖြစ်သွားအောင် သူက စောင့်ကြည့်ပေးပါတယ်။
            // resolve role if provided (by name)
            let roleId;
            if (input.role) {
                const role = await tx.role.findUnique({ where: { name: input.role } });
                if (role)
                    roleId = role.id;
            }
            const user = await tx.user.create({
                data: {
                    email,
                    passwordHash: input.passwordHash,
                    name: input.name,
                    phone: input.phone,
                    roleId,
                },
            });
            // return a sanitized user (do not expose passwordHash)
            const safeUser = await tx.user.findUnique({
                where: { id: user.id },
                select: { id: true, email: true, name: true, phone: true, roleId: true, createdAt: true },
            });
            return safeUser;
        });
    }
    catch (err) {
        // Prisma unique constraint error code is P2002
        if (typeof err === "object" && err !== null && "code" in err && err.code === "P2002") {
            throw new customError_1.AppError("email already exists", 400);
        }
        throw err;
    }
};
exports.createUser = createUser;
const findUserByEmail = async (email) => {
    return prisma_1.prisma.user.findUnique({ where: { email } });
};
exports.findUserByEmail = findUserByEmail;
const findUserById = async (id) => {
    return prisma_1.prisma.user.findUnique({ where: { id } });
};
exports.findUserById = findUserById;
const listUsers = async () => {
    return prisma_1.prisma.user.findMany();
};
exports.listUsers = listUsers;
const updateUser = async (id, data) => {
    return prisma_1.prisma.user.update({ where: { id }, data });
};
exports.updateUser = updateUser;
const deleteUser = async (id) => {
    return prisma_1.prisma.user.delete({ where: { id } });
};
exports.deleteUser = deleteUser;
