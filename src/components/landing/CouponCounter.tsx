"use client"

import { useEffect, useRef, useState } from "react"

const DEPOSIT = 10_000
const APY = 0.12
const RATE_PER_SEC = (DEPOSIT * APY) / (365.25 * 24 * 3600)
const COUPON_PERIOD_DAYS = 7
const COUPON_PERIOD_SEC = COUPON_PERIOD_DAYS * 24 * 3600
const INITIAL_ACCRUED = 1_247.834521

function formatUSDC(value: number): string {
  const [int, dec] = value.toFixed(6).split(".")
  const intFormatted = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return `$${intFormatted}.${dec}`
}

function formatCountdown(totalSeconds: number): string {
  const d = Math.floor(totalSeconds / 86400)
  const h = Math.floor((totalSeconds % 86400) / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  if (d > 0) return `${d}d ${h}h ${m}m`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export function CouponCounter({ visible }: { visible: boolean }) {
  const [accrued, setAccrued] = useState(INITIAL_ACCRUED)
  const [elapsed, setElapsed] = useState(0)
  const startTime = useRef<number | null>(null)
  const rafId = useRef<number>(0)

  useEffect(() => {
    if (!visible) return

    const tick = (now: number) => {
      if (startTime.current === null) startTime.current = now
      const dt = (now - startTime.current) / 1000
      setAccrued(INITIAL_ACCRUED + dt * RATE_PER_SEC)
      setElapsed(dt)
      rafId.current = requestAnimationFrame(tick)
    }

    rafId.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId.current)
  }, [visible])

  const periodElapsedSec = (3.4 * 86400 + elapsed) % COUPON_PERIOD_SEC
  const progressPct = (periodElapsedSec / COUPON_PERIOD_SEC) * 100
  const remainingSec = COUPON_PERIOD_SEC - periodElapsedSec

  return (
    <div className="w-full max-w-sm mx-auto space-y-4">
      <div className="text-center">
        <p
          className="text-2xl md:text-3xl font-bold tracking-tight text-white drop-shadow-lg"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {formatUSDC(accrued)}
        </p>
        <p className="text-[10px] text-muted-foreground mt-1">accrued yield</p>
      </div>

      <div className="space-y-2">
        <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-accent transition-none"
            style={{ width: `${Math.min(progressPct, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>{progressPct.toFixed(0)}%</span>
          <span>next coupon in {formatCountdown(remainingSec)}</span>
        </div>
      </div>
    </div>
  )
}
