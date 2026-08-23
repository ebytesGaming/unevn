import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { WaitlistHero } from "@/components/ui/waitlist-hero";
import { Pricing } from "@/components/ui/pricing";
import { TestimonialsSection } from "@/components/ui/testimonial-v2";
import { TaskSteps } from "@/components/ui/task-steps";
import { Button } from "@/components/ui/button";
import TextBlockAnimation from "@/components/ui/text-block-animation";
import MultistepForm from "@/components/ui/multistep-form";

const PROJECT_STEPS = [
  { id: "brief", label: "You send the brief", meta: "Day 0" },
  { id: "draft", label: "Working draft built", meta: "Day 2" },
  { id: "revise", label: "Revisions", meta: "Day 3" },
  { id: "launch", label: "Site goes live", meta: "Day 4" },
];

function ProcessDemo() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const wait = current >= PROJECT_STEPS.length ? 2600 : 1300;
    const t = setTimeout(
      () => setCurrent((c) => (c >= PROJECT_STEPS.length ? 0 : c + 1)),
      wait,
    );
    return () => clearTimeout(t);
  }, [current]);

  return (
    <motion.div
      whileHover={{ y: -8, rotate: -1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="mx-auto w-full max-w-md rounded-xl border border-border bg-surface/80 backdrop-blur px-5 pt-4 pb-5 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.6)]"
    >
      <div className="flex items-center gap-1.5 pb-3 mb-3 border-b border-border">
        <span className="size-2 rounded-full bg-white/60" />
        <span className="size-2 rounded-full bg-white/40" />
        <span className="size-2 rounded-full bg-white/20" />
        <span className="ml-2 font-mono text-[11px] text-muted-2">
          brief → live
        </span>
      </div>
      <TaskSteps steps={PROJECT_STEPS} current={current} label="Project timeline" />
    </motion.div>
  );
}

function NavBar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.06] bg-background/65 backdrop-blur-xl supports-[backdrop-filter]:bg-background/45"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <a href="#hero" className="flex items-center gap-2 font-[var(--font-display)] text-lg font-semibold tracking-tight text-foreground">
          <img src="/logo.png" alt="Unevn Studios" className="size-6" />
          Unevn Studios
        </a>
        <nav className="hidden md:flex items-center gap-8 font-mono text-sm text-muted-foreground">
          <a href="#process" className="hover:text-foreground transition-colors">Process</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          <a href="#testimonials-heading" className="hover:text-foreground transition-colors">Clients</a>
        </nav>
        <Button size="sm" asChild>
          <a href="#pricing">Start a project</a>
        </Button>
      </div>
    </motion.header>
  );
}

function NotFound() {
  return (
    <main className="min-h-screen bg-[#101010] px-6 py-24 text-center text-foreground">
      <div className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-3xl flex-col items-center justify-center border border-white/[0.04] bg-[#0b0b0b] px-6 py-16 shadow-2xl">
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-[var(--font-display)] text-[clamp(7rem,22vw,13rem)] font-bold leading-none tracking-[-0.08em]"
        >
          404
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mt-8 space-y-3"
        >
          <h1 className="font-[var(--font-display)] text-xl font-semibold">Page not found</h1>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            The page you are looking for does not exist or has been moved.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-5">
            <Button asChild>
              <a href="/">Go home</a>
            </Button>
            <Button asChild variant="secondary">
              <a href="/#process">Browse pages</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="border-t border-border"
    >
      <div className="mx-auto max-w-6xl px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 font-[var(--font-display)] text-base font-semibold text-foreground">
          <img src="/logo.png" alt="Unevn Studios" className="size-5" />
          Unevn Studios
        </div>
        <p className="text-sm text-muted-2 font-mono text-center">
          Websites, built plainly, priced fairly — from $100 CAD.
        </p>
        <a
          href="#hero"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors font-mono"
        >
          Back to top <ArrowUpRight className="size-3.5" />
        </a>
      </div>
    </motion.footer>
  );
}

export default function App() {
  useEffect(() => {
    const disableContextMenu = (event: MouseEvent) => event.preventDefault();
    document.addEventListener("contextmenu", disableContextMenu);
    return () => document.removeEventListener("contextmenu", disableContextMenu);
  }, []);

  if (window.location.pathname === "/start-a-project") {
    return <NotFound />;
  }

  if (window.location.pathname === "/consultation") {
    return <MultistepForm />;
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <WaitlistHero />

      <motion.section
        id="process"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.14 } },
        }}
        className="relative px-6 py-24"
      >
        <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={{ hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5 text-center md:text-left"
          >
            <div className="inline-flex rounded-3xl border border-border px-4 py-1 font-mono text-xs uppercase tracking-wide text-muted-foreground">
              How it runs
            </div>
            <TextBlockAnimation blockColor="#ffffff" duration={0.7}>
              <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Brief to live site, in days
              </h2>
            </TextBlockAnimation>
            <TextBlockAnimation blockColor="#555555" stagger={0.06}>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-md mx-auto md:mx-0">
                No discovery calls, no decks. Send what the site's for, see a
                working draft within days, and get a couple of quick revision
                rounds before it goes live.
              </p>
            </TextBlockAnimation>
          </motion.div>
          <motion.div
            variants={{ hidden: { opacity: 0, x: 40, rotate: 2 }, visible: { opacity: 1, x: 0, rotate: 0 } }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <ProcessDemo />
          </motion.div>
        </div>
      </motion.section>

      <Pricing />

      <TestimonialsSection />

      <Footer />
    </div>
  );
}
