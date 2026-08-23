"use client"

import gsap from "gsap"
import { SplitText } from "gsap/SplitText"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { useRef, type ReactNode } from "react"

gsap.registerPlugin(SplitText, ScrollTrigger)

type TextBlockAnimationProps = {
  children: ReactNode
  animateOnScroll?: boolean
  delay?: number
  blockColor?: string
  stagger?: number
  duration?: number
}

export default function TextBlockAnimation({
  children,
  animateOnScroll = true,
  delay = 0,
  blockColor = "#fff",
  stagger = 0.1,
  duration = 0.6,
}: TextBlockAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!containerRef.current) return

    const split = new SplitText(containerRef.current, {
      type: "lines",
      linesClass: "block-line-parent",
    })
    const blocks: HTMLDivElement[] = []

    split.lines.forEach((line) => {
      const wrapper = document.createElement("div")
      wrapper.style.position = "relative"
      wrapper.style.display = "block"
      wrapper.style.overflow = "hidden"

      const block = document.createElement("div")
      block.style.position = "absolute"
      block.style.inset = "0"
      block.style.backgroundColor = blockColor
      block.style.zIndex = "2"
      block.style.transform = "scaleX(0)"
      block.style.transformOrigin = "left center"

      line.parentNode?.insertBefore(wrapper, line)
      wrapper.appendChild(line)
      wrapper.appendChild(block)
      gsap.set(line, { opacity: 0 })
      blocks.push(block)
    })

    const timeline = gsap.timeline({
      defaults: { ease: "expo.inOut" },
      delay,
      scrollTrigger: animateOnScroll
        ? {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          }
        : undefined,
    })

    timeline
      .to(blocks, {
        scaleX: 1,
        duration,
        stagger,
        transformOrigin: "left center",
      })
      .set(split.lines, { opacity: 1 }, `<${duration / 2}`)
      .to(
        blocks,
        {
          scaleX: 0,
          duration,
          stagger,
          transformOrigin: "right center",
        },
        `<${duration * 0.4}`,
      )
  }, { scope: containerRef, dependencies: [animateOnScroll, delay, blockColor, stagger, duration] })

  return <div ref={containerRef} className="relative">{children}</div>
}
