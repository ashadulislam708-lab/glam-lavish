import * as z from "zod";
import { ShippingZoneEnum, ShippingPartnerEnum } from "~/enums";

export const createOrderSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerPhone: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^(\+?880)?01[3-9]\d{8}$/,
      "Enter a valid Bangladeshi phone number (e.g., 01XXXXXXXXX)"
    ),
  customerAddress: z.string().min(5, "Address is required"),
  district: z.string().min(1, "District is required"),
  upazila: z.string().min(1, "Upazila is required"),
  shippingZone: z.nativeEnum(ShippingZoneEnum, {
    errorMap: () => ({ message: "Select a shipping zone" }),
  }),
  shippingPartner: z.nativeEnum(ShippingPartnerEnum, {
    errorMap: () => ({ message: "Select a shipping partner" }),
  }),
});

export type CreateOrderFormData = z.infer<typeof createOrderSchema>;
