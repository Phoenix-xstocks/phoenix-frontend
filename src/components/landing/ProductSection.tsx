'use client'

import { useEffect, useRef } from 'react'
import { animate } from 'animejs'

const PILLARS = [
  {
    title: 'Enhanced Yield',
    description:
      'Earn above-market coupon rates through autocallable structured products, with payouts every observation period.',
  },
  {
    title: 'Capital Protection',
    description:
      'Knock-in barriers protect your capital from downside. You only face losses if the underlying drops below the barrier at maturity.',
  },
  {
    title: 'Two-Sided Vaults',
    description:
      'Side A deposits the underlying asset and earns USDC coupons. Side B deposits USDC and profits from knock-in events. Balanced risk-reward.',
  },
]

const VAULT_PARAMS = [
  { label: 'Coupon Rate', value: '~1.7%', sub: 'per observation' },
  { label: 'Autocall Barrier', value: '100%', sub: 'steps down 2%/obs' },
  { label: 'Knock-in Barrier', value: '70%', sub: 'at maturity' },
  { label: 'Maturity', value: '6', sub: 'months · 6 obs' },
]

/* kept for later
const STEPS = [
  { number: '01', title: 'Choose', description: 'Pick a vault matching your risk and yield targets.' },
  { number: '02', title: 'Deposit', description: 'Deposit USDC during the subscription window.' },
  { number: '03', title: 'Earn Coupons', description: 'Receive yield at every observation period.' },
  { number: '04', title: 'Settle & Withdraw', description: 'Get your capital + coupons at maturity or autocall.' },
] */


export function ProductSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const textEls = sectionRef.current.querySelectorAll('[data-product-text]')
    const pillarEls = sectionRef.current.querySelectorAll('[data-pillar]')
    const stepEls = sectionRef.current.querySelectorAll('[data-step]')
    const lineEls = sectionRef.current.querySelectorAll('[data-line]')

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Text fade-up
          animate(textEls, {
            opacity: [0, 1],
            translateY: [30, 0],
            delay: (_el, i) => i * 120,
            duration: 800,
            ease: 'outQuart',
          })

          // Pillars spring scale-in
          animate(pillarEls, {
            opacity: [0, 1],
            scale: [0.9, 1],
            delay: (_el, i) => 400 + i * 150,
            duration: 800,
            ease: 'outBack',
          })

          obs.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    obs.observe(sectionRef.current)

    // Vault card observer
    let obs2: IntersectionObserver | undefined
    const vaultCard = sectionRef.current.querySelector('[data-vault-card]')
    if (vaultCard) {
      obs2 = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            animate(vaultCard, {
              opacity: [0, 1],
              scale: [0.95, 1],
              duration: 800,
              ease: 'outBack',
            })

            const paramEls = sectionRef.current!.querySelectorAll('[data-vault-param]')
            animate(paramEls, {
              opacity: [0, 1],
              translateY: [10, 0],
              delay: (_el, i) => 300 + i * 80,
              duration: 600,
              ease: 'outQuart',
            })

            const chartEl = sectionRef.current!.querySelector('[data-payoff-chart]')
            if (chartEl) {
              animate(chartEl, {
                opacity: [0, 1],
                delay: 600,
                duration: 800,
                ease: 'outQuart',
              })
            }

            const microEls = sectionRef.current!.querySelectorAll('[data-micro]')
            animate(microEls, {
              opacity: [0, 1],
              translateY: [10, 0],
              delay: (_el, i) => 500 + i * 100,
              duration: 600,
              ease: 'outQuart',
            })

            obs2!.disconnect()
          }
        },
        { threshold: 0.3 },
      )
      obs2.observe(vaultCard)
    }

    // Steps observer
    let obs3: IntersectionObserver | undefined
    const stepsContainer = sectionRef.current.querySelector('[data-steps-container]')
    if (stepsContainer) {
      obs3 = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            animate(stepEls, {
              opacity: [0, 1],
              translateY: [20, 0],
              delay: (_el, i) => i * 180,
              duration: 700,
              ease: 'outQuart',
            })

            animate(lineEls, {
              scaleX: [0, 1],
              delay: (_el, i) => 200 + i * 180,
              duration: 600,
              ease: 'outQuart',
            })

            obs3!.disconnect()
          }
        },
        { threshold: 0.3 },
      )
      obs3.observe(stepsContainer)
    }

    return () => {
      obs.disconnect()
      obs2?.disconnect()
      obs3?.disconnect()
    }
  }, [])

  return (
    <section id="product" ref={sectionRef} className="scroll-mt-12 bg-transparent pt-0 pb-4">
      <div className="mx-auto max-w-7xl px-6">
        {/* Sub-block A: Identity */}
        <div className="max-w-2xl">
          <p
            data-product-text
            className="text-sm uppercase tracking-[0.2em] text-white/[0.5] opacity-0"
          >
            The Product
          </p>
          <h2
            data-product-text
            className="mt-4 text-3xl font-light text-white sm:text-4xl lg:text-5xl opacity-0"
          >
            Autocallable Vaults
          </h2>
          <p
            data-product-text
            className="mt-6 text-white/[0.5] leading-relaxed opacity-0"
          >
            Autocallables are structured financial products used by institutions
            worldwide. Phoenix brings them onchain — fully transparent,
            permissionless, and settled by smart contracts. Deposit USDC, earn
            periodic coupons, and benefit from built-in capital protection.
          </p>
        </div>

        {/* Sub-block B: 3 Pillars */}
        <div className="mt-16 grid gap-px rounded-2xl overflow-hidden md:grid-cols-3">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              data-pillar
              className="bg-white/[0.03] p-10 opacity-0 transition-colors hover:bg-white/[0.06]"
            >
              <h3 className="text-lg font-medium text-white">{pillar.title}</h3>
              <p className="mt-3 text-sm text-white/[0.5] leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

        {/* Sub-block B.5: Vault Preview */}
        <div className="mt-12 sm:mt-30" data-vault-card>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-light text-white mb-6">
            How It Works
          </h2>

          <video
            autoPlay
            muted
            playsInline
            className="w-full max-w-5xl h-auto rounded-xl mx-auto"
            ref={(el) => {
              if (!el) return
              el.play().catch(() => {})
            }}
          >
            <source src="/AutocallPayoffV4.mp4" type="video/mp4" />
          </video>

          <div className="flex items-center gap-5 mt-4">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
              <span className="text-sm text-gray-300">Loss Zone</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-gray-400/60" />
              <span className="text-sm text-gray-300">Protected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
              <span className="text-sm text-gray-300">Coupons</span>
            </div>
          </div>

          {/* Params row */}
          <div className="mt-6 sm:mt-10 ml-0 sm:ml-36 grid grid-cols-2 gap-y-5 gap-x-4 sm:gap-y-8 sm:gap-x-12 sm:grid-cols-4">
            {VAULT_PARAMS.map((param) => (
              <div
                key={param.label}
                data-vault-param
                className="border-l-2 border-white/10 pl-3 sm:pl-5 opacity-0"
              >
                <div className="text-2xl sm:text-5xl font-light text-white tracking-tight">{param.value}</div>
                <div className="text-[10px] sm:text-sm uppercase tracking-wider text-white/[0.5] mt-1 sm:mt-2">{param.label}</div>
              </div>
            ))}
          </div>

        </div>

        {/* Sub-block C: 4 Steps — hidden, kept for later */}
        {/* <div data-steps-container className="mt-20">
          <h3 data-product-text className="text-xl font-light text-white mb-12 opacity-0">How It Works</h3>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, idx) => (
              <div key={step.number} className="relative">
                <div data-step className="opacity-0">
                  <div className="text-sm font-medium text-white/[0.5]">{step.number}</div>
                  <h4 className="mt-3 text-lg font-medium text-white">{step.title}</h4>
                  <p className="mt-2 text-sm text-white/[0.5] leading-relaxed">{step.description}</p>
                </div>
                {idx < STEPS.length - 1 && (
                  <div data-line className="absolute top-6 left-full hidden h-px w-8 origin-left bg-white/10 lg:block" style={{ transform: 'scaleX(0)' }} />
                )}
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </section>
  )
}
