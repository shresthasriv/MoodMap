import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Header({ isLoggedIn = false }) {
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="py-6 border-b border-white/10"
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-sm uppercase tracking-widest">
          MoodMap
        </Link>
        <nav className="flex items-center space-x-8">
          <ul className="flex space-x-8">
            <li>
              <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-200 uppercase tracking-widest">
                About
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-200 uppercase tracking-widest">
                Contact
              </Link>
            </li>
            {isLoggedIn && (
              <li>
                <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors duration-200 uppercase tracking-widest">
                  Dashboard
                </Link>
              </li>
            )}
          </ul>
          {isLoggedIn ? (
            <Button variant="outline" className="text-sm uppercase tracking-widest px-6 py-2 border border-white/20 hover:border-white rounded-none bg-transparent hover:bg-white hover:text-black transition-all duration-200">
              Log Out
            </Button>
          ) : (
            <>
              <Button variant="outline" className="text-sm uppercase tracking-widest px-6 py-2 border border-white/20 hover:border-white rounded-none bg-transparent hover:bg-white hover:text-black transition-all duration-200">
                Log In
              </Button>
              <Button variant="default" className="text-sm uppercase tracking-widest px-6 py-2 border border-white rounded-none bg-white text-black hover:bg-transparent hover:text-white transition-all duration-200">
                Sign Up
              </Button>
            </>
          )}
        </nav>
      </div>
    </motion.header>
  )
}
