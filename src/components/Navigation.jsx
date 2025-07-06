import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Receipt, 
  TrendingUp, 
  Plus,
  Wallet,
  FileSpreadsheet,
  CheckSquare,
  Tractor,
  User,
  LogOut,
  ChevronDown,
  Menu
} from 'lucide-react'

const iconMap = {
  LayoutDashboard,
  Receipt,
  TrendingUp,
  Plus,
  Wallet,
  FileSpreadsheet,
  CheckSquare,
  Tractor
}

const Navigation = ({ tabs, activeTab, onTabChange, user, onSignOut }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [featuresMenuOpen, setFeaturesMenuOpen] = useState(false)

  // Separate dashboard from other features
  const dashboardTab = tabs.find(tab => tab.id === 'dashboard')
  const addTab = tabs.find(tab => tab.id === 'add')
  const otherTabs = tabs.filter(tab => !['dashboard', 'add'].includes(tab.id))

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
            <h1 className="text-xl font-bold gradient-text">SpendTracker</h1>
          </motion.div>

          <div className="flex items-center space-x-4">
            {/* Main Navigation */}
            <div className="flex items-center space-x-2">
              {/* Dashboard */}
              <motion.button
                onClick={() => onTabChange('dashboard')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                  activeTab === 'dashboard' 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">Dashboard</span>
              </motion.button>

              {/* Add Transaction */}
              <motion.button
                onClick={() => onTabChange('add')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                  activeTab === 'add' 
                    ? 'bg-green-500/20 text-green-400 border border-green-400/50' 
                    : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">Add</span>
              </motion.button>

              {/* Features Dropdown */}
              <div className="relative">
                <motion.button
                  onClick={() => setFeaturesMenuOpen(!featuresMenuOpen)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Menu className="h-4 w-4 text-white/70" />
                  <span className="hidden sm:inline text-sm text-white/70">More</span>
                  <ChevronDown className={`h-4 w-4 text-white/70 transition-transform ${
                    featuresMenuOpen ? 'rotate-180' : ''
                  }`} />
                </motion.button>

                <AnimatePresence>
                  {featuresMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 glass-card rounded-xl py-2 shadow-xl"
                    >
                      <div className="px-4 py-2 border-b border-white/10">
                        <p className="text-sm font-medium text-white/80">Advanced Features</p>
                        <p className="text-xs text-white/50">Additional tools & reports</p>
                      </div>
                      
                      {otherTabs.map((tab) => {
                        const Icon = iconMap[tab.icon]
                        return (
                          <button
                            key={tab.id}
                            onClick={() => {
                              onTabChange(tab.id)
                              setFeaturesMenuOpen(false)
                            }}
                            className={`w-full px-4 py-3 text-left hover:bg-white/10 transition-colors flex items-center space-x-3 ${
                              activeTab === tab.id ? 'bg-white/10 text-white' : 'text-white/70'
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            <div>
                              <div className="text-sm font-medium">{tab.label}</div>
                              <div className="text-xs text-white/50">
                                {tab.id === 'transactions' && 'View all transactions'}
                                {tab.id === 'analytics' && 'Charts & insights'}
                                {tab.id === 'worksheets' && 'Financial planning'}
                                {tab.id === 'checklists' && 'Task management'}
                                {tab.id === 'farm' && 'Agricultural expenses'}
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* User Menu */}
            <div className="relative">
              <motion.button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="hidden md:inline text-sm text-white">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                </span>
                <ChevronDown className={`h-4 w-4 text-white/70 transition-transform ${
                  userMenuOpen ? 'rotate-180' : ''
                }`} />
              </motion.button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 glass-card rounded-xl py-2 shadow-xl"
                  >
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="text-sm font-medium text-white">
                        {user?.user_metadata?.full_name || 'User'}
                      </p>
                      <p className="text-xs text-white/60">{user?.email}</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        onSignOut()
                        setUserMenuOpen(false)
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
