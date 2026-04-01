"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HeroScene } from "@/components/hero-scene"

function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  const handleScroll = useCallback(() => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    const norm = maxScroll > 0 ? window.scrollY / maxScroll : 0
    setProgress(Math.min(norm, 1))
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  return progress
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

export default function Home() {
  const progress = useScrollProgress()

  const showTitle = progress > 0.15
  const showDescription = progress > 0.3
  const showButtons = progress > 0.4
  const showMetrics = progress > 0.6

  return (
    <div className="relative">
      <div className="fixed inset-0 -z-10">
        <HeroScene />
      </div>

      <div className="h-screen" />

      <div className="h-screen flex items-center justify-center px-4">
        <FadeSlide show={showTitle} direction="up">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-center drop-shadow-lg">
            Phoenix Protocol
          </h1>
        </FadeSlide>
      </div>

      <div className="h-screen flex items-center justify-center px-4">
        <div className="max-w-2xl text-center space-y-8">
          <FadeSlide show={showDescription} direction="up" delay={0}>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed drop-shadow-md">
              Permissionless autocall structured products on Ink.
              Earn 8.5-13% APY on a worst-of basket of tokenized equities
              with delta-neutral hedging and real-time coupon streaming.
            </p>
          </FadeSlide>
          <FadeSlide show={showButtons} direction="up" delay={150}>
            <div className="flex gap-4 justify-center pt-4">
              <Link href="/deposit">
                <Button size="lg" className="text-base px-8">
                  Deposit USDC
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-8 backdrop-blur-sm"
                >
                  Dashboard
                </Button>
              </Link>
            </div>
          </FadeSlide>
        </div>
      </div>

      <div className="h-screen flex items-center justify-center px-4">
        <div className="grid grid-cols-3 gap-8 max-w-2xl w-full">
          <FadeSlide show={showMetrics} direction="up" delay={0}>
            <div className="backdrop-blur-sm rounded-lg p-6 text-center">
              <p className="text-3xl font-bold">8.5-13%</p>
              <p className="text-muted-foreground mt-2">Target APY</p>
            </div>
          </FadeSlide>
          <FadeSlide show={showMetrics} direction="up" delay={150}>
            <div className="backdrop-blur-sm rounded-lg p-6 text-center">
              <p className="text-3xl font-bold">6 months</p>
              <p className="text-muted-foreground mt-2">Maturity</p>
            </div>
          </FadeSlide>
          <FadeSlide show={showMetrics} direction="up" delay={300}>
            <div className="backdrop-blur-sm rounded-lg p-6 text-center">
              <p className="text-3xl font-bold">3 assets</p>
              <p className="text-muted-foreground mt-2">Flagship basket</p>
            </div>
          </FadeSlide>
        </div>
      </div>
    </div>
  )
}
