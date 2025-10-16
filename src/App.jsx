import './App.css'
import { Canvas } from "@react-three/fiber"
import { Environment, PerspectiveCamera, Sparkles } from "@react-three/drei"
import { Suspense, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CarCoverModel } from './modal/BikeCover'
import * as THREE from 'three'
import { CarModel } from './modal/CarModel'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const mainRef = useRef(null)
  const carRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const glRef = useRef(null)

  useEffect(() => {
    let ctx

    const setupScroll = () => {

      ctx = gsap.context(() => {
        gsap.timeline({
          scrollTrigger: {
            trigger: mainRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            onUpdate: (self) => setProgress(self.progress),
          },
        })
      })
    }

    const interval = setInterval(() => {
      if (carRef.current) {
        setupScroll()
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
          <h1 className='text-4xl text-amber-300 text-center font-bold mt-4'>Audi Car Model</h1>
          <Canvas
            dpr={[1, 1.5]}
            onCreated={({ gl }) => {
              glRef.current = gl
              gl.domElement.addEventListener("webglcontextlost", (e) => {
                e.preventDefault()
              })
            }}
            style={{marginTop: '-60px'}}
          >
            <Suspense fallback={null}>
              <CarScene progress={progress} carRef={carRef} />
            </Suspense>
          </Canvas>
        </div>

        <div className="relative h-[600vh] z-20">

        </div>

      </Suspense>
    </main>
  )
}

export default App


const CarScene = ({ progress, carRef }) => {
  const coverRef = useRef()

  useEffect(() => {
    if (!carRef.current || !coverRef.current) return
  
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
  
    gsap.to(carRef.current.rotation, {
      x,
      y,
      z,
      duration: 0.5,
      ease: "power2.out",
      overwrite: true,
    })
  
    gsap.to(coverRef.current.rotation, {
      x,
      y,
      z,
      duration: 0.5,
      ease: "power2.out",
      overwrite: true,
    })
  
    if (progress > 0.55) {
      const coverProgress = (progress - 0.55) / 0.45
      gsap.to(coverRef.current.position, {
        x: THREE.MathUtils.lerp(0, -10, coverProgress),
        duration: 0.5,
        ease: "power2.out",
        overwrite: true,
      })
    }
  
  }, [progress])
  


  return (
    <>
      <PerspectiveCamera fov={45} near={.1} far={10000} makeDefault position={[0, 1, 10]} />
      <Environment preset='forest' dpr={[1, 1.5]} />
      <ambientLight intensity={0.2} color={0xfcfcfc} />
      <spotLight intensity={100} position={[1, 4, 2]} />
      <group>
        <CarCoverModel ref={coverRef} position={[0, 0, 4]} rotation={[0, 1.3, 1.3]} scale={[0.8,1.12,0.98]} />
        <CarModel ref={carRef} position={[-1.6, 0, 0]} rotation={[1.3, 1.5, 0]} />      
      </group>
    </>
  )
}
