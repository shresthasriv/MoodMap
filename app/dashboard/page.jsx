'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Button } from "@/components/ui/button"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import AnimatedBackground from '../components/AnimatedBackground'

const COLORS = ['#4CAF50', '#F44336', '#FFC107']
const SENTIMENT_COLORS = {
  positive: '#4CAF50',
  negative: '#F44336',
  neutral: '#FFC107'
}

const SENTIMENT_ICONS = {
  Positive: '↑',
  Negative: '↓',
  Neutral: '−'
}

export default function Dashboard() {
  const [showVisualization, setShowVisualization] = useState(false)
  const [data, setData] = useState({ 
    pieData: [], 
    keywordSentiments: []
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadVisualization = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/sentiment')
      const result = await response.json()
      if (response.ok) {
        console.log('API Response:', result)
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

  const analyzeScrapedQuotes = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/automated-flow')
      const result = await response.json()
      if (response.ok) {
        console.log('API Response:', result)
        setData(result)
        setShowVisualization(true)
      } else {
        throw new Error(result.error || 'Failed to analyze scraped quotes')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <AnimatedBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-16 flex flex-row">
          <div className="flex flex-col w-1/4 pr-4">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <div className="flex flex-col gap-4">
              <Button
                onClick={loadVisualization}
                disabled={loading}
                className={`bg-black text-white hover:bg-gray-800 transition-all duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:scale-105'} border-none py-2 px-4 text-sm w-32`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </span>
                ) : 'Load Sample Data'}
              </Button>

              <Button
                onClick={analyzeScrapedQuotes}
                disabled={loading}
                className={`bg-black text-white hover:bg-gray-800 transition-all duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:scale-105'} border-none py-2 px-4 text-sm w-48`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : 'Analyze Scraped Quotes'}
              </Button>
            </div>
          </div>
          <div className="flex-grow">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-center space-y-12 flex-grow flex flex-col justify-center"
            >
              {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-4">
                  Error: {error}
                </div>
              )}
              {showVisualization && data.pieData && data.pieData.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {data.pieData.map((item) => (
                      <div key={item.name} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-400 text-sm">{item.name} Sentiment</p>
                            <p className="text-2xl font-bold mt-1">{item.percentage}%</p>
                            <p className="text-gray-400 text-sm mt-1">{item.value} reviews</p>
                          </div>
                          <div className={`text-4xl ${
                            item.name === 'Positive' ? 'text-green-500' : 
                            item.name === 'Negative' ? 'text-red-500' : 
                            'text-yellow-500'
                          }`}>{SENTIMENT_ICONS[item.name]}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Charts Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Pie Chart */}
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-6">Overall Sentiment Distribution</h3>
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
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'rgba(17, 24, 39, 0.8)',
                                border: '1px solid rgba(75, 85, 99, 0.4)',
                                borderRadius: '8px',
                                backdropFilter: 'blur(4px)'
                              }}
                            />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Sentiment Correlation Graph */}
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-6">Top 5 Keywords Sentiment Distribution</h3>
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={data.keywordSentiments}
                            margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
                            layout="vertical"
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(75, 85, 99, 0.3)" />
                            <XAxis type="number" tick={{ fill: '#fff' }} />
                            <YAxis 
                              dataKey="name" 
                              type="category"
                              width={120}
                              tick={{ fill: '#fff' }}
                            />
                            <Tooltip
                              contentStyle={{ 
                                backgroundColor: 'rgba(17, 24, 39, 0.8)',
                                border: '1px solid rgba(75, 85, 99, 0.4)',
                                borderRadius: '8px',
                                backdropFilter: 'blur(4px)'
                              }}
                              labelStyle={{ color: '#fff' }}
                            />
                            <Legend />
                            <Bar dataKey="sentiments.positive" stackId="sentiments" name="Positive" fill={SENTIMENT_COLORS.positive} />
                            <Bar dataKey="sentiments.negative" stackId="sentiments" name="Negative" fill={SENTIMENT_COLORS.negative} />
                            <Bar dataKey="sentiments.neutral" stackId="sentiments" name="Neutral" fill={SENTIMENT_COLORS.neutral} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
