import { prisma } from "../../lib/prisma";
import { AppError } from "../utils/customError";

export type CreateUserInput = {
  email: string;
  passwordHash: string;
  name?: string;
  phone?: string;
  role?: string; // role name (optional)
};

export const createUser = async (input: CreateUserInput) => {
  // normalize
  const email = input.email.trim().toLowerCase();

  // simple validation
  if (!email || !input.passwordHash) {
    throw new Error("email and passwordHash are required");
  }

  try {
    return await prisma.$transaction(async (tx) => {
      //Transaction ဆိုတာ "အလုပ်တွေ အကုန်အောင်မြင်မှ Save မယ်၊ တစ်ခုခုမှားရင် အကုန် ပြန်ဖျက်မယ်" ဆိုတဲ့ သဘောပါ။
     //ဒီနေရာမှာ Role ကို ရှာတယ်၊ ပြီးမှ User ကို Create လုပ်တယ်။ တကယ်လို့ User Create လုပ်တဲ့နေရာမှာ Error တက်ခဲ့ရင် ခုနက ရှာထားတဲ့ Role အချက်အလက်တွေပါ အလကားဖြစ်သွားအောင် သူက စောင့်ကြည့်ပေးပါတယ်။
      // resolve role if provided (by name)
      let roleId: string | undefined;
      if (input.role) {
        const role = await tx.role.findUnique({ where: { name: input.role } });
        if (role) roleId = role.id;
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
  } catch (err: unknown) {
    // Prisma unique constraint error code is P2002
    if (typeof err === "object" && err !== null && "code" in err && (err as any).code === "P2002") {
      throw new AppError("email already exists", 400);
    }
    throw err;
  }
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const findUserById = async (id: string) => {
  return prisma.user.findUnique({ where: { id } });
};

export const listUsers = async () => {
  return prisma.user.findMany();
};

export type UpdateUserInput = {
  name?: string;
  phone?: string;
  email?: string;
  roleId?: string | null;
};

export const updateUser = async (id: string, data: UpdateUserInput) => {
  return prisma.user.update({ where: { id }, data });
};

export const deleteUser = async (id: string) => {
  return prisma.user.delete({ where: { id } });
};
