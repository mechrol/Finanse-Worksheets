import React from 'react'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Receipt, 
  TrendingUp, 
  Plus,
  Wallet,
  FileSpreadsheet,
  CheckSquare
} from 'lucide-react'

const iconMap = {
  LayoutDashboard,
  Receipt,
  TrendingUp,
  Plus,
  Wallet,
  FileSpreadsheet,
  CheckSquare
}

const Navigation = ({ tabs, activeTab, onTabChange }) => {
  return (
    <nav className="glass border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Wallet className="h-8 w-8 text-blue-400" />
            <h1 className="text-xl font-bold gradient-text">ExpenseTracker Pro</h1>
          </motion.div>

          <div className="flex space-x-1">
            {tabs.map((tab, index) => {
              const Icon = iconMap[tab.icon]
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`relative px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                    activeTab === tab.id 
                      ? 'bg-white/20 text-white' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  
                  {activeTab === tab.id && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg"
                      layoutId="activeTab"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
