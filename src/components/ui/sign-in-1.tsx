"use client";

import { useState } from "react";
import { ArrowLeft, Globe2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

type AuthFormProps = {
  plan?: string;
};

export function AuthForm({ plan = "your project" }: AuthFormProps) {
  const [message, setMessage] = useState("");

  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <a href="/" className="flex items-center gap-2 font-[var(--font-display)] text-lg font-semibold tracking-tight"><img src="/logo.png" alt="Unevn Studios" className="size-6" />Unevn Studios</a>
        <Button asChild variant="outline" className="rounded-full"><a href="/">Back home</a></Button>
      </div>
      <div className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-5xl items-center gap-16 py-16 lg:grid-cols-[1fr_380px]">
        <div className="hidden lg:block">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Project access</p>
          <h1 className="mt-6 max-w-xl font-[var(--font-display)] text-6xl font-semibold leading-[0.95] tracking-tight">Good work starts with a clear first step.</h1>
          <p className="mt-7 max-w-md text-lg leading-relaxed text-muted-foreground">Create an account before placing {plan}. Your project details will stay attached to your account.</p>
        </div>
        <section className="rounded-2xl border border-border bg-surface/75 p-7 shadow-2xl backdrop-blur-xl sm:p-9">
          <div className="mb-8 text-center"><div className="mx-auto grid size-12 place-items-center rounded-xl border border-border bg-background"><img src="/logo.png" alt="" className="size-7" /></div><h2 className="mt-5 font-[var(--font-display)] text-2xl font-semibold">Sign in to continue</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">You need an Unevn account to place an order.</p></div>
          <div className="space-y-3"><Button asChild className="h-11 w-full rounded-xl"><a href={`/login?plan=${encodeURIComponent(plan)}`}><Globe2 className="mr-2 size-4" />Continue with Google</a></Button><div className="relative py-3 text-center text-xs uppercase tracking-[0.16em] text-muted-foreground"><span className="relative z-10 bg-surface px-3">or</span><span className="absolute inset-x-0 top-1/2 border-t border-border" /></div><Button type="button" variant="outline" className="h-11 w-full rounded-xl" onClick={() => setMessage("Email sign-in is not connected yet. It will be available here soon.")}><Mail className="mr-2 size-4" />Continue with email</Button></div>
          {message && <p role="status" className="mt-5 rounded-xl border border-border bg-background p-3 text-center text-sm text-muted-foreground">{message}</p>}
          <div className="mt-8 border-t border-border pt-6 text-center"><p className="text-sm text-muted-foreground">Need an account?</p><Button type="button" variant="link" className="mt-1 text-foreground" onClick={() => setMessage("Account creation is not connected yet. Contact hello@unevnstudios.ca to get started.")}>Create one</Button></div>
          <a href="/" className="mt-5 flex items-center justify-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"><ArrowLeft className="size-4" />Return to Unevn</a>
        </section>
      </div>
    </main>
  );
}
