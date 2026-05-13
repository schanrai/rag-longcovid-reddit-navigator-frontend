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
  title: 'Long Covid Compass',
  description: 'Navigate Long COVID through real-world experiences. AI-powered insights from thousands of Reddit discussions.',
  openGraph: {
    title: 'Long Covid Compass',
    description: 'Navigate Long COVID through real-world experiences. AI-powered insights from thousands of Reddit discussions.',
    url: 'https://rag-longcovid-reddit-navigator-fron.vercel.app',
    siteName: 'Long Covid Compass',
    images: [
      {
        url: '/og-image.png',
        width: 1440,
        height: 560,
        alt: 'Long Covid Compass — Navigate Long COVID through real-world experiences',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Long Covid Compass',
    description: 'Navigate Long COVID through real-world experiences. AI-powered insights from thousands of Reddit discussions.',
    images: ['/og-image.png'],
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
