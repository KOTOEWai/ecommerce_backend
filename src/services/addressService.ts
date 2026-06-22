import { prisma } from "../../lib/prisma";
import { AppError } from "../utils/customError";

export type CreateAddressInput = {
  label?: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
};

export type UpdateAddressInput = Partial<CreateAddressInput>;

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

export const listAddresses = async (userId: string) => {
  return prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    select: addressSelect,
  });
};

export const findAddressById = async (userId: string, id: string) => {
  return prisma.address.findFirst({
    where: { id, userId },
    select: addressSelect,
  });
};

export const createAddress = async (userId: string, input: CreateAddressInput) => {
  return prisma.$transaction(async (tx) => {
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

export const updateAddress = async (userId: string, id: string, input: UpdateAddressInput) => {
  const existing = await prisma.address.findFirst({
    where: { id, userId },
    select: { id: true },
  });

  if (!existing) throw new AppError("address not found", 404);

  return prisma.$transaction(async (tx) => {
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

export const setDefaultAddress = async (userId: string, id: string) => {
  const existing = await prisma.address.findFirst({
    where: { id, userId },
    select: { id: true },
  });

  if (!existing) throw new AppError("address not found", 404);

  return prisma.$transaction(async (tx) => {
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

export const deleteAddress = async (userId: string, id: string) => {
  const existing = await prisma.address.findFirst({
    where: { id, userId },
    select: { id: true, isDefault: true },
  });

  if (!existing) throw new AppError("address not found", 404);

  await prisma.address.delete({
    where: { id },
  });

  if (existing.isDefault) {
    const nextAddress = await prisma.address.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { id: true },
    });

    if (nextAddress) {
      await prisma.address.update({
        where: { id: nextAddress.id },
        data: { isDefault: true },
      });
    }
  }

  return { id };
};
