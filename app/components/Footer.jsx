import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 py-4 mt-auto"
    >
      <div className="container mx-auto px-4 text-center text-gray-400">
        <p>&copy; 2023 MoodMap. All rights reserved.</p>
      </div>
    </motion.footer>
  )
}

