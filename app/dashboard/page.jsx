'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Button } from "@/components/ui/button"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const COLORS = ['#4CAF50', '#F44336', '#FFC107']

export default function Dashboard() {
  const [showVisualization, setShowVisualization] = useState(false)
  const [data, setData] = useState({ pieData: [], keywords: [] })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadVisualization = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/sentiment')
      const result = await response.json()
      if (response.ok) {
        setData(result)
        setShowVisualization(true)
      } else {
        throw new Error(result.error || 'Failed to fetch data')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 p-8 rounded-lg shadow-lg"
        >
          <h1 className="text-3xl font-bold mb-6">MoodMap Dashboard</h1>
          <p className="mb-4">Welcome to your sentiment analysis dashboard. Click the button below to load your visualization.</p>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-4">
              Error: {error}
            </div>
          )}

          <Button
            onClick={loadVisualization}
            disabled={loading}
            className={`bg-blue-500 hover:bg-blue-600 mb-8 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Loading...' : 'Load Visualization'}
          </Button>

          {showVisualization && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Pie Chart */}
                <div className="bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Sentiment Distribution</h3>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percentage }) => `${name} ${percentage}%`}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {data.pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Keywords */}
                <div className="bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Top Keywords</h3>
                  <div className="space-y-3">
                    {data.keywords.map((item, index) => (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        key={index}
                        className="flex items-center justify-between bg-gray-600 p-3 rounded-lg"
                      >
                        <span>{item.name}</span>
                        <span className="bg-blue-500 px-3 py-1 rounded-full text-sm">
                          {item.value}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
