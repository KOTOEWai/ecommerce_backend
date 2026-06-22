import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/customError";
import * as roleService from "../services/roleService";

const getParamId = (id: string | string[]) => {
  if (Array.isArray(id)) return id[0];
  return id;
};

export const createRole = catchAsync(async (req: Request, res: Response) => {
  const { name } = req.body as { name: string };
  const role = await roleService.createRole({ name });
  res.success(role, "role created successfully", 201);
});

export const getRoles = catchAsync(async (_req: Request, res: Response) => {
  const roles = await roleService.listRoles();

  res.success(roles, "get roles successfully", 200);
});

export const getRole = catchAsync(async (req: Request, res: Response) => {
  const id = getParamId(req.params.id);
  const role = await roleService.findRoleById(id);
  if (!role) throw new AppError("role not found", 404);

  res.success(role, "get role successfully", 200);
});

export const updateRole = catchAsync(async (req: Request, res: Response) => {
  const id = getParamId(req.params.id);
  const role = await roleService.updateRole(id, req.body);

  res.success(role, "role updated successfully", 200);
});

export const removeRole = catchAsync(async (req: Request, res: Response) => {
  const id = getParamId(req.params.id);
  await roleService.deleteRole(id);

  res.success({ id }, "role deleted successfully", 200);
});
