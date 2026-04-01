"use client"

import dynamic from "next/dynamic"
import { Suspense, useState, useEffect } from "react"
import { usePathname } from "next/navigation"

const EffectScene = dynamic(
  () => import("./effect-scene").then((mod) => ({ default: mod.EffectScene })),
  { ssr: false }
)

export function HeroScene({ scrollProgress, centerMode = false, className }: { scrollProgress: number; centerMode?: boolean; className?: string }) {
  const [mountKey, setMountKey] = useState(0)
  const pathname = usePathname()

  // Force a full remount whenever the pathname changes back to this page.
  // This ensures a fresh Canvas + fresh cloned scene on every navigation.
  useEffect(() => {
    setMountKey((k) => k + 1)
  }, [pathname])

  // Handle bfcache restore (hard back/forward via browser gesture)
  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        setMountKey((k) => k + 1)
      }
    }
    window.addEventListener("pageshow", handlePageShow)
    return () => window.removeEventListener("pageshow", handlePageShow)
  }, [])

  return (
    <Suspense
      fallback={
        <div className={className ?? "w-full h-screen"} style={{ background: 'transparent' }} />
      }
    >
      <EffectScene key={mountKey} className={className ?? "w-full h-screen"} scrollProgress={scrollProgress} centerMode={centerMode} />
    </Suspense>
  )
}
