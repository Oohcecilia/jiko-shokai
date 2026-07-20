import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Your name needs at least 2 characters")
    .max(80, "That name is a little too long"),
  email: z.string().email("Enter a valid email address"),
  subject: z
    .string()
    .min(3, "Give it a short subject")
    .max(120, "Keep the subject under 120 characters"),
  message: z
    .string()
    .min(10, "Say a little more — at least 10 characters")
    .max(2000, "Keep it under 2000 characters"),
  recaptchaToken: z.string().min(1, "Please complete the reCAPTCHA verification").optional(),
});

export type ContactSchema = z.infer<typeof contactSchema>;
