"use client";

import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import NumberFlow from "@number-flow/react";
import { Check, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PricingPlan = {
  name: string;
  price: number;
  yearlyPrice: number;
  description: string;
  features: string[];
  buttonText: string;
  href: string;
  isPopular?: boolean;
};

const plans: PricingPlan[] = [
  {
    name: "Starter",
    price: 75,
    yearlyPrice: 75,
    description: "A focused, sharp one-page launch.",
    features: ["One custom page", "Responsive design", "Clear handoff", "Launch support"],
    buttonText: "Choose Starter",
    href: "/consultation?plan=starter",
  },
  {
    name: "Premium",
    price: 150,
    yearlyPrice: 150,
    description: "A polished site with room to grow.",
    features: ["Up to three pages", "Custom visual direction", "Motion and interactions", "Two revision rounds"],
    buttonText: "Choose Premium",
    href: "/consultation?plan=premium",
    isPopular: true,
  },
  {
    name: "Ultimate",
    price: 300,
    yearlyPrice: 300,
    description: "A complete, considered web presence.",
    features: ["Multi-page website", "Advanced interactions", "Content structure", "Priority launch support"],
    buttonText: "Choose Ultimate",
    href: "/consultation?plan=ultimate",
  },
];

export function Pricing() {
  const [activePlan, setActivePlan] = useState<string | null>(null);
  const toggleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activePlan) return;
    const timeout = window.setTimeout(() => setActivePlan(null), 1200);
    return () => window.clearTimeout(timeout);
  }, [activePlan]);

  const celebrate = (plan: PricingPlan) => {
    setActivePlan(plan.name);
    const rect = toggleRef.current?.getBoundingClientRect();
    confetti({
      particleCount: 45,
      spread: 65,
      startVelocity: 26,
      origin: rect
        ? { x: (rect.left + rect.width / 2) / window.innerWidth, y: rect.top / window.innerHeight }
        : { x: 0.5, y: 0.6 },
      colors: ["#ffffff", "#bdbdbd", "#777777"],
      disableForReducedMotion: true,
    });
  };

  return (
    <section id="pricing" className="relative overflow-hidden py-28 sm:py-36">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="rounded-full border border-border px-4 py-1 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">Pricing</span>
          <h2 className="mt-6 font-[var(--font-display)] text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Choose your starting point</h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">Simple CAD pricing for websites built with care, clarity, and no surprise extras.</p>
        </motion.div>

        <div ref={toggleRef} className="mx-auto mt-10 flex w-fit rounded-full border border-border bg-surface/70 p-1 backdrop-blur">
          <span className="rounded-full bg-foreground px-5 py-2 text-sm text-background">One-time</span>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.article
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10, scale: 1.015 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className={cn("relative flex flex-col rounded-2xl border bg-surface/75 p-7 backdrop-blur-xl", plan.isPopular ? "border-foreground/70 shadow-[0_0_60px_rgba(255,255,255,0.08)]" : "border-border")}
            >
              {plan.isPopular && <div className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-foreground px-4 py-1.5 text-xs font-semibold text-background"><Star className="size-3.5 fill-current" /> Most popular</div>}
              <h3 className="font-[var(--font-display)] text-xl font-semibold text-foreground">{plan.name}</h3>
              <p className="mt-2 min-h-12 text-sm leading-relaxed text-muted-foreground">{plan.description}</p>
              <div className="mt-8 flex items-baseline gap-1">
                <span className="text-2xl text-muted-foreground">$</span>
                <NumberFlow value={plan.price} className="font-[var(--font-display)] text-5xl font-semibold tracking-tight text-foreground" />
                <span className="text-sm text-muted-foreground">CAD</span>
              </div>
              <p className="mt-2 text-xs uppercase tracking-[0.14em] text-muted-2">One-time project price</p>
              <ul className="mt-8 flex-1 space-y-4 text-sm text-muted-foreground">
                {plan.features.map((feature) => <li key={feature} className="flex gap-3"><Check className="mt-0.5 size-4 shrink-0 text-foreground" />{feature}</li>)}
              </ul>
              <Button asChild variant={plan.isPopular ? "default" : "outline"} className="mt-8 w-full rounded-full" onClick={() => celebrate(plan)}><a href={plan.href}>{activePlan === plan.name ? "Let's build it" : plan.buttonText}</a></Button>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
