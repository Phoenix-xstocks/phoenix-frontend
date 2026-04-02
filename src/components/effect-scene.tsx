"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { EffectComposer } from "@react-three/postprocessing"
import { useGLTF, useAnimations, Center } from "@react-three/drei"
import { Vector2, Group, MathUtils, Box3, Vector3 } from "three"
import { clone as cloneSkeletonUtils } from "three/examples/jsm/utils/SkeletonUtils.js"
import { AsciiEffect } from "./ascii-effect"

function PhoenixModel({
  scrollY,
  mouseX,
  mouseY,
  centerMode = false,
}: {
  scrollY: number
  mouseX: number
  mouseY: number
  centerMode?: boolean
}) {
  const groupRef = useRef<Group>(null)
  const { scene: originalScene, animations } = useGLTF("/phoenix.glb")

  // Clone the scene so each mount gets a fresh scene graph
  // without stale disposed WebGL resources from the useGLTF cache
  const scene = useMemo(() => cloneSkeletonUtils(originalScene), [originalScene])
  const { actions, mixer } = useAnimations(animations, scene)

  useEffect(() => {
    if (!actions) return
    Object.values(actions).forEach((action) => {
      if (!action) return
      action.reset().play()
      action.paused = true
    })
    return () => {
      Object.values(actions).forEach((action) => action?.stop())
    }
  }, [actions])

  const smoothMouse = useRef({ x: 0, y: 0 })
  const smoothScroll = useRef(0)
  const prevScroll = useRef(0)
  const scrollSpeed = useRef(0)
  const startTime = useRef(Date.now())

  const animDuration = useMemo(() => {
    if (animations.length > 0) return animations[0].duration
    return 1
  }, [animations])

  const normalizedScale = useMemo(() => {
    const box = new Box3().setFromObject(scene)
    const size = new Vector3()
    box.getSize(size)
    const maxDim = Math.max(size.x, size.y, size.z)
    return 6 / maxDim
  }, [scene])

  useFrame((_, delta) => {
    if (!groupRef.current) return

    smoothMouse.current.x = MathUtils.lerp(smoothMouse.current.x, mouseX, delta * 1.5)
    smoothMouse.current.y = MathUtils.lerp(smoothMouse.current.y, mouseY, delta * 1.5)
    smoothScroll.current = MathUtils.lerp(smoothScroll.current, scrollY, delta * 0.8)

    const t = smoothScroll.current

    // Track scroll speed for wing flap and banking
    const rawSpeed = Math.abs(smoothScroll.current - prevScroll.current) / Math.max(delta, 0.001)
    scrollSpeed.current = MathUtils.lerp(scrollSpeed.current, rawSpeed, delta * 3)
    prevScroll.current = smoothScroll.current

    // Slow constant wing flap
    const elapsed = (Date.now() - startTime.current) * 0.001
    if (actions && mixer) {
      const targetTime = (elapsed * 0.12) % 1 * animDuration
      Object.values(actions).forEach((action) => {
        if (!action) return
        action.time = targetTime
        action.paused = true
      })
      mixer.update(0)
    }

    const baseScale = centerMode ? 0.1 : 0.25

    // 9 waypoints: [x, y, scale]
    const waypoints: [number, number, number][] = [
      [0.0, -0.15, 0.25],    // 1 Hero: center, big
      [1.4, -1.0, 0.12],     // 2 Opportunity: bottom-right, small
      [1.4, 0.8, 0.12],      // 3 Product: top-right, small
      [0.0, 0.0, 0.08],      // 4 How it works: center, hidden behind video
      [-1.2, -0.7, 0.10],    // 5 Basket: bottom-left, small
      [-1.4, -0.5, 0.12],    // 6 Scenarios: left, bottom-mid, small
      [-1.4, -0.5, 0.12],    // 7 FAQ: more left, bottom-mid, same spot
      [-1.4, -0.5, 0.12],    // 7b FAQ continues: stays left
      [1.5, 0.0, 0.13],      // 8 CTA: far right
      [-1.5, 0.1, 0.25],     // 9 Footer: left, same as before
    ]

    if (centerMode) {
      // Center mode: phoenix stays centered, gently gliding
      const idleBob = Math.sin(elapsed * 0.3) * 0.03
      const idleSway = Math.sin(elapsed * 0.12) * 0.03

      groupRef.current.scale.setScalar(scaleMultiplier)
      groupRef.current.position.x = -1.2 + idleSway
      groupRef.current.position.y = 0.4 + idleBob
      groupRef.current.position.z = 0

      const bankZ = Math.sin(elapsed * 0.12) * 0.04
      const rotY = Math.PI / 2
      groupRef.current.rotation.y = rotY + smoothMouse.current.x * 0.05
      groupRef.current.rotation.x = -0.1 - smoothMouse.current.y * 0.03
      groupRef.current.rotation.z = bankZ
    } else {
      // Catmull-Rom spline for perfectly smooth curves through all waypoints
      const catmullRom = (p0: number, p1: number, p2: number, p3: number, t: number) => {
        const t2 = t * t
        const t3 = t2 * t
        return 0.5 * (
          2 * p1 +
          (-p0 + p2) * t +
          (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
          (-p0 + 3 * p1 - 3 * p2 + p3) * t3
        )
      }

      const sections = waypoints.length - 1
      const clampedT = Math.max(0, Math.min(isNaN(t) ? 0 : t, 1))
      const segment = Math.min(clampedT * sections, sections - 0.001)
      const idx = Math.floor(segment)
      const p = segment - idx

      const i0 = Math.max(idx - 1, 0)
      const i1 = idx
      const i2 = Math.min(idx + 1, sections)
      const i3 = Math.min(idx + 2, sections)

      const posX = catmullRom(waypoints[i0][0], waypoints[i1][0], waypoints[i2][0], waypoints[i3][0], p)
      const posY = catmullRom(waypoints[i0][1], waypoints[i1][1], waypoints[i2][1], waypoints[i3][1], p)
      const scaleVal = catmullRom(waypoints[i0][2], waypoints[i1][2], waypoints[i2][2], waypoints[i3][2], p)

      // Subtle idle bob
      const idleBob = Math.sin(elapsed * 0.8) * 0.04

      groupRef.current.scale.setScalar(Math.max(0.05, scaleVal))
      groupRef.current.position.x = posX
      groupRef.current.position.y = posY + idleBob

      // Blend between hero pose (face camera) and normal pose (side profile)
      const heroBlend = Math.max(0, 1 - clampedT * 8)

      // Bank into the direction of movement for a natural flight feel
      const bankZ = -Math.cos(t * Math.PI * 2) * 0.15 * Math.min(scrollSpeed.current * 3, 1)

      // Hero: rotY=0 (face us), Normal: rotY=PI/2 (side profile)
      const normalRotY = Math.PI / 2
      const heroRotY = 0
      const rotY = MathUtils.lerp(normalRotY, heroRotY, heroBlend)

      // Hero: slightly tilted back, Normal: slight forward tilt
      const normalRotX = -0.1
      const heroRotX = -0.3
      const rotX = MathUtils.lerp(normalRotX, heroRotX, heroBlend)

      groupRef.current.rotation.y = rotY + smoothMouse.current.x * 0.1
      groupRef.current.rotation.x = rotX - smoothMouse.current.y * 0.05
      groupRef.current.rotation.z = bankZ
    }
  })

  return (
    <group ref={groupRef}>
      <Center>
        <primitive
          object={scene}
          scale={normalizedScale}
          rotation={[-Math.PI / 6, -Math.PI / 5, Math.PI / 10]}
        />
      </Center>
    </group>
  )
}

export function EffectScene({ className, scrollProgress = 0, centerMode = false }: { className?: string; scrollProgress?: number; centerMode?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState(new Vector2(0, 0))
  const [resolution, setResolution] = useState(new Vector2(1920, 1080))
  const [mouseNorm, setMouseNorm] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = rect.height - (e.clientY - rect.top)
    setMousePos(new Vector2(x, y))
    const nx = (e.clientX / window.innerWidth) * 2 - 1
    const ny = (e.clientY / window.innerHeight) * 2 - 1
    setMouseNorm({ x: nx, y: ny })
  }, [])

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)

    const container = containerRef.current
    if (container) {
      const rect = container.getBoundingClientRect()
      setResolution(new Vector2(rect.width, rect.height))

      const handleResize = () => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        setResolution(new Vector2(rect.width, rect.height))
      }
      window.addEventListener("resize", handleResize)

      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("resize", handleResize)
      }
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [handleMouseMove])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: "100%", height: centerMode ? "100%" : "100vh" }}
    >
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 50 }}
        style={{ background: "transparent" }}
      >
        <color attach="background" args={["#0a0a0f"]} />

        <ambientLight intensity={0.6} />
        <hemisphereLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={3} />
        <directionalLight position={[-5, 3, -5]} intensity={2} />
        <pointLight position={[0, 2, 3]} intensity={2.5} color="#ff6b35" />

        <PhoenixModel
          scrollY={scrollProgress}
          mouseX={mouseNorm.x}
          mouseY={mouseNorm.y}
          centerMode={centerMode}
        />

        <EffectComposer>
          <AsciiEffect
            style="standard"
            cellSize={3}
            invert={false}
            color={true}
            resolution={resolution}
            mousePos={mousePos}
            postfx={{
              scanlineIntensity: 0.03,
              scanlineCount: 300,
              targetFPS: 0,
              jitterIntensity: 0,
              jitterSpeed: 1,
              mouseGlowEnabled: false,
              mouseGlowRadius: 0,
              mouseGlowIntensity: 0,
              vignetteIntensity: 0.6,
              vignetteRadius: 1.2,
              colorPalette: 0,
              curvature: 0,
              aberrationStrength: 0.0003,
              noiseIntensity: 0.01,
              noiseScale: 2,
              noiseSpeed: 0.2,
              waveAmplitude: 0,
              waveFrequency: 10,
              waveSpeed: 1,
              glitchIntensity: 0,
              glitchFrequency: 0,
              brightnessAdjust: 0.15,
              contrastAdjust: 1.4,
            }}
          />
        </EffectComposer>
      </Canvas>
    </div>
  )
}

useGLTF.preload("/phoenix.glb")
