import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'UFAT - Universal Field Theory',
  description: 'Discover the unity of all existence through interactive visualizations',
  keywords: 'unity, connection, physics, consciousness, healing',
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