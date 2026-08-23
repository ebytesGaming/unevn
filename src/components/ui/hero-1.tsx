"use client"

import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform } from "framer-motion"

interface HeroProps {
  eyebrow?: string
  title: string
  subtitle: string
  ctaLabel?: string
  ctaHref?: string
}

export function Hero({
  eyebrow = "Innovate Without Limits",
  title,
  subtitle,
  ctaLabel = "Explore Now",
  ctaHref = "#",
}: HeroProps) {
  const { scrollY } = useScroll()
  const gridY = useTransform(scrollY, [0, 900], [0, 180])
  const accentY = useTransform(scrollY, [0, 900], [0, -100])

  return (
    <motion.section
      id="hero"
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.16, delayChildren: 0.2 } } }}
      className="relative mx-auto w-full pt-40 px-6 text-center md:px-8 
      min-h-[calc(100vh-40px)] overflow-hidden 
      bg-[linear-gradient(to_bottom,#fff,#ffffff_50%,#e8e8e8_88%)]  
      dark:bg-[linear-gradient(to_bottom,#0A0A0A,#0A0A0A_35%,#1B1B1B_82%,#0A0A0A_100%)] 
      rounded-b-xl"
    >
      {/* Grid BG */}
      <motion.div
        style={{ y: gridY }}
        animate={{ opacity: [0.35, 0.65, 0.35], scale: [1, 1.04, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -z-10 inset-0 opacity-80 h-[600px] w-full animate-[grid-drift_18s_linear_infinite]
        bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] 
        dark:bg-[linear-gradient(to_right,#1E1E1E_1px,transparent_1px),linear-gradient(to_bottom,#1E1E1E_1px,transparent_1px)]
        bg-[size:6rem_5rem] 
        [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"
      />

      {/* Radial Accent */}
      <motion.div
        style={{ y: accentY }}
        animate={{ opacity: [0.92, 1, 0.92], scale: [1, 1.015, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-[calc(100%-90px)] lg:top-[calc(100%-150px)] 
        h-[500px] w-[700px] md:h-[500px] md:w-[1100px] lg:h-[750px] lg:w-[140%] 
        -translate-x-1/2 rounded-[100%] border border-white/10 
        bg-[radial-gradient(ellipse_at_center,#0A0A0A_48%,#121212_60%,#282828_70%,#666666_82%,#D8D8D8_94%,#FFFFFF_100%)] 
        animate-fade-up"
      />

      {/* Eyebrow */}
      {eyebrow && (
        <motion.a variants={{ hidden: { opacity: 0, y: -16 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.7 }} href="#process" className="group">
          <span
            className="text-sm text-gray-600 dark:text-[#9A9994] font-mono mx-auto px-5 py-2 
            bg-gradient-to-tr from-zinc-300/5 via-gray-400/5 to-transparent  
            border-[2px] border-gray-300/20 dark:border-white/20 
            rounded-3xl w-fit tracking-tight uppercase flex items-center justify-center"
          >
            {eyebrow}
            <ChevronRight className="inline w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </motion.a>
      )}

      {/* Title */}
      <motion.h1
        variants={{ hidden: { opacity: 0, y: 28, filter: "blur(12px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)" } }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-4xl text-balance font-[var(--font-display)]
        bg-gradient-to-br from-black from-30% to-black/40 
        bg-clip-text py-6 text-5xl font-semibold leading-[0.94] tracking-tighter 
        text-transparent opacity-0 sm:text-6xl md:text-7xl lg:text-8xl 
        dark:from-white dark:to-white/40"
      >
        {title}
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12 text-balance 
        text-lg tracking-tight text-gray-600 dark:text-[#9A9994] 
        opacity-0 md:text-xl max-w-2xl mx-auto"
      >
        {subtitle}
      </motion.p>

      {/* CTA */}
      {ctaLabel && (
        <motion.div
          variants={{ hidden: { opacity: 0, y: 20, scale: 0.94 }, visible: { opacity: 1, y: 0, scale: 1 } }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center"
        >
          <Button
            asChild
            className="mt-[-20px] w-fit rounded-full px-7 md:w-52 z-20 font-mono tracking-tight text-center text-base"
          >
            <a href={ctaHref}>{ctaLabel}</a>
          </Button>
        </motion.div>
      )}

      {/* Bottom Fade */}
      <motion.div
        animate={{ opacity: [0.35, 0.8, 0.35] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="animate-fade-up relative mt-32 opacity-0 [perspective:2000px] 
        after:absolute after:inset-0 after:z-50 
        after:[background:linear-gradient(to_top,hsl(var(--background))_10%,transparent)]"
      />
    </motion.section>
  )
}
