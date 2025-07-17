'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface Particle {
  x: number
  y: number
  phase: number
  collapsed: boolean
  targetX?: number
  targetY?: number
}

export default function WaveParticleSketch() {
  const [observing, setObserving] = useState(false)
  const [observerPos, setObserverPos] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Initialize particles
    particlesRef.current = []
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Background
      ctx.fillStyle = '#faf5ff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Draw double slit
      ctx.fillStyle = '#666'
      ctx.fillRect(canvas.width * 0.4 - 2, 0, 4, canvas.height * 0.35)
      ctx.fillRect(canvas.width * 0.4 - 2, canvas.height * 0.45, 4, canvas.height * 0.1)
      ctx.fillRect(canvas.width * 0.4 - 2, canvas.height * 0.65, 4, canvas.height * 0.35)
      
      // Add new particles
      if (Math.random() < 0.05) {
        particlesRef.current.push({
          x: 50,
          y: canvas.height / 2,
          phase: 0,
          collapsed: false
        })
      }
      
      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(particle => {
        if (!particle.collapsed) {
          // Wave behavior
          particle.x += 3
          particle.phase += 0.1
          
          // Draw wave
          ctx.strokeStyle = 'rgba(100, 150, 255, 0.6)'
          ctx.lineWidth = 2
          ctx.beginPath()
          
          for (let i = 0; i < 20; i++) {
            const waveY = particle.y + Math.sin(particle.phase + i * 0.3) * 30
            const waveX = particle.x - i * 5
            if (i === 0) {
              ctx.moveTo(waveX, waveY)
            } else {
              ctx.lineTo(waveX, waveY)
            }
          }
          ctx.stroke()
          
          // Check observation
          if (observing) {
            const dist = Math.hypot(particle.x - observerPos.x, particle.y - observerPos.y)
            if (dist < 100) {
              particle.collapsed = true
              particle.targetY = particle.y + (Math.random() - 0.5) * 100
            }
          }
        } else {
          // Particle behavior
          particle.x += 4
          if (particle.targetY !== undefined) {
            particle.y += (particle.targetY - particle.y) * 0.1
          }
          
          // Draw particle
          ctx.fillStyle = '#ff6b6b'
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, 5, 0, Math.PI * 2)
          ctx.fill()
        }
        
        return particle.x < canvas.width + 50
      })
      
      // Draw interference pattern when not observing
      if (!observing) {
        for (let x = canvas.width * 0.6; x < canvas.width - 50; x += 10) {
          for (let y = 100; y < canvas.height - 100; y += 10) {
            const dist1 = Math.hypot(x - canvas.width * 0.4, y - canvas.height * 0.4)
            const dist2 = Math.hypot(x - canvas.width * 0.4, y - canvas.height * 0.6)
            const interference = Math.sin((dist1 - dist2) * 0.05)
            
            ctx.fillStyle = `rgba(100, 150, 255, ${Math.abs(interference) * 0.3})`
            ctx.fillRect(x - 2, y - 2, 4, 4)
          }
        }
      }
      
      // Draw observer if active
      if (observing) {
        ctx.save()
        ctx.translate(observerPos.x, observerPos.y)
        
        // Eye
        ctx.fillStyle = 'white'
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.ellipse(0, 0, 30, 15, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        
        ctx.fillStyle = '#6495ed'
        ctx.beginPath()
        ctx.arc(0, 0, 10, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.fillStyle = 'black'
        ctx.beginPath()
        ctx.arc(0, 0, 5, 0, Math.PI * 2)
        ctx.fill()
        
        // Observation rays
        ctx.strokeStyle = 'rgba(255, 200, 100, 0.3)'
        ctx.lineWidth = 1
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2
          ctx.beginPath()
          ctx.moveTo(0, 0)
          ctx.lineTo(Math.cos(angle) * 60, Math.sin(angle) * 60)
          ctx.stroke()
        }
        
        ctx.restore()
      }
    }
    
    const animate = () => {
      draw()
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [observing, observerPos])

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect) {
      setObserverPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
      setObserving(true)
    }
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (observing) {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (rect) {
        setObserverPos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        })
      }
    }
  }

  return (
    <div className="p5-canvas-container">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold">Wave-Particle Duality</h3>
        <p className="text-sm text-gray-600 mt-1">
          {observing ? 'OBSERVING - Particles collapse!' : 'NOT OBSERVING - Waves interfere'}
        </p>
      </div>
      
      <div className="relative" style={{ aspectRatio: '2/1' }}>
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full h-full border border-gray-200 rounded-lg cursor-crosshair"
          onPointerDown={handlePointerDown}
          onPointerUp={() => setObserving(false)}
          onPointerLeave={() => setObserving(false)}
          onPointerMove={handlePointerMove}
          style={{ touchAction: 'none', maxHeight: '400px' }}
        />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-4 left-0 right-0 text-center"
        >
          <p className="text-sm text-gray-700 bg-white/80 inline-block px-4 py-2 rounded-full">
            Hold mouse down to observe
          </p>
        </motion.div>
      </div>
    </div>
  )
}