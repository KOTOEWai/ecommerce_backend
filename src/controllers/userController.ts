import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/customError";
import * as userService from "../services/userService";

type AuthRequest = Request & { userId?: string };

export const getUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const users = await userService.listUsers();
     const getUsers = users.map(u => ({ id: u.id, email: u.email, name: u.name, phone: u.phone, createdAt: u.createdAt }));
   // res.status(200).json(users.map(u => ({ id: u.id, email: u.email, name: u.name, createdAt: u.createdAt })));\
     res.success(getUsers, "get users successfully",200)
});

export const getProfile = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.userId;
    if (!userId) throw new AppError("unauthorized", 401);
    const user = await userService.findUserById(userId);
    if (!user) throw new AppError("not found", 404);
   // res.json({ id: user.id, email: user.email, name: user.name });
     res.success({ id: user.id, email: user.email, name: user.name, phone: user.phone },"get profile successfully",200)
});



export const updateProfile = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.userId;
    if (!userId) throw new AppError("unauthorized", 401);
    const { name, phone } = req.body;
    const user = await userService.updateUser(userId, { name, phone });
   // res.json({ id: user.id, email: user.email, name: user.name, phone: user.phone });
   if (!user) throw new AppError("user not found", 404);
   res.success({ id: userId},"update profile successfully",200)
});

export const removeUser = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.userId;
    if (!userId) throw new AppError("unauthorized", 401);
    await userService.deleteUser(userId);
    res.success({ id: userId },"delete user successfully",200)
});
