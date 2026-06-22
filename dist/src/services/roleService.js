"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRole = exports.updateRole = exports.findRoleById = exports.listRoles = exports.createRole = void 0;
const prisma_1 = require("../../lib/prisma");
const customError_1 = require("../utils/customError");
const normalizeRoleName = (name) => name.trim().toLowerCase();
const handleRoleError = (err) => {
    if (typeof err === "object" && err !== null && "code" in err && err.code === "P2002") {
        throw new customError_1.AppError("role already exists", 400);
    }
    throw err;
};
const createRole = async (input) => {
    try {
        return await prisma_1.prisma.role.create({
            data: {
                name: normalizeRoleName(input.name),
            },
        });
    }
    catch (err) {
        handleRoleError(err);
    }
};
exports.createRole = createRole;
const listRoles = async () => {
    return prisma_1.prisma.role.findMany({
        orderBy: { name: "asc" },
        include: {
            _count: {
                select: { users: true },
            },
        },
    });
};
exports.listRoles = listRoles;
const findRoleById = async (id) => {
    return prisma_1.prisma.role.findUnique({
        where: { id },
        include: {
            _count: {
                select: { users: true },
            },
        },
    });
};
exports.findRoleById = findRoleById;
const updateRole = async (id, input) => {
    try {
        return await prisma_1.prisma.role.update({
            where: { id },
            data: {
                ...(input.name ? { name: normalizeRoleName(input.name) } : {}),
            },
        });
    }
    catch (err) {
        handleRoleError(err);
    }
};
exports.updateRole = updateRole;
const deleteRole = async (id) => {
    const usersCount = await prisma_1.prisma.user.count({
        where: { roleId: id },
    });
    if (usersCount > 0) {
        throw new customError_1.AppError("cannot delete role while users are assigned to it", 400);
    }
    return prisma_1.prisma.role.delete({
        where: { id },
    });
};
exports.deleteRole = deleteRole;
