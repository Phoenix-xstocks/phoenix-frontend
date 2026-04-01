"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { HeroScene } from "@/components/hero-scene"
import dynamic from "next/dynamic"

const ProblemSection = dynamic(() => import("@/components/landing/ProblemSection").then(m => ({ default: m.ProblemSection })), { ssr: false })
const ProductSection = dynamic(() => import("@/components/landing/ProductSection").then(m => ({ default: m.ProductSection })), { ssr: false })
const LandingFeatures = dynamic(() => import("@/components/landing/LandingFeatures").then(m => ({ default: m.LandingFeatures })), { ssr: false })
const LandingFaq = dynamic(() => import("@/components/landing/LandingFaq").then(m => ({ default: m.LandingFaq })), { ssr: false })
const CTASection = dynamic(() => import("@/components/landing/CTASection").then(m => ({ default: m.CTASection })), { ssr: false })

function useInView(ref: React.RefObject<HTMLElement | null>, threshold = 0.3) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, threshold])

  return visible
}

function FadeSlide({
  children,
  show,
  direction = "up",
  delay = 0,
}: {
  children: React.ReactNode
  show: boolean
  direction?: "up" | "left" | "right"
  delay?: number
}) {
  const translateMap = {
    up: "translate-y-8",
    left: "-translate-x-8",
    right: "translate-x-8",
  }

  return (
    <div
      className={`transition-all duration-700 ease-out ${
        show
          ? "opacity-100 translate-x-0 translate-y-0"
          : `opacity-0 ${translateMap[direction]}`
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

function Section({
  children,
  className = "",
}: {
  children: (visible: boolean) => React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref)

  return (
    <section
      ref={ref}
      className={`h-screen snap-start snap-always flex items-center justify-center px-4 ${className}`}
    >
      {children(visible)}
    </section>
  )
}

export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const maxScroll = el.scrollHeight - el.clientHeight
    const norm = maxScroll > 0 ? el.scrollTop / maxScroll : 0
    setScrollProgress(Math.min(norm, 1))
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener("scroll", handleScroll, { passive: true })
    return () => el.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  return (
    <div ref={scrollRef} className="relative h-screen overflow-y-auto">
      <div className="fixed inset-0 -z-10">
        <HeroScene scrollProgress={scrollProgress} />
      </div>

      {/* Launch App button – top-right, fades out on scroll */}
      <Link
        href="/app/deposit"
        className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium text-white border border-white/20 backdrop-blur-sm hover:bg-white/10 transition-all duration-500 ${
          scrollProgress > 0 ? "opacity-0 -translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"
        }`}
      >
        Launch App
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </Link>

      {/* Hero */}
      <section className="h-screen snap-start snap-always relative flex flex-col">
        {/* Top bar: Docs left */}
        <div className="flex items-center justify-between px-8 pt-6 z-10">
          <a href="#" className="text-sm uppercase tracking-widest text-white/70 hover:text-white transition-colors">
            Docs
          </a>
        </div>

        {/* Title centered at top */}
        <div className="flex-1 flex flex-col items-center justify-start pt-8 md:pt-12 z-10">
          <FadeSlide show={true} direction="up" delay={0}>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-medium tracking-tight text-center drop-shadow-lg text-white">
              Phoenix Protocol
            </h1>
          </FadeSlide>
        </div>

        {/* Subtitle at bottom */}
        <div className="pb-6 text-center z-10">
          <FadeSlide show={true} direction="up" delay={300}>
            <p className="text-sm md:text-base text-muted-foreground drop-shadow-md">
              Autocall Structured Products on Ink
            </p>
          </FadeSlide>
          <FadeSlide show={true} direction="up" delay={400}>
            <div className="mt-6 flex justify-center">
              <div className="w-6 h-10 rounded-full border-2 border-white/60 flex justify-center">
                <div className="w-1 h-2 rounded-full bg-white mt-2 animate-[scrollDown_1.5s_ease-in-out_infinite]" />
              </div>
            </div>
          </FadeSlide>
        </div>
      </section>

      {/* The Opportunity — exact component from /frontend */}
      <div className="snap-start snap-always" style={{ background: 'transparent' }}>
        <ProblemSection />
      </div>

      {/* The Product — exact component from /frontend */}
      <div className="snap-start snap-always" style={{ background: 'transparent' }}>
        <ProductSection />
      </div>

      {/* Structured for Every Scenario — exact component from /frontend */}
      <div className="snap-start snap-always" style={{ background: 'transparent' }}>
        <LandingFeatures />
      </div>

      {/* FAQ — exact component from /frontend */}
      <div className="snap-start snap-always" style={{ background: 'transparent' }}>
        <LandingFaq />
      </div>

      {/* CTA — exact component from /frontend */}
      <div className="snap-start snap-always" style={{ background: 'transparent' }}>
        <CTASection />
      </div>

      {/* Footer */}
      <section className="h-screen snap-start snap-always relative flex flex-col justify-center px-8 md:px-16 overflow-hidden">
        {/* Footer content */}
        <div className="flex flex-col md:flex-row gap-14 z-10 mb-16 md:pl-[22%]">
          {/* Left: logo + description */}
          <div className="md:w-[45%] shrink-0 space-y-4">
            <div className="flex items-center gap-3">
              <Image src="/phoenix.svg" alt="Phoenix" width={28} height={28} className="opacity-80" />
              <span className="text-xl font-bold text-white">Phoenix</span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed">
              Phoenix Protocol is a decentralized structured yield protocol built on Ethereum. It brings institutional-grade autocallable products onchain with trustless settlement via Chainlink CRE, offering two-sided perpetual vaults with coupon payoffs and barrier-based risk management.
            </p>
          </div>

          {/* Right: link columns */}
          <div className="grid grid-cols-3 gap-8 md:gap-12 flex-1 md:pl-[5%]">
            <div>
              <h4 className="text-base font-bold text-white mb-4">Resources</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-sm text-white/40 hover:text-white/70 transition-colors">Product</a></li>
                <li><a href="#" className="text-sm text-white/40 hover:text-white/70 transition-colors">Scenarios</a></li>
                <li><a href="#" className="text-sm text-white/40 hover:text-white/70 transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-base font-bold text-white mb-4">Ecosystem</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-sm text-white/40 hover:text-white/70 transition-colors">Ink</a></li>
                <li><a href="#" className="text-sm text-white/40 hover:text-white/70 transition-colors">Chainlink</a></li>
                <li><a href="#" className="text-sm text-white/40 hover:text-white/70 transition-colors">Tydro</a></li>
                <li><a href="#" className="text-sm text-white/40 hover:text-white/70 transition-colors">Euler</a></li>
                <li><a href="#" className="text-sm text-white/40 hover:text-white/70 transition-colors">Nado</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-base font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-sm text-white/40 hover:text-white/70 transition-colors">Privacy</a></li>
                <li><a href="#" className="text-sm text-white/40 hover:text-white/70 transition-colors">Terms</a></li>
                <li><a href="#" className="text-sm text-white/40 hover:text-white/70 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* PHOENIX watermark */}
        <span
          className="absolute bottom-0 left-1/2 -translate-x-1/2 select-none pointer-events-none font-bold text-white/[0.1] text-[9rem] md:text-[16rem] lg:text-[23rem] leading-none tracking-tight translate-y-[10%] whitespace-nowrap"
          style={{ maskImage: 'linear-gradient(to bottom, white 30%, transparent 90%)', WebkitMaskImage: 'linear-gradient(to bottom, white 30%, transparent 90%)' }}
        >
          PHOENIX
        </span>
      </section>

    </div>
  )
}
