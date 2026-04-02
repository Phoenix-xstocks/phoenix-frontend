'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { animate } from 'animejs'

interface StatItem {
  label: string
  value: number
  prefix?: string
  suffix?: string
}

const STATS: StatItem[] = [
  { label: 'Perpetual Vaults', value: 19 },
  { label: 'Data Sources', value: 5 },
  { label: 'Max Coupon Rate', value: 15, suffix: '%' },
  { label: 'CRE-Verified Settlement', value: 100, suffix: '%' },
]

function AnimatedNumber({ item, inView }: { item: StatItem; inView: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let frame: number
    const duration = 1500
    const start = performance.now()

    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setCount(Math.round(eased * item.value))
      if (t < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, item.value])

  return (
    <span>
      {item.prefix}{count}{item.suffix}
    </span>
  )
}

export function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (!sectionRef.current) return
    const statEls = sectionRef.current.querySelectorAll('[data-stat]')
    const ctaEls = sectionRef.current.querySelectorAll('[data-cta-anim]')
    const btnEl = sectionRef.current.querySelector('[data-cta-btn]')
    const glowEl = sectionRef.current.querySelector('[data-glow]')

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)

          // Stats scale entrance
          animate(statEls, {
            opacity: [0, 1],
            scale: [0.9, 1],
            delay: (_el, i) => i * 100,
            duration: 700,
            ease: 'outBack',
          })

          // Glow
          if (glowEl) {
            animate(glowEl, {
              opacity: [0, 1],
              scale: [0.8, 1],
              duration: 1200,
              ease: 'outQuart',
            })
          }

          // CTA text fade-up
          animate(ctaEls, {
            opacity: [0, 1],
            translateY: [20, 0],
            delay: (_el, i) => 400 + i * 120,
            duration: 700,
            ease: 'outQuart',
          })

          // Button spring bounce
          if (btnEl) {
            animate(btnEl, {
              opacity: [0, 1],
              scale: [0.9, 1],
              delay: 700,
              duration: 800,
              ease: 'outBack',
            })
          }

          obs.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="bg-transparent py-0">
      <div className="mx-auto max-w-7xl px-6">
        {/* CTA card */}
        <div className="flex items-center justify-center px-8 py-2 text-center sm:px-16">
          <div>
            <h2
              data-cta-anim
              className="text-3xl font-light text-white sm:text-4xl opacity-0"
            >
              Start Earning Structured Yield
            </h2>
            <p
              data-cta-anim
              className="mx-auto mt-5 max-w-lg text-white/[0.5] opacity-0"
            >
              Connect your wallet and deposit into live vaults.
              No minimums, no lock-ups beyond the vault term.
            </p>
            <Link
              href="/app/deposit"
              data-cta-btn
              className="mt-8 inline-block rounded-full border border-white bg-white px-8 py-3 text-sm font-medium text-[#0a0e1a] hover:bg-gray-100 transition-all opacity-0 animate-[pulse-glow_2.5s_ease-in-out_infinite_1.5s]"
            >
              Launch App
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
