import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'MoodMap - Sentiment Analysis',
  description: 'Uncover the emotions behind your text with our advanced sentiment analysis model.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} flex flex-col min-h-screen`}>{children}</body>
    </html>
  )
}

