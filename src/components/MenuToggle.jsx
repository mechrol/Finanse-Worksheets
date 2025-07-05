import React from 'react'
import { motion } from 'framer-motion'
import { Menu, Tractor } from 'lucide-react'

const MenuToggle = ({ isOpen, onToggle, showFarmIndicator = false }) => {
  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed top-4 left-4 z-50 p-3 glass-card rounded-xl lg:hidden"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <Menu className="h-6 w-6 text-white" />
        
        {/* Farm Ledger Indicator */}
        {showFarmIndicator && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 p-1 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full"
          >
            <Tractor className="h-3 w-3 text-white" />
          </motion.div>
        )}
      </div>
      
      {/* Tooltip */}
      <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Open Navigation Menu
      </div>
    </motion.button>
  )
}

export default MenuToggle
