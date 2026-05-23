import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Long Covid Compass — Navigate Long COVID through real experiences',
  description: 'Navigate Long COVID through real-world experiences. AI-powered insights from thousands of online community discussions.',
  openGraph: {
    title: 'Long Covid Compass — Navigate Long COVID through real experiences',
    description: 'Navigate Long COVID through real-world experiences. AI-powered insights from thousands of online community discussions.',
    url: 'https://rag-longcovid-reddit-navigator-fron.vercel.app',
    siteName: 'Long Covid Compass',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Long Covid Compass — Navigate Long COVID through real-world experiences',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Long Covid Compass — Navigate Long COVID through real experiences',
    description: 'Navigate Long COVID through real-world experiences. AI-powered insights from thousands of online community discussions.',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
