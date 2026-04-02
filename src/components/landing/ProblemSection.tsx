'use client'

import { useEffect, useRef, useState } from 'react'
import { animate } from 'animejs'

const DEFI_TODAY = [
  { stat: 'No Path-Dependent Products', desc: 'No autocalls, no barrier options, no observation-based payoffs' },
  { stat: 'No Programmable Payoff Logic', desc: 'Yield = LP fees and lending rates only' },
  { stat: 'No Institutional Capital Structures', desc: 'No tranching, no coupon schedules, no maturity instruments' },
]

const PHOENIX_INTRODUCES = [
  { stat: 'Autocallable Vaults on xStocks', desc: 'Worst-of baskets on Nasdaq 100 & S&P 500 with barrier protection' },
  { stat: 'Fully Onchain Settlement', desc: 'Every observation and payout executed by smart contracts' },
  { stat: 'Verified by Chainlink CRE', desc: 'Cryptographic quorum signs every price feed and barrier check' },
]

function AnimatedCounter({ target, inView }: { target: number; inView: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let frame: number
    const duration = 2000
    const start = performance.now()

    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setCount(Math.round(eased * target))
      if (t < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, target])

  return <>{count}</>
}

export function ProblemSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (!sectionRef.current) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)

          const textEls = sectionRef.current!.querySelectorAll('[data-text-anim]')
          const tradfiEls = sectionRef.current!.querySelectorAll('[data-tradfi]')
          const defiEls = sectionRef.current!.querySelectorAll('[data-defi]')
          const bridgeEl = sectionRef.current!.querySelector('[data-bridge-anim]')
          const bridgeLine = sectionRef.current!.querySelector('[data-bridge-line]')

          // Text fade-up staggered
          animate(textEls, {
            opacity: [0, 1],
            translateY: [30, 0],
            delay: (_el, i) => i * 120,
            duration: 800,
            ease: 'outQuart',
          })

          // DeFi Today slides from left
          animate(tradfiEls, {
            opacity: [0, 1],
            translateX: [-40, 0],
            delay: (_el, i) => 400 + i * 100,
            duration: 900,
            ease: 'outQuart',
          })

          // Phoenix Introduces slides from right
          animate(defiEls, {
            opacity: [0, 1],
            translateX: [40, 0],
            delay: (_el, i) => 400 + i * 100,
            duration: 900,
            ease: 'outQuart',
          })

          // Bridge line scaleX
          if (bridgeLine) {
            animate(bridgeLine, {
              scaleX: [0, 1],
              delay: 900,
              duration: 800,
              ease: 'outQuart',
            })
          }

          // Bridge text
          if (bridgeEl) {
            animate(bridgeEl, {
              opacity: [0, 1],
              scale: [0.9, 1],
              delay: 1100,
              duration: 700,
              ease: 'outBack',
            })
          }

          obs.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="opportunity" ref={sectionRef} className="scroll-mt-12 bg-transparent py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Bloc A — The Number */}
        <div className="relative text-center mb-20">
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="text-[8rem] lg:text-[12rem] font-light text-white/[0.06] leading-none">
              $200B+
            </span>
          </div>
          {/* Actual number */}
          <div className="relative pt-10">
            <p
              data-text-anim
              className="text-sm uppercase tracking-[0.2em] text-white/[0.5] mb-6 opacity-0"
            >
              The Opportunity
            </p>
            <div
              data-text-anim
              className="text-6xl lg:text-8xl font-light text-white opacity-0"
            >
              $<AnimatedCounter target={200} inView={inView} />B+
            </div>
            <p
              data-text-anim
              className="mt-12 text-lg text-white opacity-0"
            >
              in structured products issued annually. None of them exist onchain.
            </p>
          </div>
        </div>

        {/* Bloc B — Comparison */}
        <div className="grid gap-12 lg:grid-cols-2">
          {/* DeFi Today */}
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/[0.5] mb-4">DeFi Today</p>
            <div className="space-y-3">
              {DEFI_TODAY.map((item) => (
                <div
                  key={item.stat}
                  data-tradfi
                  className="border-l-2 border-l-red-500/30 bg-white/[0.03] rounded-r-xl px-6 py-4 opacity-0"
                >
                  <span className="text-base font-medium text-white">{item.stat}</span>
                  <p className="mt-1 text-sm text-white/[0.5]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Phoenix Introduces */}
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/[0.5] mb-4">Phoenix Introduces</p>
            <div className="space-y-3">
              {PHOENIX_INTRODUCES.map((item) => (
                <div
                  key={item.stat}
                  data-defi
                  className="border-l-2 border-l-emerald-500/30 bg-white/[0.03] rounded-r-xl px-6 py-4 opacity-0"
                >
                  <span className="text-base font-medium text-white">{item.stat}</span>
                  <p className="mt-1 text-sm text-white/[0.5]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bloc C — Bridge */}
        <div className="mt-16 flex flex-col items-center">
          <div
            data-bridge-line
            className="h-px w-32 origin-center bg-gradient-to-r from-transparent via-white/20 to-transparent"
            style={{ transform: 'scaleX(0)' }}
          />
          <p
            data-bridge-anim
            className="mt-6 text-xl font-light text-white opacity-0"
          >
            Phoenix brings these primitives onchain.
          </p>
        </div>
      </div>
    </section>
  )
}
