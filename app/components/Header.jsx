import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Header({ isLoggedIn = false }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 py-4"
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-400">
          MoodMap
        </Link>
        <nav className="flex items-center space-x-4">
          <ul className="flex space-x-4">
            <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link href="#" className="text-gray-300 hover:text-white">
                About
              </Link>
            </motion.li>
            <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link href="#" className="text-gray-300 hover:text-white">
                Contact
              </Link>
            </motion.li>
            {isLoggedIn && (
              <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Link href="/dashboard" className="text-gray-300 hover:text-white">
                  Dashboard
                </Link>
              </motion.li>
            )}
          </ul>
          {isLoggedIn ? (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" className="text-gray-300 hover:text-white">
                Log Out
              </Button>
            </motion.div>
          ) : (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" className="text-gray-300 hover:text-white">
                  Log In
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="default" className="bg-blue-500 hover:bg-blue-600 text-white">
                  Sign Up
                </Button>
              </motion.div>
            </>
          )}
        </nav>
      </div>
    </motion.header>
  )
}

