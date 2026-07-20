import type { ContactFormValues } from "@/types";

/**
 * Sends the contact form via the server-side API route.
 * 
 * This uses a server-side API which sends emails via EmailJS,
 * keeping credentials secure on the server.
 */
export async function sendContactEmail(values: ContactFormValues & { recaptchaToken?: string }) {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to send message. Please try again.");
  }

  return data;
}
