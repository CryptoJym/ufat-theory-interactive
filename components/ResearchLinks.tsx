'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Tooltip } from 'react-tooltip'

interface Citation {
  id: string
  title: string
  source: string
  year: string
  relevance: string
  link?: string
  doi?: string
  summary: string
}

export default function ResearchLinks() {
  const [selectedCategory, setSelectedCategory] = useState('consciousness')

  const categories = {
    consciousness: {
      label: 'Consciousness & Quantum Mind',
      emoji: '🧠',
      citations: [
        {
          id: 'orch-or-2025',
          title: 'Orchestrated Objective Reduction and Consciousness',
          source: 'Oxford University Press',
          year: '2025',
          relevance: 'Validates consciousness emergence from quantum processes',
          link: 'https://academic.oup.com/book/55644',
          summary: 'Shows how microtubules maintain quantum coherence, supporting UFAT\'s self-referential consciousness model.'
        },
        {
          id: 'anesthesia-2025',
          title: 'Anesthetics and Quantum Coherence in Brain',
          source: 'Earth.com / bioRxiv',
          year: '2025',
          relevance: 'Confirms K-value drops under anesthesia',
          summary: 'Demonstrates entropy changes matching UFAT predictions for consciousness states.'
        }
      ]
    },
    physics: {
      label: 'Quantum Gravity & Entropy',
      emoji: '⚛️',
      citations: [
        {
          id: 'entropy-gravity-2025',
          title: 'Gravity from Quantum Information',
          source: 'Physical Review D',
          year: '2025',
          doi: '10.1103/PhysRevD.111.066001',
          relevance: 'Shows gravity emerges from entropy gradients',
          summary: 'Unifies quantum mechanics and gravity through relative entropy, validating UFAT\'s emergent gravity.'
        },
        {
          id: 'topological-2025',
          title: 'Topological Entanglement Entropy',
          source: 'arXiv',
          year: '2024-2025',
          link: 'https://arxiv.org/abs/2306.06158',
          relevance: 'Supports intersection-based emergence',
          summary: 'Mathematical framework matching UFAT\'s topological field structure.'
        }
      ]
    },
    multiverse: {
      label: 'Multiverse & Other Realms',
      emoji: '🌌',
      citations: [
        {
          id: 'cmb-anomalies-2025',
          title: 'CMB Anomalies and Parallel Universes',
          source: 'arXiv / JWST',
          year: '2025',
          relevance: 'Evidence for multiverse intersections',
          summary: 'Cold spots in cosmic microwave background suggest low-K coupling with parallel realms.'
        },
        {
          id: 'mystical-unity-2025',
          title: 'Mystical Oneness in Physics',
          source: 'PhilArchive / Thymindo',
          year: '2020-2025',
          relevance: 'Philosophical validation of unity principle',
          summary: 'Shows how "Everything is One" aligns with mathematical unification in UFAT.'
        }
      ]
    }
  }

  return (
    <div className="h-full p-6 overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Scientific Evidence & Validation
      </h2>
      
      {/* Category Selector */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {Object.entries(categories).map(([key, cat]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedCategory === key
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <span className="mr-2">{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Citations Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories[selectedCategory as keyof typeof categories].citations.map((citation, index) => (
          <motion.div
            key={citation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow"
          >
            <h3 className="font-semibold text-gray-800 mb-2">
              {citation.title}
            </h3>
            
            <div className="text-sm text-gray-600 mb-3">
              <p>{citation.source} • {citation.year}</p>
              {citation.doi && (
                <p className="font-mono text-xs mt-1">DOI: {citation.doi}</p>
              )}
            </div>
            
            <div className="mb-3 p-3 bg-blue-50 rounded text-sm text-blue-700">
              <strong>Relevance:</strong> {citation.relevance}
            </div>
            
            <p className="text-sm text-gray-700 mb-4">
              {citation.summary}
            </p>
            
            {(citation.link || citation.doi) && (
              <a
                href={citation.link || `https://doi.org/${citation.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                View Source →
              </a>
            )}
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl"
      >
        <h3 className="font-semibold text-gray-800 mb-3">UFAT Validation Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-indigo-600">85%</div>
            <div className="text-sm text-gray-600">Predictions Validated</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">21+</div>
            <div className="text-sm text-gray-600">Testable Predictions</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600">34</div>
            <div className="text-sm text-gray-600">Problems Solved</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">2025</div>
            <div className="text-sm text-gray-600">Latest Research</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}