import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().nonempty({ message: 'Email is required' }).email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  name: z.string().nonempty({ message: 'Name is required' }),
  phone: z.string().nonempty({ message: 'Phone number is required' }).regex(/^\d{10}$/, { message: 'Phone number must be 10 digits' }),
  role: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().nonempty({ message: 'Email is required' }).email({ message: 'Invalid email address' }),
  password: z.string().nonempty({ message: 'Password is required' }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
