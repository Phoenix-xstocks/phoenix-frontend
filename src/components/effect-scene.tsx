"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { EffectComposer } from "@react-three/postprocessing"
import { useGLTF, useAnimations, Center } from "@react-three/drei"
import { Vector2, Group, MathUtils, Box3, Vector3 } from "three"
import { AsciiEffect } from "./ascii-effect"

function PhoenixModel({
  scrollY,
  mouseX,
  mouseY,
}: {
  scrollY: number
  mouseX: number
  mouseY: number
}) {
  const groupRef = useRef<Group>(null)
  const { scene, animations } = useGLTF("/phoenix.glb")
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
    smoothScroll.current = MathUtils.lerp(smoothScroll.current, scrollY, delta * 3)

    const t = smoothScroll.current

    // Drive wing flap animation from scroll
    if (actions && mixer) {
      const targetTime = (t * 3) % 1 * animDuration
      Object.values(actions).forEach((action) => {
        if (!action) return
        action.time = targetTime
        action.paused = true
      })
      mixer.update(0)
    }

    // Scroll-driven flight path:
    // 0.0-0.15: slightly left and lower, large (hero)
    // 0.15-0.85: gradually turn and drift right, shrink (long flight)
    // 0.85-1.0: exit right completely
    let scaleMultiplier = 1
    let posX = -0.8
    let posY = -0.3
    let rotY = 0

    if (t <= 0.15) {
      // Phase 1: big, slightly left and low
      scaleMultiplier = 1
      posX = -0.8
      posY = -1.5
      rotY = 0
    } else if (t <= 0.85) {
      // Phase 2: long flight - turn and drift right, shrink
      const p = (t - 0.15) / 0.7
      scaleMultiplier = MathUtils.lerp(1, 0.4, p)
      posX = MathUtils.lerp(-0.8, 3.5, p)
      posY = MathUtils.lerp(-1.5, 0.3, Math.sin(p * Math.PI))
      rotY = MathUtils.lerp(0, 0.8, p)
    } else {
      // Phase 3: exit right
      const p = (t - 0.85) / 0.15
      scaleMultiplier = MathUtils.lerp(0.4, 0.15, p)
      posX = MathUtils.lerp(3.5, 8, p)
      posY = MathUtils.lerp(0, 0.8, p)
      rotY = MathUtils.lerp(0.8, 1.2, p)
    }

    groupRef.current.scale.setScalar(scaleMultiplier)
    groupRef.current.position.x = posX
    groupRef.current.position.y = posY + Math.sin(Date.now() * 0.0005) * 0.03

    // Mouse parallax + scroll-driven turn
    groupRef.current.rotation.y = rotY + smoothMouse.current.x * 0.15
    groupRef.current.rotation.x = -smoothMouse.current.y * 0.08
  })

  return (
    <group ref={groupRef}>
      <Center>
        <primitive
          object={scene}
          scale={normalizedScale}
          rotation={[-Math.PI / 12, -Math.PI / 2, Math.PI / 10]}
        />
      </Center>
    </group>
  )
}

export function EffectScene({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState(new Vector2(0, 0))
  const [resolution, setResolution] = useState(new Vector2(1920, 1080))
  const [mouseNorm, setMouseNorm] = useState({ x: 0, y: 0 })
  const [scrollNorm, setScrollNorm] = useState(0)

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

  const handleScroll = useCallback(() => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    const norm = maxScroll > 0 ? window.scrollY / maxScroll : 0
    setScrollNorm(Math.min(norm, 1))
  }, [])

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("scroll", handleScroll, { passive: true })

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
        window.removeEventListener("scroll", handleScroll)
        window.removeEventListener("resize", handleResize)
      }
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [handleMouseMove, handleScroll])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: "100%", height: "100vh" }}
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
          scrollY={scrollNorm}
          mouseX={mouseNorm.x}
          mouseY={mouseNorm.y}
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
              scanlineIntensity: 0.08,
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
              aberrationStrength: 0.001,
              noiseIntensity: 0.03,
              noiseScale: 2,
              noiseSpeed: 0.5,
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
