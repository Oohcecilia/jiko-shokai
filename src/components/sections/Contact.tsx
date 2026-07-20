"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Github, Linkedin, Loader2, Send, CheckCircle2, XCircle, Facebook, Instagram } from "lucide-react";
import dynamic from "next/dynamic";
import { useMemo, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { FloatingOrbs } from "@/components/motion/FloatingOrbs";
import { SectionHeading } from "@/components/motion/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendContactEmail } from "@/lib/email";
import { SITE } from "@/lib/data";
import { contactSchema, type ContactSchema } from "@/lib/validations";

function RecaptchaSkeleton() {
  return (
    <div className="flex w-[156px] items-center gap-2 py-1">
      <div className="h-6 w-6 animate-pulse rounded-sm bg-white/10" />
      <div className="flex flex-col gap-1">
        <div className="h-2 w-16 animate-pulse rounded-full bg-white/8" />
        <div className="h-2 w-10 animate-pulse rounded-full bg-white/6" />
      </div>
    </div>
  );
}

const ReCAPTCHADynamic = dynamic(
  () => import("react-google-recaptcha"),
  {
    ssr: false,
    loading: () => <RecaptchaSkeleton />,
  },
);

type Status = "idle" | "loading" | "success" | "error";

const SOCIALS = [
  { icon: Github, href: SITE.github, label: "GitHub" },
  { icon: Linkedin, href: SITE.linkedin, label: "LinkedIn" },
  { icon: Facebook, href: SITE.facebook, label: "Facebook" },
  { icon: Instagram, href: SITE.instagram, label: "Instagram" },
];

/** Stylized, procedurally-placed dot world map — decorative, not geodata-precise. */

// Continent ellipses: { centerX, centerY, radiusX, radiusY } in grid coordinates.
const CONTINENTS = [
  { cx: 6, cy: 6, rx: 5, ry: 3.4 }, // North America
  { cx: 9.5, cy: 12, rx: 2.4, ry: 4 }, // South America
  { cx: 17, cy: 5, rx: 2, ry: 1.8 }, // Europe
  { cx: 18, cy: 9.5, rx: 3, ry: 5 }, // Africa
  { cx: 25.5, cy: 6, rx: 7, ry: 4 }, // Asia
  { cx: 29.5, cy: 13, rx: 2.4, ry: 1.5 }, // Australia
];

const COLS = 36;
const ROWS = 18;

function DotWorldMap() {
  const dots = useMemo(() => {
    const points: { x: number; y: number; key: string }[] = [];
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const jitter = Math.sin(col * 12.9898 + row * 78.233) * 43758.5453;
        const noise = jitter - Math.floor(jitter);
        const isLand = CONTINENTS.some((c) => {
          const dx = (col - c.cx) / c.rx;
          const dy = (row - c.cy) / c.ry;
          return dx * dx + dy * dy <= 1 - noise * 0.15;
        });
        if (isLand) points.push({ x: col, y: row, key: `${col}-${row}` });
      }
    }
    return points;
  }, []);

  // Roughly SE Asia, matching the GMT+8 location badge.
  const pin = { x: 27, y: 9 };

  return (
    <svg
      viewBox={`0 0 ${COLS} ${ROWS}`}
      className="h-full w-full"
      role="img"
      aria-label="Stylized world map highlighting current location"
    >
      {dots.map((d) => (
        <circle
          key={d.key}
          cx={d.x}
          cy={d.y}
          r={0.28}
          className="fill-white/15 transition-colors duration-300 hover:fill-electric"
        />
      ))}
      <circle cx={pin.x} cy={pin.y} r={0.5} className="fill-electric" />
      <circle cx={pin.x} cy={pin.y} r={0.9} className="fill-none stroke-electric/50" strokeWidth={0.12}>
        <animate attributeName="r" values="0.6;1.6;0.6" dur="2.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0;0.8" dur="2.4s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [recaptchaKey, setRecaptchaKey] = useState(0);

  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactSchema>({ resolver: zodResolver(contactSchema) });

  const onRecaptchaChange = useCallback((token: string | null) => {
    setRecaptchaToken(token);
  }, []);

  const onSubmit = async (values: ContactSchema) => {
    if (!recaptchaToken && recaptchaSiteKey) {
      setErrorMessage("Please complete the reCAPTCHA verification.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    try {
      await sendContactEmail({ ...values, recaptchaToken: recaptchaToken ?? undefined });
      setStatus("success");
      reset();
      setRecaptchaKey((prev) => prev + 1);
      setRecaptchaToken(null);
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="relative mx-auto max-w-6xl px-6 py-28 sm:py-36">
      <FloatingOrbs seed={9} count={3} />

      <SectionHeading
        eyebrow="Contact"
        title="Let's build something great"
        subtitle="Have a project in mind? Tell me about it — I read every message myself."
        accent="electric"
      />

      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="flex flex-col gap-6">
          <div className="relative overflow-hidden rounded-3xl border border-glass-border bg-white/[0.02] p-5 sm:p-6">
            <div className="absolute inset-0 opacity-70">
              <DotWorldMap />
            </div>
            <div className="relative flex flex-col gap-1">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 font-body text-xs text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Available for select projects
              </span>
              <p className="mt-16 font-body text-sm text-white/50 sm:mt-24">{SITE.location}</p>
              <p className="font-body text-sm text-white/70">{SITE.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="glass"
              className="flex-1 sm:flex-none"
              onClick={() => window.open(SITE.resumeUrl, "_blank")}
            >
              <Download className="h-4 w-4" /> Download CV
            </Button>
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                data-cursor="hover"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-glass-border bg-white/[0.02] text-white/60 transition-all hover:-translate-y-1 hover:text-electric hover:shadow-glow"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative rounded-3xl border border-glass-border bg-white/[0.02] p-5 backdrop-blur-xl sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Input label="Name" {...register("name")} error={errors.name?.message} />
            <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
          </div>
          <div className="mt-5">
            <Input label="Subject" {...register("subject")} error={errors.subject?.message} />
          </div>
          <div className="mt-5">
            <Textarea label="Message" {...register("message")} error={errors.message?.message} />
          </div>


          <Button type="submit" className="mt-6 w-full" disabled={status === "loading"}>
            <AnimatePresence mode="wait" initial={false}>
              {status === "loading" ? (
                <motion.span key="loading" className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                </motion.span>
              ) : status === "success" ? (
                <motion.span key="success" className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <CheckCircle2 className="h-4 w-4" /> Message sent
                </motion.span>
              ) : (
                <motion.span key="idle" className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Send className="h-4 w-4" /> Send Message
                </motion.span>
              )}
            </AnimatePresence>
          </Button>


            {recaptchaSiteKey && (
            <div className="mt-2 w-full flex justify-center overflow-hidden">
              <ReCAPTCHADynamic
                key={recaptchaKey}
                sitekey={recaptchaSiteKey}
                onChange={onRecaptchaChange}
                theme="dark"
                size="normal"
              />
            </div>
          )}

          <AnimatePresence>
            {status === "error" && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 flex items-center gap-2 font-body text-xs text-red-400"
              >
                <XCircle className="h-3.5 w-3.5" /> {errorMessage}
              </motion.p>
            )}
          </AnimatePresence>
        </form>
      </div>
    </section>
  );
}