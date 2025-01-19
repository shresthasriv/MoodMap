import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="py-6 border-t border-white/10"
    >
      <div className="container mx-auto px-4 text-center">
        <p className="text-xs text-gray-500 uppercase tracking-widest">&copy; 2025 MoodMap</p>
      </div>
    </motion.footer>
  )
}
