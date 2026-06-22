"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAddressSchema = exports.createAddressSchema = void 0;
const zod_1 = require("zod");
exports.createAddressSchema = zod_1.z.object({
    label: zod_1.z.string().trim().min(1, { message: "Label cannot be empty" }).optional(),
    line1: zod_1.z.string().trim().min(1, { message: "Address line 1 is required" }),
    line2: zod_1.z.string().trim().optional(),
    city: zod_1.z.string().trim().min(1, { message: "City is required" }),
    state: zod_1.z.string().trim().optional(),
    postalCode: zod_1.z.string().trim().min(1, { message: "Postal code is required" }),
    country: zod_1.z.string().trim().min(1, { message: "Country is required" }),
    isDefault: zod_1.z.boolean().optional(),
});
exports.updateAddressSchema = exports.createAddressSchema.partial(); // partial is ပုံမှန်အားဖြင့် create လုပ်တဲ့အခါ Field တွေ အကုန်လိုပေမဲ့ update လုပ်တဲ့အခါမှာတော့ လိုအပ်တဲ့ Field ကိုပဲ ပို့ပြီး Update လုပ်ချင်တာမျိုး ဖြစ်တတ်ပါတယ်။
