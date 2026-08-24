"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function WaitlistHero() {
  const title = "Welcome to Unevn"
  const subtitle = "A one-person studio building sharp, memorable websites for small businesses and side projects. No agency markup. No bloated process."
  const { scrollY } = useScroll()
  const ringY = useTransform(scrollY, [0, 900], [0, -120])
  const ringRotate = useTransform(scrollY, [0, 900], [0, 18])

  return (
    <section id="hero" className="relative isolate min-h-screen overflow-hidden bg-[#09090b] px-6 text-white">
      <style>{`
        @keyframes unevn-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes unevn-spin-reverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        .unevn-spin { animation: unevn-spin 60s linear infinite; }
        .unevn-spin-reverse { animation: unevn-spin-reverse 60s linear infinite; }
      `}</style>
      <motion.div
        aria-hidden="true"
        style={{ y: ringY, rotate: ringRotate }}
        className="pointer-events-none absolute inset-0 [perspective:1200px]"
      >
          <div className="unevn-spin absolute inset-0 opacity-30">
          <img
            src="https://framerusercontent.com/images/oqZEqzDEgSLygmUDuZAYNh2XQ9U.png?scale-down-to=2048"
            alt=""
            className="absolute left-1/2 top-1/2 size-[min(110vw,1200px)] -translate-x-1/2 -translate-y-1/2 object-cover"
          />
        </div>
        <div className="unevn-spin-reverse absolute inset-0 opacity-30">
          <img
            src="https://framerusercontent.com/images/UbucGYsHDAUHfaGZNjwyCzViw8.png?scale-down-to=1024"
            alt=""
            className="absolute left-1/2 top-1/2 size-[min(76vw,820px)] -translate-x-1/2 -translate-y-1/2 object-cover"
          />
        </div>
        <div className="unevn-spin absolute inset-0 opacity-35">
          <img
            src="https://framerusercontent.com/images/Ans5PAxtJfg3CwxlrPMSshx2Pqc.png"
            alt=""
            className="absolute left-1/2 top-1/2 size-[min(56vw,620px)] -translate-x-1/2 -translate-y-1/2 object-cover"
          />
        </div>
      </motion.div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(255,255,255,0.1),transparent_36%),linear-gradient(to_top,#09090b_8%,rgba(9,9,11,0.2)_58%,transparent)]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-end pb-32 pt-32 text-center md:pb-40">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] text-white/60 backdrop-blur-md"
        >
          Unevn Studios
          <span className="size-1.5 rounded-full bg-white shadow-[0_0_10px_white]" />
          Now booking
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 45, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl bg-gradient-to-b from-white via-white to-white/50 bg-clip-text font-[var(--font-display)] text-5xl font-semibold leading-[0.92] tracking-[-0.07em] text-transparent sm:text-7xl md:text-8xl"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 max-w-xl text-base leading-relaxed text-white/55 md:text-lg"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-9"
        >
          <Button asChild className="h-12 rounded-full px-8 font-mono text-sm shadow-[0_0_35px_rgba(255,255,255,0.12)]">
            <a href="/login" className="group">
              Sign in
              <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </Button>
        </motion.div>

        <motion.div
          animate={{ opacity: [0.25, 0.75, 0.25], scaleX: [0.8, 1, 0.8] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="mt-16 h-px w-48 bg-gradient-to-r from-transparent via-white to-transparent"
        />
      </div>
    </section>
  )
}
