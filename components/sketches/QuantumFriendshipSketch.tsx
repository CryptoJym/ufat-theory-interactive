'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function QuantumFriendshipSketch() {
  const [coupling, setCoupling] = useState(0.5)
  const [decision1, setDecision1] = useState<boolean | null>(null)
  const [decision2, setDecision2] = useState<boolean | null>(null)
  const [showResult, setShowResult] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const makeDecision = () => {
    const threshold = Math.random()
    
    if (threshold < coupling) {
      // Correlated decision
      const choice = Math.random() > 0.5
      setDecision1(choice)
      setDecision2(choice)
    } else {
      // Independent decisions
      setDecision1(Math.random() > 0.5)
      setDecision2(Math.random() > 0.5)
    }
    
    setShowResult(true)
    setTimeout(() => {
      setShowResult(false)
      setDecision1(null)
      setDecision2(null)
    }, 5000)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw connection field
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, 200
      )
      gradient.addColorStop(0, `rgba(150, 100, 255, ${coupling * 0.3})`)
      gradient.addColorStop(1, 'rgba(150, 100, 255, 0)')
      
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Draw connection waves
      ctx.strokeStyle = `rgba(150, 100, 255, ${coupling * 0.5})`
      ctx.lineWidth = 2
      
      for (let i = 0; i < 5; i++) {
        ctx.beginPath()
        ctx.arc(
          canvas.width / 2, 
          canvas.height / 2, 
          50 + i * 30 + Math.sin(Date.now() * 0.001 + i) * 10,
          0, 
          Math.PI * 2
        )
        ctx.stroke()
      }
    }
    
    const animate = () => {
      draw()
      requestAnimationFrame(animate)
    }
    
    animate()
  }, [coupling])

  return (
    <div className="p5-canvas-container relative">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={600} 
        className="absolute inset-0 w-full h-full"
      />
      
      <div className="relative z-10 h-full flex flex-col justify-between p-8">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Quantum Friendship Experiment</h3>
          <p className="text-sm text-gray-600">
            Will they choose to help each other?
          </p>
        </div>
        
        <div className="flex justify-around items-center">
          <motion.div
            animate={{ 
              scale: decision1 !== null ? 1.1 : 1,
              backgroundColor: decision1 === true ? '#FFD700' : '#6495ED' 
            }}
            className="w-24 h-24 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold"
          >
            Alice
          </motion.div>
          
          <div className="text-center">
            <div className="text-4xl mb-2">↔️</div>
            <div className="text-sm">K = {coupling.toFixed(2)}</div>
          </div>
          
          <motion.div
            animate={{ 
              scale: decision2 !== null ? 1.1 : 1,
              backgroundColor: decision2 === true ? '#FFD700' : '#FF6347' 
            }}
            className="w-24 h-24 rounded-full bg-red-400 flex items-center justify-center text-white font-bold"
          >
            Bob
          </motion.div>
        </div>
        
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-4 bg-white/90 rounded-lg"
          >
            {decision1 === decision2 ? (
              <div className="text-green-600">
                <p className="font-bold text-lg">They made the same choice!</p>
                <p className="text-sm">Quantum correlation demonstrated (K={coupling.toFixed(2)})</p>
              </div>
            ) : (
              <div className="text-red-600">
                <p className="font-bold text-lg">They made different choices</p>
                <p className="text-sm">Low coupling = less correlation</p>
              </div>
            )}
            <div className="mt-2 text-sm text-gray-600">
              <p>Alice: {decision1 ? 'Help friend ($1000)' : 'Keep money ($500)'}</p>
              <p>Bob: {decision2 ? 'Help friend ($1000)' : 'Keep money ($500)'}</p>
            </div>
          </motion.div>
        )}
        
        <div>
          <label className="block text-center mb-2">
            Friendship Strength (K)
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={coupling}
            onChange={(e) => setCoupling(parseFloat(e.target.value))}
            className="w-full"
          />
          
          <button
            onClick={makeDecision}
            disabled={showResult}
            className="mt-4 w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            Make Decision
          </button>
        </div>
      </div>
    </div>
  )
}