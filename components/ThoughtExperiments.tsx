'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'

// Dynamic import for p5 sketches
const MirrorUniverseSketch = dynamic(() => import('./sketches/MirrorUniverseSketch'), { ssr: false })
const QuantumFriendshipSketch = dynamic(() => import('./sketches/QuantumFriendshipSketch'), { ssr: false })
const WaveParticleSketch = dynamic(() => import('./sketches/WaveParticleSketch'), { ssr: false })

const experiments = [
  {
    id: 'mirror',
    title: 'The Mirror Universe',
    emoji: '🪞',
    description: 'See how consciousness emerges from self-reflection',
    component: MirrorUniverseSketch
  },
  {
    id: 'friendship',
    title: 'Quantum Friendship',
    emoji: '👥',
    description: 'Discover how relationships create real physical connections',
    component: QuantumFriendshipSketch
  },
  {
    id: 'wave',
    title: 'Wave or Particle?',
    emoji: '🌊',
    description: 'Experience how observation changes reality',
    component: WaveParticleSketch
  }
]

export default function ThoughtExperiments() {
  const [selectedExperiment, setSelectedExperiment] = useState(experiments[0])

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Interactive Thought Experiments
        </h2>
        <p className="text-gray-600">
          Play with these concepts to understand unity
        </p>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Experiment Selector */}
        <div className="p-4 space-y-2">
          {experiments.map((exp) => (
            <motion.button
              key={exp.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedExperiment(exp)}
              className={`w-full p-4 rounded-xl transition-all text-left ${
                selectedExperiment.id === exp.id
                  ? 'bg-indigo-100 border-2 border-indigo-400'
                  : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{exp.emoji}</span>
                <div>
                  <h3 className="font-semibold text-gray-800">{exp.title}</h3>
                  <p className="text-sm text-gray-600">{exp.description}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Active Experiment */}
        <div className="flex-1 p-4">
          <motion.div
            key={selectedExperiment.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-full bg-gray-50 rounded-xl overflow-hidden"
          >
            <selectedExperiment.component />
          </motion.div>
        </div>

        {/* Instructions */}
        <div className="p-4 bg-indigo-50 border-t">
          <p className="text-sm text-indigo-700 text-center">
            💡 Tip: Click and drag to interact with the experiments
          </p>
        </div>
      </div>
    </div>
  )
}