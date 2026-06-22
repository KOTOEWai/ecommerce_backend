import { prisma } from "../../lib/prisma";
import { AppError } from "../utils/customError";

export type CreateRoleInput = {
  name: string;
};

export type UpdateRoleInput = {
  name?: string;
};

const normalizeRoleName = (name: string) => name.trim().toLowerCase();

const handleRoleError = (err: unknown): never => {
  if (typeof err === "object" && err !== null && "code" in err && (err as any).code === "P2002") {
    throw new AppError("role already exists", 400);
  }

  throw err;
};

export const createRole = async (input: CreateRoleInput) => {
  try {
    return await prisma.role.create({
      data: {
        name: normalizeRoleName(input.name),
      },
    });
  } catch (err) {
    handleRoleError(err);
  }
};

export const listRoles = async () => {
  return prisma.role.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { users: true },
      },
    },
  });
};

export const findRoleById = async (id: string) => {
  return prisma.role.findUnique({
    where: { id },
    include: {
      _count: {
        select: { users: true },
      },
    },
  });
};

export const updateRole = async (id: string, input: UpdateRoleInput) => {
  try {
    return await prisma.role.update({
      where: { id },
      data: {
        ...(input.name ? { name: normalizeRoleName(input.name) } : {}),
      },
    });
  } catch (err) {
    handleRoleError(err);
  }
};

export const deleteRole = async (id: string) => {
  const usersCount = await prisma.user.count({
    where: { roleId: id },
  });

  if (usersCount > 0) {
    throw new AppError("cannot delete role while users are assigned to it", 400);
  }

  return prisma.role.delete({
    where: { id },
  });
};
