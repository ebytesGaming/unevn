"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PasswordStrength } from "@/components/ui/password-strength";

export function AuthUI({ onCreated, adminPassword = "" }: { onCreated?: () => void; adminPassword?: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ name: "", email: "" });
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    const result = await fetch("/api/accounts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, password, adminPassword }) });
    const body = await result.json() as { error?: string };
    if (!result.ok) return setMessage(body.error || "Could not create account.");
    setMessage("Account created."); setForm({ name: "", email: "" }); setPassword(""); onCreated?.();
  };
  return <form onSubmit={submit} className="space-y-4"><h2 className="font-[var(--font-display)] text-2xl font-semibold">Create an account</h2><p className="text-sm text-muted-foreground">Add a client account for their project updates.</p><input required placeholder="Full name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground" /><input required type="email" placeholder="Email address" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground" /><div className="relative"><input required minLength={12} type={showPassword ? "text" : "password"} placeholder="Temporary password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-12 text-sm outline-none focus:border-foreground" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-muted-foreground">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div><PasswordStrength value={password} /><Button type="submit" disabled={password.length < 12}>Create account</Button>{message && <p className="text-sm text-muted-foreground">{message}</p>}</form>;
}
