import type { Metadata } from 'next'
import { Inter, Instrument_Serif } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
})

export const metadata: Metadata = {
  title: 'CreatorOS — 7 days of content, planned in 60 seconds',
  description:
    'Answer 5 questions. Get hooks, scripts, captions, and hashtags for an entire week of TikTok, Reels, and Shorts.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable}`}
    >
      <body className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA] antialiased font-sans">
        {children}
      </body>
    </html>
  )
}