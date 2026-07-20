import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Your name needs at least 2 characters").max(80, "That name is a little too long"),
  email: z.string().email("Enter a valid email address"),
  subject: z.string().min(3, "Give it a short subject").max(120, "Keep the subject under 120 characters"),
  message: z.string().min(10, "Say a little more — at least 10 characters").max(2000, "Keep it under 2000 characters"),
  recaptchaToken: z.string().min(1).optional(),
});

const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per hour per IP
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  return forwarded?.split(",")[0]?.trim() || realIp || "unknown";
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1, resetTime: now + RATE_LIMIT_WINDOW };
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - record.count, resetTime: record.resetTime };
}

function getEmailJSConfig(): {
  serviceId: string;
  templateId: string;
  publicKey: string;
  privateKey: string | undefined;
} | null {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey) {
    return null;
  }

  return { serviceId, templateId, publicKey, privateKey };
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(ip);

  if (!rateLimit.allowed) {
    const resetInMinutes = Math.ceil((rateLimit.resetTime - Date.now()) / 60000);
    return NextResponse.json(
      { error: `Too many requests. Please try again in ${resetInMinutes} minute(s).` },
      { 
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(RATE_LIMIT_MAX_REQUESTS),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(rateLimit.resetTime / 1000)),
        }
      }
    );
  }

  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      const firstError = Object.values(errors)[0]?.[0] || "Invalid form data";
      return NextResponse.json(
        { error: firstError, details: errors },
        { 
          status: 400,
          headers: {
            "X-RateLimit-Limit": String(RATE_LIMIT_MAX_REQUESTS),
            "X-RateLimit-Remaining": String(rateLimit.remaining),
            "X-RateLimit-Reset": String(Math.ceil(rateLimit.resetTime / 1000)),
          }
        }
      );
    }

    const { name, email, subject, message, recaptchaToken } = parsed.data;
    const emailConfig = getEmailJSConfig();

    if (!emailConfig) {
      console.warn("Contact form submission blocked: EmailJS is not configured.");
      return NextResponse.json(
        { error: "The contact form is not fully configured yet. Please try again later." },
        {
          status: 503,
          headers: {
            "X-RateLimit-Limit": String(RATE_LIMIT_MAX_REQUESTS),
            "X-RateLimit-Remaining": String(rateLimit.remaining),
            "X-RateLimit-Reset": String(Math.ceil(rateLimit.resetTime / 1000)),
          },
        }
      );
    }

    const { serviceId, templateId, publicKey, privateKey } = emailConfig;

    // Embed email into the message body so it appears in the email content
    const messageWithEmail = `From: ${name} <${email}>
Subject: ${subject}

${message}`;

    // Send via EmailJS REST API (server-side)
    const payload: Record<string, unknown> = {
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: {
        from_name: name,
        from_email: email,
        subject: subject,
        message: messageWithEmail,
        // reCAPTCHA v2 verification token — validated by EmailJS
        "g-recaptcha-response": recaptchaToken,
      },
    };

    // Include private key when available for server-side authorization
    if (privateKey) {
      payload.accessToken = privateKey;
    }

    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("EmailJS error:", response.status, errorText);
      throw new Error("Failed to send message. Please try again.");
    }

    return NextResponse.json(
      { success: true, message: "Message sent successfully!" },
      {
        headers: {
          "X-RateLimit-Limit": String(RATE_LIMIT_MAX_REQUESTS),
          "X-RateLimit-Remaining": String(rateLimit.remaining),
          "X-RateLimit-Reset": String(Math.ceil(rateLimit.resetTime / 1000)),
        }
      }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send message. Please try again later." },
      { 
        status: 500,
        headers: {
          "X-RateLimit-Limit": String(RATE_LIMIT_MAX_REQUESTS),
          "X-RateLimit-Remaining": String(rateLimit.remaining),
          "X-RateLimit-Reset": String(Math.ceil(rateLimit.resetTime / 1000)),
        }
      }
    );
  }
}
