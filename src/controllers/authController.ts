import { AppError } from "../utils/customError";
import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../utils/catchAsync";
import { signToken } from "../utils/jwt";
import * as userService from "../services/userService";
import { hashPassword } from "../utils/hash"
import { verifyPassword } from "../utils/hash";

export const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, name, phone, role } = req.body as {
    email?: string;
    password?: string;
    name?: string;
    phone?: string;
    role?: string;
  };

  if (!email || !password) throw new AppError("email and password required", 400);
  const passwordHash = await hashPassword(password);
  const user = await userService.createUser({ email, passwordHash, name, phone, role });
  const token = signToken({ userId: user?.id, email: user?.email });
  //  return res.status(201).json({ user, token });
  res.success({ user, token }, "user successfully created", 201)
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) throw new AppError("email and password required", 400);

  const user = await userService.findUserByEmail(email);
  if (!user) throw new AppError("invalid credentials", 401);

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) throw new AppError("invalid credentials", 401);

  const token = signToken({ userId: user.id, email: user.email });
  const safe = { id: user.id, email: user.email, name: user.name, phone: user.phone };
 //return res.json({ user: safe, token });
   res.success({ safe,token},"user successfully logged in",200)
});
