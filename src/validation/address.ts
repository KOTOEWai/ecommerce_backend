import { z } from "zod";

export const createAddressSchema = z.object({
  label: z.string().trim().min(1, { message: "Label cannot be empty" }).optional(),
  line1: z.string().trim().min(1, { message: "Address line 1 is required" }),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(1, { message: "City is required" }),
  state: z.string().trim().optional(),
  postalCode: z.string().trim().min(1, { message: "Postal code is required" }),
  country: z.string().trim().min(1, { message: "Country is required" }),
  isDefault: z.boolean().optional(),
});

export const updateAddressSchema = createAddressSchema.partial(); // partial is ပုံမှန်အားဖြင့် create လုပ်တဲ့အခါ Field တွေ အကုန်လိုပေမဲ့ update လုပ်တဲ့အခါမှာတော့ လိုအပ်တဲ့ Field ကိုပဲ ပို့ပြီး Update လုပ်ချင်တာမျိုး ဖြစ်တတ်ပါတယ်။

export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
