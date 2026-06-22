import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/customError";
import * as addressService from "../services/addressService";

const getParamId = (id: string | string[]) => {
  if (Array.isArray(id)) return id[0];
  return id;
};

const getUserId = (req: Request) => {
  if (!req.userId) throw new AppError("unauthorized", 401);
  return req.userId;
};

export const getAddresses = catchAsync(async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const addresses = await addressService.listAddresses(userId);

  res.success(addresses, "get addresses successfully", 200);
});

export const getAddress = catchAsync(async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const id = getParamId(req.params.id);
  const address = await addressService.findAddressById(userId, id);
  if (!address) throw new AppError("address not found", 404);

  res.success(address, "get address successfully", 200);
});

export const createAddress = catchAsync(async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const address = await addressService.createAddress(userId, req.body);
  res.success(address, "address created successfully", 201);
});

export const updateAddress = catchAsync(async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const id = getParamId(req.params.id);
  const address = await addressService.updateAddress(userId, id, req.body);

  res.success(address, "address updated successfully", 200);
});

export const setDefaultAddress = catchAsync(async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const id = getParamId(req.params.id);
  const address = await addressService.setDefaultAddress(userId, id);

  res.success(address, "default address updated successfully", 200);
});

export const removeAddress = catchAsync(async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const id = getParamId(req.params.id);
  await addressService.deleteAddress(userId, id);
  res.success({ id }, "address deleted successfully", 200);
});
