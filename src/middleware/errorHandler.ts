import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/customError";

export const errorHandler = (
  err: any, 
  _req: Request, 
  res: Response, 
  _next: NextFunction
) => {
  // ၁။ မူရင်းရလာတဲ့ status code ရှိရင်ယူမယ်၊ မရှိရင် 500 (Internal Server) သတ်မှတ်မယ်
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // ၂။ တကယ်လို့ AppError မဟုတ်တဲ့ တခြား (Database/Zod) Error မျိုးဆိုရင်
  if (!(err instanceof AppError)) {
    // Development အခြေအနေမှာ တကယ့် Error Message အစစ်ကို သိချင်လို့ ပြန်ထည့်ပေးထားမယ်
    if (process.env.NODE_ENV !== "production") {
      message = err.message;
    } else {
      // Production မှာတော့ အပြင်လူကို အမှားအသေးစိတ် မမြင်စေချင်လို့ ဖုံးကွယ်ထားမယ်
      message = "တစ်ခုခုမှားယွင်းနေပါသည်၊ ခေတ္တစောင့်ပြီးမှ ပြန်လည်ကြိုးစားပါ";
    }
  }

  // ၃။ တုံ့ပြန်မည့် Response Format ကို တည်ဆောက်ခြင်း
  const response = {
    success: false,
    status: "error",
    statusCode: statusCode,
    message: message,
    // Production မဟုတ်ရင် ကုတ်ဘယ်နားမှာ မှားလဲဆိုတဲ့ Stack Trace ကိုပါ ထည့်ပြပေးမယ်
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
  };

  res.status(statusCode).json(response);
};