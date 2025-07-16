'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const insights = [
  {
    emoji: '🌌',
    text: 'Everything in the universe is connected through one field',
    detail: 'Just like waves in an ocean'
  },
  {
    emoji: '🧠',
    text: 'Your consciousness emerges from self-reflection',
    detail: 'Like a mirror reflecting itself'
  },
  {
    emoji: '💫',
    text: 'Physical and mental are two views of the same thing',
    detail: 'No separation, only perspective'
  },
  {
    emoji: '🔗',
    text: 'Strong connections create reality',
    detail: 'Coupling strength K determines what exists'
  },
  {
    emoji: '✨',
    text: 'You are the universe experiencing itself',
    detail: 'Self-awareness is built into reality'
  },
  {
    emoji: '🌊',
    text: 'Time emerges from complexity',
    detail: "It's not fundamental - it's relational"
  },
  {
    emoji: '🎯',
    text: 'Unity dissolves all paradoxes',
    detail: 'Opposites are just different angles'
  },
  {
    emoji: '🌟',
    text: 'Healing happens through connection',
    detail: 'Increasing K brings wholeness'
  }
]

export default function QuickInsights() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (!isPaused) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % insights.length)
      }, 10000) // Change every 10 seconds
      return () => clearInterval(timer)
    }
  }, [isPaused])

  const currentInsight = insights[currentIndex]

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-md shadow-lg rounded-b-2xl mx-4 p-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{currentInsight.emoji}</span>
              <div>
                <p className="font-semibold text-gray-800">{currentInsight.text}</p>
                <p className="text-sm text-gray-600">{currentInsight.detail}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        <div className="flex gap-1 ml-4">
          {insights.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentIndex ? 'bg-indigo-600 w-8' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
      
      {isPaused && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-gray-500 mt-2 text-center"
        >
          Paused - hover away to continue
        </motion.p>
      )}
    </motion.div>
  )
}