"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Link from "next/link"
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
      <Section className="pt-16">
        {() => (
          <div className="max-w-2xl text-center space-y-8">
            <FadeSlide show={true} direction="up">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-center drop-shadow-lg">
                Phoenix Protocol
              </h1>
            </FadeSlide>
            <FadeSlide show={true} direction="up" delay={200}>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed drop-shadow-md">
                Permissionless autocall structured products on Ink.
                Earn 8.5-13% APY on a worst-of basket of tokenized equities
                with delta-neutral hedging and real-time coupon streaming.
              </p>
            </FadeSlide>
            <FadeSlide show={true} direction="up" delay={400}>
              <div className="flex gap-4 justify-center pt-4">
                <Link
                  href="/deposit"
                  className="px-6 py-2.5 rounded-lg font-medium text-xs bg-white text-black hover:bg-white/90 transition-all"
                >
                  Deposit USDC
                </Link>
                <Link
                  href="/dashboard"
                  className="px-6 py-2.5 rounded-lg font-medium text-xs border border-white/20 hover:bg-white/10 backdrop-blur-sm transition-all"
                >
                  Dashboard
                </Link>
              </div>
            </FadeSlide>
            <FadeSlide show={true} direction="up" delay={600}>
              <div className="grid grid-cols-3 gap-8 w-full">
                <div className="backdrop-blur-sm rounded-lg p-6 text-center">
                  <p className="text-lg font-bold">8.5-13%</p>
                  <p className="text-muted-foreground mt-2 text-[10px]">Target APY</p>
                </div>
                <div className="backdrop-blur-sm rounded-lg p-6 text-center">
                  <p className="text-lg font-bold">6 months</p>
                  <p className="text-muted-foreground mt-2 text-[10px]">Maturity</p>
                </div>
                <div className="backdrop-blur-sm rounded-lg p-6 text-center">
                  <p className="text-lg font-bold">3 assets</p>
                  <p className="text-muted-foreground mt-2 text-[10px]">Flagship basket</p>
                </div>
              </div>
            </FadeSlide>
          </div>
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
                Phoenix&apos;s flagship basket tracks 3 tokenized equities. As long as none
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

      {/* Footer */}
      <section className="h-screen snap-start snap-always relative overflow-hidden flex items-end justify-center">
        <span className="select-none pointer-events-none font-bold text-white/[0.04] text-[8rem] md:text-[16rem] lg:text-[20rem] leading-none tracking-tight translate-y-[25%] whitespace-nowrap">
          PHOENIX
        </span>
      </section>

    </div>
  )
}
