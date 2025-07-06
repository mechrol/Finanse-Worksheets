import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import Dashboard from './components/Dashboard'
import TransactionForm from './components/TransactionForm'
import Analytics from './components/Analytics'
import TransactionList from './components/TransactionList'
import Worksheets from './components/Worksheets'
import ChecklistTab from './components/ChecklistTab'
import FarmLedger from './components/FarmLedger'
import Navigation from './components/Navigation'
import AuthPage from './components/AuthPage'
import { useExpenseData } from './hooks/useExpenseData'
import { useAuth } from './hooks/useAuth'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const { transactions, addTransaction, deleteTransaction, updateTransaction, loading } = useExpenseData()
  const { user, loading: authLoading, signOut } = useAuth()

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { id: 'add', label: 'Add Expense', icon: 'Plus' },
    { id: 'transactions', label: 'Transactions', icon: 'Receipt' },
    { id: 'analytics', label: 'Analytics', icon: 'TrendingUp' },
    { id: 'worksheets', label: 'Worksheets', icon: 'FileSpreadsheet' },
    { id: 'checklists', label: 'Checklists', icon: 'CheckSquare' },
    { id: 'farm', label: 'Farm Ledger', icon: 'Tractor' }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard transactions={transactions} />
      case 'transactions':
        return <TransactionList 
          transactions={transactions} 
          onDelete={deleteTransaction}
          onUpdate={updateTransaction}
        />
      case 'worksheets':
        return <Worksheets transactions={transactions} />
      case 'checklists':
        return <ChecklistTab />
      case 'farm':
        return <FarmLedger />
      case 'analytics':
        return <Analytics transactions={transactions} />
      case 'add':
        return <TransactionForm onSubmit={addTransaction} />
      default:
        return <Dashboard transactions={transactions} />
    }
  }

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <motion.div 
            className="rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: '#7F00FF' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    )
  }

  // Show auth page if user is not authenticated
  if (!user) {
    return <AuthPage />
  }

  return (
    <div className="min-h-screen">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          style={{ background: 'radial-gradient(circle, #7F00FF 0%, transparent 70%)' }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-15"
          style={{ background: 'radial-gradient(circle, #B347D9 0%, transparent 70%)' }}
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <Navigation 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          user={user}
          onSignOut={signOut}
        />
        
        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="glass-card p-8 text-center">
                    <motion.div 
                      className="rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
                      style={{ borderColor: '#7F00FF' }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <p className="text-white/70">Loading transactions...</p>
                  </div>
                </div>
              ) : (
                renderContent()
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(127, 0, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(127, 0, 255, 0.3)',
            color: 'white',
            boxShadow: '0 8px 32px rgba(127, 0, 255, 0.2)',
          },
        }}
      />
    </div>
  )
}

export default App
