'use client'

import { motion } from 'framer-motion'
import Header from './components/Header'
import Footer from './components/Footer'
import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center">
        <LandingContent />
      </main>
      <Footer />
    </div>
  )
}

function LandingContent() {
  return (
    <div className="flex w-full">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-3/5 pr-8"
      >
        <h1 className="text-4xl font-bold mb-4">Welcome to MoodMap</h1>
        <p className="text-xl mb-8">
          Uncover the emotions behind your text with our advanced sentiment analysis model. 
          MoodMap provides real-time insights into the emotional tone of your content, 
          helping you make data-driven decisions and understand your audience better.
        </p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/login" className="inline-block bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-semibold">
            Try It Out
          </Link>
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-2/5"
      >
        <img src="/placeholder.svg" alt="MoodMap Visualization" className="w-full h-auto rounded-lg shadow-lg" />
      </motion.div>
    </div>
  )
}

