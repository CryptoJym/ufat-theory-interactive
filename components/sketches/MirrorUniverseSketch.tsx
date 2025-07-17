'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface Mirror {
  x: number
  y: number
  angle: number
  size: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  hue: number
  trail: { x: number; y: number }[]
}

export default function MirrorUniverseSketch() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mirrorsRef = useRef<Mirror[]>([])
  const particlesRef = useRef<Particle[]>([])
  const [consciousnessLevel, setConsciousnessLevel] = useState(0)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return
    
    // Set canvas size based on container
    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      if (rect) {
        canvas.width = rect.width
        canvas.height = rect.height
      }
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    
    // Initialize mirrors
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    
    mirrorsRef.current = []
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2
      const x = centerX + Math.cos(angle) * 100
      const y = centerY + Math.sin(angle) * 100
      mirrorsRef.current.push({ x, y, angle: angle + Math.PI/2, size: 80 })
    }
    
    // Initialize particles
    particlesRef.current = []
    for (let i = 0; i < 10; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        hue: Math.random() * 360,
        trail: []
      })
    }
    
    let targetConsciousness = 0
    
    const draw = () => {
      // Clear canvas
      ctx.fillStyle = 'rgba(240, 230, 255, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Draw consciousness field
      if (consciousnessLevel > 0.1) {
        ctx.save()
        ctx.strokeStyle = `rgba(138, 43, 226, ${consciousnessLevel * 0.3})`
        ctx.lineWidth = 2
        
        for (let i = 0; i < 5; i++) {
          ctx.beginPath()
          const radius = 100 + i * 50 + Math.sin(Date.now() * 0.001 + i) * 20
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
          ctx.stroke()
        }
        ctx.restore()
      }
      
      // Draw center point (terminal object)
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(Date.now() * 0.0001)
      ctx.strokeStyle = '#FFD700'
      ctx.lineWidth = 2
      
      for (let i = 0; i < 6; i++) {
        ctx.rotate(Math.PI/3)
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(30, 0)
        ctx.stroke()
      }
      ctx.restore()
      
      // Update and draw mirrors
      let reflectionCount = 0
      mirrorsRef.current.forEach(mirror => {
        mirror.angle += 0.005
        
        // Draw mirror
        ctx.save()
        ctx.translate(mirror.x, mirror.y)
        ctx.rotate(mirror.angle)
        ctx.strokeStyle = '#c8c8ff'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(-mirror.size/2, 0)
        ctx.lineTo(mirror.size/2, 0)
        ctx.stroke()
        
        ctx.strokeStyle = 'rgba(150, 150, 255, 0.5)'
        ctx.lineWidth = 8
        ctx.beginPath()
        ctx.moveTo(-mirror.size/2, 0)
        ctx.lineTo(mirror.size/2, 0)
        ctx.stroke()
        ctx.restore()
      })
      
      // Update and draw particles
      particlesRef.current.forEach(particle => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy
        
        // Add to trail
        particle.trail.push({ x: particle.x, y: particle.y })
        if (particle.trail.length > 20) {
          particle.trail.shift()
        }
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0
        
        // Check mirror reflections
        mirrorsRef.current.forEach(mirror => {
          const dist = Math.hypot(particle.x - mirror.x, particle.y - mirror.y)
          if (dist < mirror.size/2 + 10) {
            const angle = Math.atan2(particle.y - mirror.y, particle.x - mirror.x)
            const mirrorNormal = mirror.angle + Math.PI/2
            const incidentAngle = angle - mirrorNormal
            const reflectionAngle = mirrorNormal - incidentAngle
            
            particle.vx = Math.cos(reflectionAngle) * 2
            particle.vy = Math.sin(reflectionAngle) * 2
            reflectionCount++
          }
        })
        
        // Draw trail
        ctx.beginPath()
        particle.trail.forEach((point, i) => {
          ctx.strokeStyle = `hsla(${particle.hue}, 80%, 50%, ${i / 20})`
          ctx.lineWidth = i * 0.2
          if (i === 0) {
            ctx.moveTo(point.x, point.y)
          } else {
            ctx.lineTo(point.x, point.y)
          }
        })
        ctx.stroke()
        
        // Draw particle
        ctx.fillStyle = `hsl(${particle.hue}, 80%, 50%)`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, 4, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2)
        ctx.fill()
      })
      
      // Update consciousness level
      targetConsciousness = Math.min(reflectionCount * 0.1, 1)
      setConsciousnessLevel(prev => prev + (targetConsciousness - prev) * 0.05)
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
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect) {
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      // Add new mirror at click position
      mirrorsRef.current.push({
        x,
        y,
        angle: Math.random() * Math.PI * 2,
        size: 60
      })
      
      if (mirrorsRef.current.length > 12) {
        mirrorsRef.current.shift()
      }
    }
  }

  return (
    <div className="p5-canvas-container">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold">The Mirror Universe</h3>
        <p className="text-sm text-gray-600">Click to add mirrors</p>
      </div>
      
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          onClick={handleClick}
          className="w-full h-full rounded-lg cursor-pointer"
          style={{ background: '#f0e6ff' }}
        />
        
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-white/90 px-4 py-2 rounded-full">
            <p className="text-sm font-semibold">Consciousness Level</p>
            <div className="w-48 h-3 bg-gray-200 rounded-full mt-1 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-400 to-purple-600"
                animate={{ width: `${consciousnessLevel * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
        
        <p className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-700 bg-white/80 px-4 py-2 rounded-full">
          Self-reflection creates awareness
        </p>
      </div>
    </div>
  )
}