import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu,
  X,
  LayoutDashboard, 
  Receipt, 
  TrendingUp, 
  Plus,
  FileSpreadsheet,
  CheckSquare,
  Tractor,
  ChevronRight,
  Home
} from 'lucide-react'

const iconMap = {
  LayoutDashboard,
  Receipt,
  TrendingUp,
  Plus,
  FileSpreadsheet,
  CheckSquare,
  Tractor,
  Home
}

const Sidebar = ({ tabs, activeTab, onTabChange, isOpen, onToggle }) => {
  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: -280,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  }

  const overlayVariants = {
    open: {
      opacity: 1,
      visibility: "visible"
    },
    closed: {
      opacity: 0,
      visibility: "hidden",
      transition: {
        delay: 0.2
      }
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className="fixed left-0 top-0 h-full w-72 z-50 lg:z-30"
      >
        <div className="h-full glass-card rounded-none lg:rounded-r-2xl border-l-0">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500">
                <Tractor className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold gradient-text">Navigation</h2>
                <p className="text-xs text-white/60">Quick Access Menu</p>
              </div>
            </div>
            
            <motion.button
              onClick={onToggle}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors lg:hidden"
            >
              <X className="h-5 w-5 text-white" />
            </motion.button>
          </div>

          {/* Navigation Items */}
          <div className="p-4 space-y-2 overflow-y-auto flex-1">
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
                Main Navigation
              </h3>
              
              {tabs.map((tab, index) => {
                const Icon = iconMap[tab.icon] || Home
                const isActive = activeTab === tab.id
                
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => {
                      onTabChange(tab.id)
                      // Close sidebar on mobile after selection
                      if (window.innerWidth < 1024) {
                        onToggle()
                      }
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                      isActive 
                        ? 'bg-gradient-to-r from-purple-500/30 to-blue-500/30 text-white border border-purple-400/50' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`p-2 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-white/20' 
                        : 'bg-white/10 group-hover:bg-white/20'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 text-left">
                      <div className="font-medium">{tab.label}</div>
                      {tab.id === 'farm' && (
                        <div className="text-xs text-white/50">Agricultural Expenses</div>
                      )}
                      {tab.id === 'dashboard' && (
                        <div className="text-xs text-white/50">Overview & Stats</div>
                      )}
                      {tab.id === 'transactions' && (
                        <div className="text-xs text-white/50">Expense History</div>
                      )}
                      {tab.id === 'worksheets' && (
                        <div className="text-xs text-white/50">Financial Planning</div>
                      )}
                      {tab.id === 'checklists' && (
                        <div className="text-xs text-white/50">Task Management</div>
                      )}
                      {tab.id === 'analytics' && (
                        <div className="text-xs text-white/50">Reports & Insights</div>
                      )}
                      {tab.id === 'add' && (
                        <div className="text-xs text-white/50">New Transaction</div>
                      )}
                    </div>
                    
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="w-1 h-6 bg-gradient-to-b from-purple-400 to-blue-400 rounded-full"
                      />
                    )}
                    
                    <ChevronRight className={`h-4 w-4 transition-transform ${
                      isActive ? 'rotate-90' : 'group-hover:translate-x-1'
                    }`} />
                  </motion.button>
                )
              })}
            </div>

            {/* Farm Ledger Highlight */}
            <div className="mt-8 p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
                  <Tractor className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Farm Ledger</h4>
                  <p className="text-xs text-white/70">Track agricultural expenses</p>
                </div>
              </div>
              
              <p className="text-xs text-white/60 mb-3">
                Specialized tracking for seeds, equipment, fuel, labor, and more farming expenses.
              </p>
              
              <motion.button
                onClick={() => {
                  onTabChange('farm')
                  if (window.innerWidth < 1024) {
                    onToggle()
                  }
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'farm'
                    ? 'bg-green-500/30 text-green-300 border border-green-400/50'
                    : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                }`}
              >
                {activeTab === 'farm' ? 'Currently Active' : 'Open Farm Ledger'}
              </motion.button>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 p-4 bg-white/5 rounded-xl">
              <h4 className="text-sm font-semibold text-white/80 mb-3">Quick Stats</h4>
              <div className="space-y-2 text-xs text-white/60">
                <div className="flex justify-between">
                  <span>Active Features</span>
                  <span className="text-purple-400">{tabs.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Tab</span>
                  <span className="text-blue-400 capitalize">
                    {tabs.find(tab => tab.id === activeTab)?.label || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <div className="text-center">
              <p className="text-xs text-white/50">ExpenseTracker Pro</p>
              <p className="text-xs text-white/30">v2.0 - Farm Edition</p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default Sidebar
