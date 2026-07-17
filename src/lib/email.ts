import emailjs from "@emailjs/browser";
import type { ContactFormValues } from "@/types";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "";
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "";
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "";

/**
 * Sends the contact form through EmailJS.
 *
 * To wire this up for real:
 * 1. Create a (free) account at https://www.emailjs.com
 * 2. Add an email service + template, matching {{name}}, {{email}},
 *    {{subject}} and {{message}} variables in the template body.
 * 3. Copy the three IDs into .env.local (see .env.example).
 *
 * Until those env vars are set, this throws a clear error instead of
 * silently failing, so the form's error state can surface it.
 */
export async function sendContactEmail(values: ContactFormValues) {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    throw new Error(
      "EmailJS is not configured yet. Add your service/template/public keys to .env.local."
    );
  }

  return emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      from_name: values.name,
      reply_to: values.email,
      subject: values.subject,
      message: values.message,
    },
    { publicKey: PUBLIC_KEY }
  );
}
