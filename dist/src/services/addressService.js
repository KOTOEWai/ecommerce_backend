"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAddress = exports.setDefaultAddress = exports.updateAddress = exports.createAddress = exports.findAddressById = exports.listAddresses = void 0;
const prisma_1 = require("../../lib/prisma");
const customError_1 = require("../utils/customError");
const addressSelect = {
    id: true,
    userId: true,
    label: true,
    line1: true,
    line2: true,
    city: true,
    state: true,
    postalCode: true,
    country: true,
    isDefault: true,
    createdAt: true,
};
const listAddresses = async (userId) => {
    return prisma_1.prisma.address.findMany({
        where: { userId },
        orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
        select: addressSelect,
    });
};
exports.listAddresses = listAddresses;
const findAddressById = async (userId, id) => {
    return prisma_1.prisma.address.findFirst({
        where: { id, userId },
        select: addressSelect,
    });
};
exports.findAddressById = findAddressById;
const createAddress = async (userId, input) => {
    return prisma_1.prisma.$transaction(async (tx) => {
        const shouldSetDefault = input.isDefault ?? (await tx.address.count({ where: { userId } })) === 0;
        if (shouldSetDefault) {
            await tx.address.updateMany({
                where: { userId },
                data: { isDefault: false },
            });
        }
        return tx.address.create({
            data: {
                userId,
                label: input.label,
                line1: input.line1,
                line2: input.line2,
                city: input.city,
                state: input.state,
                postalCode: input.postalCode,
                country: input.country,
                isDefault: shouldSetDefault,
            },
            select: addressSelect,
        });
    });
};
exports.createAddress = createAddress;
const updateAddress = async (userId, id, input) => {
    const existing = await prisma_1.prisma.address.findFirst({
        where: { id, userId },
        select: { id: true },
    });
    if (!existing)
        throw new customError_1.AppError("address not found", 404);
    return prisma_1.prisma.$transaction(async (tx) => {
        if (input.isDefault) {
            await tx.address.updateMany({
                where: { userId },
                data: { isDefault: false },
            });
        }
        return tx.address.update({
            where: { id },
            data: {
                ...(input.label !== undefined ? { label: input.label } : {}),
                ...(input.line1 !== undefined ? { line1: input.line1 } : {}),
                ...(input.line2 !== undefined ? { line2: input.line2 } : {}),
                ...(input.city !== undefined ? { city: input.city } : {}),
                ...(input.state !== undefined ? { state: input.state } : {}),
                ...(input.postalCode !== undefined ? { postalCode: input.postalCode } : {}),
                ...(input.country !== undefined ? { country: input.country } : {}),
                ...(input.isDefault !== undefined ? { isDefault: input.isDefault } : {}),
            },
            select: addressSelect,
        });
    });
};
exports.updateAddress = updateAddress;
const setDefaultAddress = async (userId, id) => {
    const existing = await prisma_1.prisma.address.findFirst({
        where: { id, userId },
        select: { id: true },
    });
    if (!existing)
        throw new customError_1.AppError("address not found", 404);
    return prisma_1.prisma.$transaction(async (tx) => {
        await tx.address.updateMany({
            where: { userId },
            data: { isDefault: false },
        });
        return tx.address.update({
            where: { id },
            data: { isDefault: true },
            select: addressSelect,
        });
    });
};
exports.setDefaultAddress = setDefaultAddress;
const deleteAddress = async (userId, id) => {
    const existing = await prisma_1.prisma.address.findFirst({
        where: { id, userId },
        select: { id: true, isDefault: true },
    });
    if (!existing)
        throw new customError_1.AppError("address not found", 404);
    await prisma_1.prisma.address.delete({
        where: { id },
    });
    if (existing.isDefault) {
        const nextAddress = await prisma_1.prisma.address.findFirst({
            where: { userId },
            orderBy: { createdAt: "desc" },
            select: { id: true },
        });
        if (nextAddress) {
            await prisma_1.prisma.address.update({
                where: { id: nextAddress.id },
                data: { isDefault: true },
            });
        }
    }
    return { id };
};
exports.deleteAddress = deleteAddress;
