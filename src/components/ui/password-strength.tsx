"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

const rules = [
  ["12 characters or more", (value: string) => value.length >= 12],
  ["Upper and lower case", (value: string) => /[a-z]/.test(value) && /[A-Z]/.test(value)],
  ["A number", (value: string) => /\d/.test(value)],
  ["A symbol", (value: string) => /[^a-zA-Z\d]/.test(value)],
] as const;

export function PasswordStrength({ value }: { value: string }) {
  const passed = useMemo(() => rules.map(([, test]) => test(value)), [value]);
  const score = passed.filter(Boolean).length;
  const labels = ["Empty", "Weak", "Fair", "Good", "Strong"];
  return <div className="mt-3 space-y-2" aria-live="polite"><div className="flex gap-1">{rules.map(([label], index) => <motion.span key={label} animate={{ scaleX: index < score ? 1 : 0.2, opacity: index < score ? 1 : 0.35 }} className={`h-1.5 flex-1 origin-left rounded-full ${score < 2 ? "bg-red-500" : score < 4 ? "bg-amber-500" : "bg-emerald-500"}`} />)}</div><p className="text-xs text-muted-foreground">{labels[score]}</p><ul className="space-y-1">{rules.map(([label], index) => <li key={label} className={`text-xs ${passed[index] ? "text-emerald-400" : "text-muted-foreground"}`}>{passed[index] ? "✓" : "○"} {label}</li>)}</ul></div>;
}
