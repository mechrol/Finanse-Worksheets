import React from 'react'
import { motion } from 'framer-motion'
import { Globe, Languages } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const LanguageToggle = ({ className = '' }) => {
  const { language, toggleLanguage, isPolish } = useLanguage()

  return (
    <motion.button
      onClick={toggleLanguage}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 ${className}`}
      title={isPolish ? 'Przełącz na angielski' : 'Switch to Polish'}
    >
      <Globe className="h-4 w-4 text-white/70" />
      <div className="flex items-center space-x-1">
        <span className={`text-xs font-medium transition-colors ${
          isPolish ? 'text-white' : 'text-white/50'
        }`}>
          PL
        </span>
        <div className="w-px h-3 bg-white/30" />
        <span className={`text-xs font-medium transition-colors ${
          !isPolish ? 'text-white' : 'text-white/50'
        }`}>
          EN
        </span>
      </div>
      
      {/* Active indicator */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg"
        initial={false}
        animate={{
          opacity: 0,
        }}
        whileHover={{
          opacity: 1,
        }}
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  )
}

export default LanguageToggle
