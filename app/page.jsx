'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Header from './components/Header'
import Footer from './components/Footer'
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Header />
      <motion.div 
        className="flex-grow flex items-center justify-center px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold text-white mb-6">
            Welcome to MoodMap
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover the power of sentiment analysis with our advanced AI-driven platform. 
            Gain valuable insights from your customer reviews and make data-driven decisions.
          </p>
          <motion.div
            className="flex flex-col items-center gap-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex gap-4 justify-center">
              <Link href="/dashboard">
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform transition hover:scale-105"
                >
                  Try It Out
                </Button>
              </Link>
              <Link href="/dashboard1">
                <Button
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform transition hover:scale-105"
                >
                  Upload CSV File
                </Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Footer />
      </motion.div>
    </div>
  )
}
