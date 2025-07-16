'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

interface Props {
  simplified: boolean
}

export default function FormalTheory({ simplified }: Props) {
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  const toggleSection = (id: string) => {
    setExpandedSections(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const sections = [
    {
      id: 'unity',
      title: 'Unity of the Field',
      emoji: '🌌',
      simple: 'Everything is one connected field, like an infinite ocean.',
      formal: `Reality is a single topological (∞,1)-category:
$$\\mathcal{F} = (\\text{Obj}, \\text{Mor}, \\otimes, \\mathbb{1})$$
where all objects, morphisms, and structures exist in superposition.`,
      insight: 'This means separation is an illusion - everything is fundamentally connected.'
    },
    {
      id: 'intersection',
      title: 'Intersection & Coupling',
      emoji: '🔗',
      simple: 'Things become real when they connect strongly enough.',
      formal: `Coupling between phase spaces:
$$K(P_i, P_j) = \\frac{\\mu(P_{ij})}{\\min\\{\\mu(P_i), \\mu(P_j)\\}} \\in [0,1]$$
where $\\mu$ is quantum relative entropy.`,
      insight: 'High coupling (K→1) means unity, low coupling (K→0) means separation.'
    },
    {
      id: 'consciousness',
      title: 'Consciousness Emergence',
      emoji: '🧠',
      simple: 'Consciousness happens when something refers back to itself.',
      formal: `A subsystem $P_i$ is conscious iff:
$$\\exists C_i \\subseteq P_i : \\iota_{C_i}^* \\mathbb{1} \\cong \\mathbb{1}$$
Self-referential embedding preserves the terminal object.`,
      insight: 'Your awareness is the universe looking at itself through you.'
    },
    {
      id: 'gravity',
      title: 'Emergent Gravity',
      emoji: '🌍',
      simple: 'Gravity comes from information differences in space.',
      formal: `Gravity emerges from entropy:
$$S_{\\text{ent}} = \\int \\sqrt{-g} \\, d^4x \\, [R + \\Lambda(S) + S(\\hat{g} \\| g_m)]$$
Relative entropy between quantum and matter metrics.`,
      insight: 'Space curves where information density changes.'
    }
  ]

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          The Mathematical Framework
        </h2>
        
        {simplified && (
          <div className="mb-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-blue-700">
              📌 Simplified mode active - showing intuitive explanations alongside math
            </p>
          </div>
        )}

        <div className="space-y-4">
          {sections.map((section) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{section.emoji}</span>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {section.title}
                    </h3>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedSections.includes(section.id) ? 180 : 0 }}
                    className="text-gray-400"
                  >
                    ▼
                  </motion.div>
                </div>
                {!expandedSections.includes(section.id) && (
                  <p className="mt-2 text-gray-600 ml-12">{section.simple}</p>
                )}
              </button>

              <AnimatePresence>
                {expandedSections.includes(section.id) && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      {simplified && (
                        <div className="mb-4 p-4 bg-indigo-50 rounded-lg">
                          <p className="text-indigo-700">{section.simple}</p>
                        </div>
                      )}
                      
                      <div className="prose prose-lg max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                        >
                          {section.formal}
                        </ReactMarkdown>
                      </div>
                      
                      <div className="mt-4 p-4 bg-green-50 rounded-lg">
                        <p className="text-green-700">
                          <strong>What this means:</strong> {section.insight}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Core Identity Equation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            The Core Identity Equation
          </h3>
          {simplified ? (
            <div className="space-y-4">
              <p className="text-gray-700">
                This equation captures how strongly two things are connected:
              </p>
              <div className="p-4 bg-white rounded-lg">
                <p className="font-mono text-center">
                  Connection = Overlap × Information × Structure
                </p>
              </div>
              <p className="text-gray-600 text-sm">
                When connection approaches 1, things become unified. When it approaches 0, they separate.
              </p>
            </div>
          ) : (
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {`$$\\Psi_{\\text{identity}}(P_i, P_j) = \\lim_{\\cap \\to 1} K(P_i, P_j) \\cdot \\exp(-S(\\rho_{ij} \\| \\sigma_{ij})) \\cdot \\text{CS}(\\iota_{ij})$$`}
              </ReactMarkdown>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}