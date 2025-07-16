'use client'

import { useState, useEffect } from 'react'

interface UserPreferences {
  visualComplexity: 'low' | 'medium' | 'high'
  allowInteraction: boolean
  simplifiedMath: boolean
  reducedMotion: boolean
  autoAdvance: boolean
  soundEnabled: boolean
}

export default function useTraumaInformed() {
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    visualComplexity: 'medium',
    allowInteraction: true,
    simplifiedMath: false,
    reducedMotion: false,
    autoAdvance: true,
    soundEnabled: false
  })

  // Load preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ufat-preferences')
    if (saved) {
      setUserPreferences(JSON.parse(saved))
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      updatePreference('reducedMotion', true)
      updatePreference('visualComplexity', 'low')
    }
  }, [])

  const updatePreference = (key: keyof UserPreferences, value: any) => {
    setUserPreferences(prev => {
      const updated = { ...prev, [key]: value }
      localStorage.setItem('ufat-preferences', JSON.stringify(updated))
      return updated
    })
  }

  return {
    userPreferences,
    updatePreference
  }
}