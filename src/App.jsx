import './App.css'
import { Canvas } from "@react-three/fiber"
import { Environment, PerspectiveCamera, Sparkles } from "@react-three/drei"
import { Suspense, useEffect, useRef, useState } from 'react'
import { BikeModel } from './modal/BikeModal'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BikeCoverModel } from './modal/BikeCover'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const mainRef = useRef(null)
  const coverRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const glRef = useRef(null)

  useEffect(() => {
    let ctx

    const setupScroll = () => {
      if (!coverRef.current) return // 👈 Don’t run until model exists

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: mainRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            onUpdate: (self) => setProgress(self.progress),
          },
        })
        tl.to(coverRef.current.position, {
          x: -10,
          ease: "none",
        })
      })
    }

    const interval = setInterval(() => {
      if (coverRef.current) {
        setupScroll()
        clearInterval(interval)
      }
    }, 100)

    return () => {
      clearInterval(interval)
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      ctx && ctx.revert()
    }
  }, [])

  return (
    <main ref={mainRef} className="overflow-x-hidden relative">
      <Suspense
        fallback={
          <div className="fixed inset-0 grid place-items-center bg-black text-white">
            Loading...
          </div>
        }
      >

        <div className="fixed inset-0 z-0">
          <Canvas
            dpr={[1, 1.5]}
            onCreated={({ gl }) => {
              glRef.current = gl
              gl.domElement.addEventListener("webglcontextlost", (e) => {
                e.preventDefault()
                console.warn("WebGL context lost, attempting to recover...")
              })
            }}
          >
            <Suspense fallback={null}>
              <BikeScene progress={progress} coverRef={coverRef} />
            </Suspense>
          </Canvas>
        </div>

        <div className="relative h-[300vh] z-20 text-white">

        </div>

      </Suspense>
    </main>
  )
}

export default App


const BikeScene = ({ progress, coverRef }) => {
  const bikeRef = useRef()

  useEffect(() => {
    if (!bikeRef.current) return

    const rotations = [
      [1.3, 1.5, 0],
      [0.7, 1.5, 0],
      [0.3, 1.5, 0],
      [0, 1.5, 0],
    ]

    const segmentProgress = 1 / 3
    const segmentIndex = Math.min(Math.floor(progress / segmentProgress), rotations.length - 2)
    const percentage = (progress % segmentProgress) / segmentProgress

    const [startX, startY, startZ] = rotations[segmentIndex]
    const [endX, endY, endZ] = rotations[segmentIndex + 1]

    const x = startX + (endX - startX) * percentage
    const y = startY + (endY - startY) * percentage
    const z = startZ + (endZ - startZ) * percentage

    gsap.to(bikeRef.current.rotation, {
      x,
      y,
      z,
      duration: 0.5,
      ease: "power2.out",
      overwrite: true,
    })
  }, [progress])

  // const showSparkles = progress < 0.05 || progress > 0.95

  return (
    <>
      <PerspectiveCamera fov={45} near={.1} far={10000} makeDefault position={[0, 1, 10]} />
      <Environment preset='city' dpr={[1, 1.5]} />
      <ambientLight intensity={0.2} color={0xfcfcfc}/>
      <spotLight intensity={100} position={[1,4,2]}/>
      <BikeCoverModel ref={coverRef} position={[0, 0.8, 4]} rotation={[0, 2, 1]} scale={0.8}/>
      <BikeModel ref={bikeRef} position={[0, 0, 0]} rotation={[1.3, 1.5, 0]} />
    </>
  )
}
