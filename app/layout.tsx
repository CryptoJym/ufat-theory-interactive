import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'UFAT - Universal Field Theory | Interactive Experience',
  description: 'Explore the Universal Field Approximation Theory through interactive 3D visualizations, thought experiments, and trauma-informed learning. Discover how everything is connected.',
  keywords: 'universal field theory, UFAT, quantum consciousness, unity, physics visualization, interactive science',
  metadataBase: new URL('https://ufat-vercel.vercel.app'),
  openGraph: {
    title: 'Universal Field Approximation Theory',
    description: 'Interactive experience explaining how everything is connected through one unified field',
    type: 'website',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-b from-indigo-50 to-purple-50`}>
        {children}
      </body>
    </html>
  )
}