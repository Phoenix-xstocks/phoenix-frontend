"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"

const EffectScene = dynamic(
  () => import("./effect-scene").then((mod) => ({ default: mod.EffectScene })),
  { ssr: false }
)

export function HeroScene() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-screen bg-background" />
      }
    >
      <EffectScene className="w-full h-screen" />
    </Suspense>
  )
}
