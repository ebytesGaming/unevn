"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  "Contact",
  "Business",
  "Goals",
  "Style",
  "Budget",
  "Details",
  "Consultation",
];

type FormData = {
  name: string;
  email: string;
  company: string;
  profession: string;
  industry: string;
  goal: string;
  audience: string;
  style: string;
  inspirations: string;
  budget: string;
  timeline: string;
  features: string[];
  additionalInfo: string;
  consultationDate: string;
};

const initialData: FormData = {
  name: "",
  email: "",
  company: "",
  profession: "",
  industry: "",
  goal: "",
  audience: "",
  style: "",
  inspirations: "",
  budget: "",
  timeline: "",
  features: [],
  additionalInfo: "",
  consultationDate: "",
};

const optionClass = "w-full rounded-xl border border-border bg-background px-4 py-3 text-left text-sm transition hover:border-foreground/40 data-[selected=true]:border-foreground data-[selected=true]:bg-surface-2";

export default function MultistepForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const selectedPlan = new URLSearchParams(window.location.search).get("plan") || "Not specified";
  const today = new Date();
  const minConsultationDate = today.toISOString().split("T")[0];
  const maxConsultationDate = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0];

  const update = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const toggleFeature = (feature: string) => {
    update(
      "features",
      formData.features.includes(feature)
        ? formData.features.filter((item) => item !== feature)
        : [...formData.features, feature],
    );
  };

  const valid = () => {
    if (currentStep === 0) return formData.name.trim() && /\S+@\S+\.\S+/.test(formData.email);
    if (currentStep === 1) return formData.profession && formData.industry;
    if (currentStep === 2) return formData.goal;
    if (currentStep === 3) return formData.style;
    if (currentStep === 4) return formData.budget && formData.timeline;
    return true;
  };

  const next = () => {
    if (valid() && currentStep < steps.length - 1) setCurrentStep((step) => step + 1);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const result = await fetch("/api/send-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, plan: selectedPlan }),
      });
      const response = await result.json() as { error?: string };
      if (!result.ok) throw new Error(response.error || "Email delivery failed.");
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Email delivery failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
        <div className="grid size-16 place-items-center rounded-full bg-white text-black shadow-[0_0_50px_rgba(255,255,255,0.2)]"><Check /></div>
        <h1 className="mt-6 font-[var(--font-display)] text-4xl font-semibold">Request confirmed</h1>
        <p className="mt-4 text-muted-foreground">Your confirmation has been sent, and the Unevn team has received your project details.</p>
        <Button asChild className="mt-8 rounded-full"><a href="/">Return home</a></Button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background px-6 pb-20 pt-28 text-foreground">
      <div className="mx-auto max-w-2xl">
        <a href="/" className="font-mono text-sm text-muted-foreground transition hover:text-foreground">← Unevn Studios</a>
        <div className="mt-12">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Project intake</p>
          <h1 className="mt-4 font-[var(--font-display)] text-4xl font-semibold tracking-tight sm:text-6xl">Let&apos;s make it unmistakable.</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">A few quick questions and we&apos;ll have a clear starting point.</p>
        </div>

        <div className="mt-12 flex items-center gap-1.5">
          {steps.map((step, index) => <div key={step} className="flex flex-1 flex-col gap-2"><div className={`h-1 rounded-full transition-colors ${index <= currentStep ? "bg-foreground" : "bg-surface-2"}`} /><span className="hidden font-mono text-[10px] text-muted-foreground sm:block">{index + 1}. {step}</span></div>)}
        </div>

        <form onSubmit={submit} className="mt-10 overflow-hidden rounded-2xl border border-border bg-surface/60 p-6 shadow-2xl backdrop-blur-xl sm:p-9">
          <AnimatePresence mode="wait">
            <motion.div key={currentStep} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
              {currentStep === 0 && <Step title="First, who are we building for?" description="Your details help us keep the conversation personal."><Field label="Full name" value={formData.name} onChange={(value) => update("name", value)} placeholder="Jane Smith" /><Field label="Email address" type="email" value={formData.email} onChange={(value) => update("email", value)} placeholder="jane@example.com" /><Field label="Company or project" value={formData.company} onChange={(value) => update("company", value)} placeholder="Optional" /></Step>}
              {currentStep === 1 && <Step title="Tell us about your work" description="A little context helps shape the right site."><Field label="What do you do?" value={formData.profession} onChange={(value) => update("profession", value)} placeholder="Designer, café owner, coach..." /><SelectField label="Industry" value={formData.industry} onChange={(value) => update("industry", value)} options={["Creative", "Food and hospitality", "Health and wellness", "Professional services", "Retail", "Other"]} /></Step>}
              {currentStep === 2 && <Step title="What should the website do?" description="Choose the outcome that matters most."><ChoiceGroup value={formData.goal} onChange={(value) => update("goal", value)} options={["Showcase my work", "Sell products or services", "Generate inquiries", "Share information", "Launch a new idea"]} /><Field label="Who should it speak to? (optional)" value={formData.audience} onChange={(value) => update("audience", value)} placeholder="Your ideal visitor or customer" /></Step>}
              {currentStep === 3 && <Step title="What should it feel like?" description="There are no wrong answers here."><ChoiceGroup value={formData.style} onChange={(value) => update("style", value)} options={["Modern and sleek", "Quiet and minimal", "Bold and expressive", "Warm and welcoming"]} /><Field label="Any sites or references you like? (optional)" value={formData.inspirations} onChange={(value) => update("inspirations", value)} placeholder="Paste links or describe the feeling" /></Step>}
              {currentStep === 4 && <Step title="Budget and timing" description="This helps us recommend the right starting point."><SelectField label="Budget" value={formData.budget} onChange={(value) => update("budget", value)} options={["Starter — $75 CAD", "Premium — $150 CAD", "Ultimate — $300 CAD", "Not sure yet"]} /><SelectField label="When would you like to launch?" value={formData.timeline} onChange={(value) => update("timeline", value)} options={["As soon as possible", "Within one month", "Within three months", "I’m flexible"]} /></Step>}
              {currentStep === 5 && <Step title="The useful details" description="Select anything you already know you need."><div className="grid gap-2 sm:grid-cols-2">{["Contact form", "Blog or news", "E-commerce", "Booking flow", "Social integration", "Analytics", "Newsletter", "Other"].map((feature) => <button key={feature} type="button" data-selected={formData.features.includes(feature)} className={optionClass} onClick={() => toggleFeature(feature)}><span className="mr-2 inline-block size-3 rounded-sm border border-muted-foreground align-[-1px] data-[selected=true]:bg-foreground" />{feature}</button>)}</div><Field label="Anything else? (optional)" value={formData.additionalInfo} onChange={(value) => update("additionalInfo", value)} placeholder="Tell us anything useful" multiline /></Step>}
                  {currentStep === 6 && <Step title="Want to talk it through?" description="Choose a consultation date this month, or skip it for now."><label className="block space-y-2"><span className="text-sm font-medium">Consultation date <span className="text-muted-foreground">(optional)</span></span><input type="date" value={formData.consultationDate} min={minConsultationDate} max={maxConsultationDate} onChange={(event) => update("consultationDate", event.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-foreground" /></label><p className="mt-4 text-sm leading-relaxed text-muted-foreground">Pick a day that works for a short consultation. We&apos;ll confirm the time by email.</p></Step>}
            </motion.div>
          </AnimatePresence>
          {submitError && <p role="alert" className="mt-5 text-sm text-red-400">{submitError}</p>}
          <div className="mt-10 flex justify-between border-t border-border pt-6"><Button type="button" variant="ghost" onClick={() => setCurrentStep((step) => step - 1)} disabled={currentStep === 0}><ArrowLeft className="mr-2 size-4" />Back</Button>{currentStep < steps.length - 1 ? <Button type="button" onClick={next} disabled={!valid()}>Next<ArrowRight className="ml-2 size-4" /></Button> : <Button type="submit" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Check className="mr-2 size-4" />}{isSubmitting ? "Sending..." : "Send request"}</Button>}</div>
        </form>
      </div>
    </main>
  );
}

function Step({ title, description, children }: { title: string; description: string; children: React.ReactNode }) { return <div><h2 className="font-[var(--font-display)] text-2xl font-semibold">{title}</h2><p className="mt-2 text-sm text-muted-foreground">{description}</p><div className="mt-8 space-y-5">{children}</div></div> }
function Field({ label, value, onChange, placeholder, type = "text", multiline = false }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; type?: string; multiline?: boolean }) { return <label className="block space-y-2"><span className="text-sm font-medium">{label}</span>{multiline ? <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="min-h-28 w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-2 focus:border-foreground" /> : <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-2 focus:border-foreground" />}</label> }
function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) { return <label className="block space-y-2"><span className="text-sm font-medium">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground"><option value="">Select an option</option>{options.map((option) => <option key={option}>{option}</option>)}</select></label> }
function ChoiceGroup({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) { return <div className="grid gap-2">{options.map((option) => <button key={option} type="button" data-selected={value === option} className={optionClass} onClick={() => onChange(option)}><span className={`mr-3 inline-block size-3 rounded-full border border-muted-foreground align-[-1px] ${value === option ? "bg-foreground ring-2 ring-foreground/20" : ""}`} />{option}</button>)}</div> }
