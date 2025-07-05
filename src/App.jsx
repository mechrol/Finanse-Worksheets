import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import Dashboard from './components/Dashboard'
import TransactionForm from './components/TransactionForm'
import Analytics from './components/Analytics'
import TransactionList from './components/TransactionList'
import Worksheets from './components/Worksheets'
import Checklists from './components/Checklists'
import Navigation from './components/Navigation'
import { useExpenseData } from './hooks/useExpenseData'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const { transactions, addTransaction, deleteTransaction, updateTransaction, loading } = useExpenseData()

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { id: 'transactions', label: 'Transactions', icon: 'Receipt' },
    { id: 'worksheets', label: 'Worksheets', icon: 'FileSpreadsheet' },
    { id: 'checklists', label: 'Checklists', icon: 'CheckSquare' },
    { id: 'analytics', label: 'Analytics', icon: 'TrendingUp' },
    { id: 'add', label: 'Add Expense', icon: 'Plus' }
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
        return <Checklists />
      case 'analytics':
        return <Analytics transactions={transactions} />
      case 'add':
        return <TransactionForm onSubmit={addTransaction} />
      default:
        return <Dashboard transactions={transactions} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10">
        <Navigation 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        
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
                  <div className="glass-card">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
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
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
          },
        }}
      />
    </div>
  )
}

export default App
