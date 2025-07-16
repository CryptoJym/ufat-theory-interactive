'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface Props {
  onDismiss: () => void
  onChoosePath: (path: 'explore' | 'learn' | 'understand') => void
}

export default function WelcomeOverlay({ onDismiss, onChoosePath }: Props) {
  const [showPaths, setShowPaths] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onDismiss}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white/95 p-8 rounded-3xl shadow-2xl max-w-lg mx-4"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {!showPaths ? (
          <>
            <h1 className="text-3xl font-bold text-indigo-700 mb-4">
              Welcome to Unity
            </h1>
            <p className="text-gray-600 mb-6">
              Everything is connected. You're about to discover how.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setShowPaths(true)}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
              >
                I'm ready to explore
              </button>
              <button
                onClick={onDismiss}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Just show me the visualization
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">
              You can change your preferences anytime
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">
              Choose Your Journey
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => onChoosePath('explore')}
                className="w-full p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all text-left"
              >
                <h3 className="font-semibold text-purple-700">🎮 Interactive Stories</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Playful thought experiments to understand complex ideas
                </p>
              </button>
              
              <button
                onClick={() => onChoosePath('learn')}
                className="w-full p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all text-left"
              >
                <h3 className="font-semibold text-blue-700">📚 Guided Learning</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Step-by-step introduction to the theory
                </p>
              </button>
              
              <button
                onClick={() => onChoosePath('understand')}
                className="w-full p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-all text-left"
              >
                <h3 className="font-semibold text-green-700">🔬 Evidence & Research</h3>
                <p className="text-sm text-gray-600 mt-1">
                  See the scientific validation and real-world applications
                </p>
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}