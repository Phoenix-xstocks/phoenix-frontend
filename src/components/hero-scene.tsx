"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"

const EffectScene = dynamic(
  () => import("./effect-scene").then((mod) => ({ default: mod.EffectScene })),
  { ssr: false }
)

export function HeroScene({ scrollProgress, centerMode = false, className }: { scrollProgress: number; centerMode?: boolean; className?: string }) {
  return (
    <Suspense
      fallback={
        <div className={className ?? "w-full h-screen"} style={{ background: 'transparent' }} />
      }
    >
      <EffectScene className={className ?? "w-full h-screen"} scrollProgress={scrollProgress} centerMode={centerMode} />
    </Suspense>
  )
}
