import { z } from "zod";

/**
 * Validates Sri Lankan mobile numbers across standard formats:
 * - 07X XXX XXXX (10 digits)
 * - 947X XXX XXXX (11 digits)
 * - +947X XXX XXXX (12 chars)
 */
export const sriLankanPhoneRegex = /^(?:0|94|\+94)?(7[01245678]\d{7})$/;

export const phoneSchema = z
  .string()
  .trim()
  .regex(sriLankanPhoneRegex, "වලංගු ශ්‍රී ලාංකික ජංගම දුරකථන අංකයක් ඇතුළත් කරන්න (Invalid Sri Lankan phone number)");

export const otpSchema = z
  .string()
  .trim()
  .length(4, "OTP කේතය ඉලක්කම් 4කින් සමන්විත විය යුතුය (Must be 4 digits)")
  .regex(/^\d{4}$/, "OTP කේතයේ අඩංගු විය හැක්කේ ඉලක්කම් පමණි (Must be numeric)");

export const integerCentsSchema = z
  .number()
  .int("Amount must be an integer cent value")
  .nonnegative("Amount cannot be negative");

export const orderPlacementSchema = z.object({
  contact: z.object({
    firstName: z.string().min(1, "First name is required").max(60),
    lastName: z.string().max(60).optional(),
    phone: phoneSchema,
    email: z.string().email("Invalid email address").optional().or(z.literal("")),
  }),
  shippingAddress: z.object({
    street1: z.string().min(3, "Address is required"),
    street2: z.string().optional(),
    city: z.string().min(2, "City is required"),
    district: z.string().min(2, "District is required"),
    landmark: z.string().optional(),
  }),
  deliveryMethod: z.enum(["COURIER", "EXPRESS", "PICKUP"]),
  paymentMethod: z.enum(["PAYHERE", "BANK_TRANSFER", "CASH_ON_DELIVERY", "KOKO"]),
  items: z
    .array(
      z.object({
        bookId: z.string(),
        slug: z.string(),
        title: z.string(),
        format: z.enum(["PAPERBACK", "HARDCOVER", "EBOOK"]),
        priceCents: integerCentsSchema,
        quantity: z.number().int().min(1),
        isDigital: z.boolean(),
      })
    )
    .min(1, "Cart cannot be empty"),
  couponCode: z.string().optional(),
  customerNote: z.string().max(500).optional(),
});
