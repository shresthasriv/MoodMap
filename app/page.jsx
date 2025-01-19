'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Header from './components/Header'
import Footer from './components/Footer'
import AnimatedBackground from './components/AnimatedBackground'

export default function Home() {
  return (
    
    <div className="min-h-screen flex flex-col bg-black text-white">
      <AnimatedBackground />
      {/* Minimalist background pattern */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0" 
          style={{ 
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', 
            backgroundSize: '75px 75px'
          }} 
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow container mx-auto px-4 py-16 flex flex-col">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-center space-y-12 flex-grow flex flex-col justify-center"
          >
            <div className="space-y-6">
              <motion.h1 
                className="text-6xl md:text-7xl font-light tracking-tight"
                style={{ fontFamily: 'Roboto, sans-serif' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                MoodMap
              </motion.h1>
              
              <motion.p 
                className="text-lg text-gray-400 max-w-xl mx-auto font-light tracking-wide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Sentiment analysis, simplified.
              </motion.p>
            </div>

            <motion.div 
              className="flex flex-col md:flex-row gap-8 justify-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link href="/dashboard" 
                className="group px-8 py-3 border border-white/20 hover:border-white rounded-none transition-all duration-300 hover:bg-white hover:text-black"
              >
                <span className="text-sm tracking-widest uppercase">View Analytics</span>
              </Link>

              <Link href="/dashboard1"
                className="group px-8 py-3 border border-white/20 hover:border-white rounded-none transition-all duration-300 hover:bg-white hover:text-black"
              >
                <span className="text-sm tracking-widest uppercase">Upload Data</span>
              </Link>
            </motion.div>

            {/* Features Section */}
            <motion.div 
              className="grid md:grid-cols-3 gap-12 mt-24"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="space-y-4">
                <h3 className="text-sm uppercase tracking-widest">Analysis</h3>
                <p className="text-gray-500 text-sm font-light">Real-time sentiment processing with advanced AI models.</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm uppercase tracking-widest">Precision</h3>
                <p className="text-gray-500 text-sm font-light">Accurate sentiment detection powered by Azure AI.</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm uppercase tracking-widest">Insights</h3>
                <p className="text-gray-500 text-sm font-light">Clear visualization of sentiment patterns and trends.</p>
              </div>
            </motion.div>
          </motion.div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
