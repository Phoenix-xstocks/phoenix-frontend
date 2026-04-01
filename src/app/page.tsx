"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { HeroScene } from "@/components/hero-scene"

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
    <div ref={scrollRef} className="relative h-screen overflow-y-auto snap-y snap-mandatory">
      <div className="fixed inset-0 -z-10">
        <HeroScene scrollProgress={scrollProgress} />
      </div>

      {/* Hero */}
      <section className="h-screen snap-start snap-always relative flex flex-col">
        {/* Top bar: Docs left, Launch App right */}
        <div className="flex items-center justify-between px-8 pt-6 z-10">
          <a href="#" className="text-[8px] uppercase tracking-widest text-white/70 hover:text-white transition-colors">
            Docs
          </a>
          <Link
            href="/app/deposit"
            className="px-5 py-2 rounded-lg font-medium text-[8px] bg-white text-black hover:bg-white/90 transition-all"
          >
            Launch App
          </Link>
        </div>

        {/* Title centered at top */}
        <div className="flex-1 flex flex-col items-center justify-start pt-10 md:pt-14 z-10">
          <FadeSlide show={true} direction="up" delay={0}>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight text-center drop-shadow-lg text-white">
              Phoenix
            </h1>
          </FadeSlide>
          <FadeSlide show={true} direction="up" delay={100}>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight text-center drop-shadow-lg text-white -mt-2">
              Protocol
            </h1>
          </FadeSlide>
        </div>

        {/* Subtitle at bottom */}
        <div className="pb-6 text-center z-10">
          <FadeSlide show={true} direction="up" delay={300}>
            <p className="text-[9px] md:text-xs text-muted-foreground drop-shadow-md">
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

      {/* The Opportunity */}
      <Section>
        {(visible) => (
          <FadeSlide show={visible} direction="up">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight drop-shadow-lg">
              The Opportunity
            </h2>
          </FadeSlide>
        )}
      </Section>

      {/* What is an Autocall? */}
      <Section>
        {(visible) => (
          <div className="max-w-3xl w-full space-y-6">
            <FadeSlide show={visible} direction="up">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight drop-shadow-lg">
                What is an Autocall?
              </h2>
            </FadeSlide>
            <FadeSlide show={visible} direction="up" delay={150}>
              <p className="text-[10px] md:text-xs text-muted-foreground leading-relaxed drop-shadow-md">
                An autocall is a structured product that pays a fixed coupon as long as
                the underlying assets stay above a predefined barrier. If all assets
                trade above the autocall level on an observation date, the product
                &ldquo;auto-calls&rdquo; -- it redeems early and returns your principal
                plus the accrued coupon.
              </p>
            </FadeSlide>
            <FadeSlide show={visible} direction="up" delay={300}>
              <p className="text-[10px] md:text-xs text-muted-foreground leading-relaxed drop-shadow-md">
                Think of it as a conditional yield strategy: you earn high APY in
                exchange for taking on limited downside risk tied to the performance of
                the basket.
              </p>
            </FadeSlide>
          </div>
        )}
      </Section>

      {/* Worst-of Basket */}
      <Section>
        {(visible) => (
          <div className="max-w-3xl w-full space-y-6">
            <FadeSlide show={visible} direction="up">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight drop-shadow-lg">
                Worst-of Basket
              </h2>
            </FadeSlide>
            <FadeSlide show={visible} direction="up" delay={150}>
              <p className="text-[10px] md:text-xs text-muted-foreground leading-relaxed drop-shadow-md">
                The &ldquo;worst-of&rdquo; mechanism means the product&apos;s payoff depends on
                the worst-performing asset in the basket. This concentrates risk on a
                single underperformer rather than the average, which is why the yield is
                higher than single-asset strategies.
              </p>
            </FadeSlide>
            <FadeSlide show={visible} direction="up" delay={300}>
              <p className="text-[10px] md:text-xs text-muted-foreground leading-relaxed drop-shadow-md">
                Phoenix&apos;s flagship basket tracks 2 tokenized indices (Nasdaq 100 &amp; S&amp;P 500). As long as none
                of them drops below the knock-in barrier (typically 60-70% of the
                initial price), your principal is fully protected.
              </p>
            </FadeSlide>
          </div>
        )}
      </Section>

      {/* Delta-Neutral Hedging */}
      <Section>
        {(visible) => (
          <div className="max-w-3xl w-full space-y-6">
            <FadeSlide show={visible} direction="up">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight drop-shadow-lg">
                Delta-Neutral Hedging
              </h2>
            </FadeSlide>
            <FadeSlide show={visible} direction="up" delay={150}>
              <p className="text-[10px] md:text-xs text-muted-foreground leading-relaxed drop-shadow-md">
                Delta-neutral means the protocol continuously offsets its directional
                exposure to each asset. When the price of an underlying moves, the
                hedging engine rebalances so that the protocol&apos;s P&L is driven by
                volatility and time decay -- not by whether markets go up or down.
              </p>
            </FadeSlide>
            <FadeSlide show={visible} direction="up" delay={300}>
              <p className="text-[10px] md:text-xs text-muted-foreground leading-relaxed drop-shadow-md">
                This is how Phoenix generates yield even in sideways or moderately
                declining markets: the premium collected from selling structured
                exposure funds the coupon, while hedging limits the protocol&apos;s risk.
              </p>
            </FadeSlide>
          </div>
        )}
      </Section>

      {/* Real-Time Coupon Streaming */}
      <Section>
        {(visible) => (
          <div className="max-w-3xl w-full space-y-6">
            <FadeSlide show={visible} direction="up">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight drop-shadow-lg">
                Real-Time Coupon Streaming
              </h2>
            </FadeSlide>
            <FadeSlide show={visible} direction="up" delay={150}>
              <p className="text-[10px] md:text-xs text-muted-foreground leading-relaxed drop-shadow-md">
                Unlike traditional structured products that pay coupons quarterly or at
                maturity, Phoenix streams yield directly to your wallet in real time.
                Every block, your accrued USDC coupon grows -- no lockups, no waiting
                for observation dates.
              </p>
            </FadeSlide>
            <FadeSlide show={visible} direction="up" delay={300}>
              <p className="text-[10px] md:text-xs text-muted-foreground leading-relaxed drop-shadow-md">
                You can monitor your earnings live on the dashboard and withdraw
                accrued coupons at any time. This is DeFi-native structured finance:
                transparent, composable, and always accessible.
              </p>
            </FadeSlide>
          </div>
        )}
      </Section>

      {/* Structured for Every Scenario */}
      <Section>
        {(visible) => (
          <div className="max-w-3xl w-full space-y-6 text-center">
            <FadeSlide show={visible} direction="up">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight drop-shadow-lg">
                Structured for Every Scenario.
              </h2>
            </FadeSlide>
            <FadeSlide show={visible} direction="up" delay={150}>
              <p className="text-[10px] md:text-xs text-muted-foreground leading-relaxed drop-shadow-md">
                See how your capital performs in bull,
                bear, and worst-case scenarios.
              </p>
            </FadeSlide>
          </div>
        )}
      </Section>

      {/* FAQ */}
      <Section>
        {(visible) => (
          <FadeSlide show={visible} direction="up">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight drop-shadow-lg">
              FAQ
            </h2>
          </FadeSlide>
        )}
      </Section>

      {/* Footer */}
      <section className="h-screen snap-start snap-always relative flex flex-col justify-center px-8 md:px-16 overflow-hidden">
        {/* Footer content */}
        <div className="flex flex-col md:flex-row gap-14 z-10 mb-16 md:pl-[22%]">
          {/* Left: logo + description */}
          <div className="md:w-[45%] shrink-0 space-y-4">
            <div className="flex items-center gap-3">
              <Image src="/phoenix.svg" alt="Phoenix" width={28} height={28} className="opacity-80" />
              <span className="text-base font-bold text-white">Phoenix</span>
            </div>
            <p className="text-[9px] text-white/40 leading-relaxed">
              Phoenix Protocol is a decentralized structured yield protocol built on Ethereum. It brings institutional-grade autocallable products onchain with trustless settlement via Chainlink CRE, offering two-sided perpetual vaults with coupon payoffs and barrier-based risk management.
            </p>
          </div>

          {/* Right: link columns */}
          <div className="grid grid-cols-3 gap-8 md:gap-12 flex-1 md:pl-[5%]">
            <div>
              <h4 className="text-xs font-bold text-white mb-4">Resources</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-[10px] text-white/40 hover:text-white/70 transition-colors">Product</a></li>
                <li><a href="#" className="text-[10px] text-white/40 hover:text-white/70 transition-colors">Scenarios</a></li>
                <li><a href="#" className="text-[10px] text-white/40 hover:text-white/70 transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white mb-4">Ecosystem</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-[10px] text-white/40 hover:text-white/70 transition-colors">Ink</a></li>
                <li><a href="#" className="text-[10px] text-white/40 hover:text-white/70 transition-colors">Chainlink</a></li>
                <li><a href="#" className="text-[10px] text-white/40 hover:text-white/70 transition-colors">Tydro</a></li>
                <li><a href="#" className="text-[10px] text-white/40 hover:text-white/70 transition-colors">Euler</a></li>
                <li><a href="#" className="text-[10px] text-white/40 hover:text-white/70 transition-colors">Nado</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-[10px] text-white/40 hover:text-white/70 transition-colors">Privacy</a></li>
                <li><a href="#" className="text-[10px] text-white/40 hover:text-white/70 transition-colors">Terms</a></li>
                <li><a href="#" className="text-[10px] text-white/40 hover:text-white/70 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* PHOENIX watermark */}
        <span
          className="absolute bottom-0 left-1/2 -translate-x-1/2 select-none pointer-events-none font-bold text-white/[0.1] text-[6rem] md:text-[10rem] lg:text-[15rem] leading-none tracking-tight translate-y-[10%] whitespace-nowrap"
          style={{ maskImage: 'linear-gradient(to bottom, white 30%, transparent 90%)', WebkitMaskImage: 'linear-gradient(to bottom, white 30%, transparent 90%)' }}
        >
          PHOENIX
        </span>
      </section>

    </div>
  )
}
