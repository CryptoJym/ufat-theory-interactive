'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import WelcomeOverlay from '@/components/WelcomeOverlay'
import NavigationMenu from '@/components/NavigationMenu'
import QuickInsights from '@/components/QuickInsights'
import useTraumaInformed from '@/hooks/useTraumaInformed'

// Dynamic imports for heavy 3D components
const UniversalFieldVisualization = dynamic(
  () => import('@/components/three/UniversalFieldVisualization'),
  { 
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-screen">
      <div className="animate-pulse text-indigo-600">Preparing your experience...</div>
    </div>
  }
)

const ThoughtExperiments = dynamic(() => import('@/components/ThoughtExperiments'), { ssr: false })
const FormalTheory = dynamic(() => import('@/components/FormalTheory'), { ssr: false })
const ResearchLinks = dynamic(() => import('@/components/ResearchLinks'), { ssr: false })

export default function Home() {
  const [currentView, setCurrentView] = useState<'intro' | 'explore' | 'learn' | 'understand'>('intro')
  const [showWelcome, setShowWelcome] = useState(true)
  const { userPreferences, updatePreference } = useTraumaInformed()

  useEffect(() => {
    // Auto-hide welcome after 5 seconds if user hasn't interacted
    const timer = setTimeout(() => {
      if (showWelcome) {
        setShowWelcome(false)
      }
    }, 5000)
    return () => clearTimeout(timer)
  }, [showWelcome])

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Skip to content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-indigo-600 text-white px-4 py-2 rounded-lg"
      >
        Skip to main content
      </a>
      {/* Calming background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-50" />
      
      {/* Main 3D Visualization */}
      <div className="fixed inset-0 z-0">
        <UniversalFieldVisualization 
          complexity={userPreferences.visualComplexity}
          interactive={userPreferences.allowInteraction}
        />
      </div>

      {/* Welcome Overlay */}
      <AnimatePresence>
        {showWelcome && (
          <WelcomeOverlay 
            onDismiss={() => setShowWelcome(false)}
            onChoosePath={(path) => {
              setShowWelcome(false)
              setCurrentView(path)
            }}
          />
        )}
      </AnimatePresence>

      {/* Quick Insights Bar */}
      {!showWelcome && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="fixed top-0 left-0 right-0 z-20"
        >
          <QuickInsights />
        </motion.div>
      )}

      {/* Navigation Menu */}
      {!showWelcome && (
        <NavigationMenu 
          currentView={currentView}
          onViewChange={setCurrentView}
          userPreferences={userPreferences}
          onPreferenceChange={updatePreference}
        />
      )}

      {/* Content Panels */}
      <div id="main-content">
        <AnimatePresence mode="wait">
          {currentView === 'explore' && (
            <motion.section
              key="thought-experiments"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="fixed left-0 top-20 bottom-0 w-full md:w-1/2 lg:w-1/3 bg-white/90 backdrop-blur-md overflow-y-auto z-30"
              role="region"
              aria-label="Interactive thought experiments"
            >
              <ThoughtExperiments />
            </motion.section>
          )}

        {currentView === 'learn' && (
          <motion.div
            key="formal-theory"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed right-0 top-20 bottom-0 w-full md:w-1/2 lg:w-2/3 bg-white/90 backdrop-blur-md overflow-y-auto z-30"
          >
            <FormalTheory simplified={userPreferences.simplifiedMath} />
          </motion.div>
        )}

        {currentView === 'understand' && (
          <motion.div
            key="research-links"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed bottom-0 left-0 right-0 h-1/3 bg-white/90 backdrop-blur-md overflow-y-auto z-30"
          >
            <ResearchLinks />
          </motion.div>
        )}
      </AnimatePresence>
      </div>

      {/* Escape Hatch */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={() => setCurrentView('intro')}
        className="fixed bottom-4 right-4 z-40 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-colors"
      >
        Simplify View
      </motion.button>
    </main>
  )
}