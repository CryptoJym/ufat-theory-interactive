'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface Props {
  currentView: string
  onViewChange: (view: 'intro' | 'explore' | 'learn' | 'understand') => void
  userPreferences: any
  onPreferenceChange: (key: string, value: any) => void
}

export default function NavigationMenu({ currentView, onViewChange, userPreferences, onPreferenceChange }: Props) {
  const [showSettings, setShowSettings] = useState(false)

  const navItems = [
    { id: 'intro', label: 'Home', icon: '🏠' },
    { id: 'explore', label: 'Explore', icon: '🎮' },
    { id: 'learn', label: 'Learn', icon: '📚' },
    { id: 'understand', label: 'Evidence', icon: '🔬' }
  ]

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="bg-white/90 backdrop-blur-md rounded-full shadow-lg px-4 py-2 flex items-center gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as any)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onViewChange(item.id as any)
                }
              }}
              className={`px-4 py-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                currentView === item.id
                  ? 'bg-indigo-600 text-white'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
              aria-label={`Navigate to ${item.label}`}
              aria-current={currentView === item.id ? 'page' : undefined}
            >
              <span className="mr-2">{item.icon}</span>
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
          
          <div className="w-px h-8 bg-gray-300 mx-2" />
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-3 py-2 rounded-full hover:bg-gray-100 text-gray-700"
          >
            ⚙️
          </button>
        </div>
      </motion.nav>

      {/* Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-40 bg-white rounded-2xl shadow-xl p-6 w-80"
        >
          <h3 className="font-semibold text-gray-800 mb-4">Preferences</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Visual Complexity</label>
              <select
                value={userPreferences.visualComplexity}
                onChange={(e) => onPreferenceChange('visualComplexity', e.target.value)}
                className="w-full mt-1 p-2 border rounded-lg"
              >
                <option value="low">Simple</option>
                <option value="medium">Moderate</option>
                <option value="high">Full</option>
              </select>
            </div>
            
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={userPreferences.allowInteraction}
                  onChange={(e) => onPreferenceChange('allowInteraction', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-600">Interactive Mode</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={userPreferences.simplifiedMath}
                  onChange={(e) => onPreferenceChange('simplifiedMath', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-600">Simplified Mathematics</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={userPreferences.reducedMotion}
                  onChange={(e) => onPreferenceChange('reducedMotion', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-600">Reduce Motion</span>
              </label>
            </div>
          </div>
          
          <button
            onClick={() => setShowSettings(false)}
            className="mt-4 w-full py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </motion.div>
      )}
    </>
  )
}