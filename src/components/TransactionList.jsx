import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  ArrowUpRight, 
  ArrowDownLeft,
  Calendar,
  DollarSign
} from 'lucide-react'
import toast from 'react-hot-toast'

const TransactionList = ({ transactions, onDelete, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')

  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === 'all' || transaction.type === filterType
      const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory
      
      return matchesSearch && matchesType && matchesCategory
    })
    .sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy) {
        case 'amount':
          aValue = a.amount
          bValue = b.amount
          break
        case 'category':
          aValue = a.category
          bValue = b.category
          break
        default:
          aValue = new Date(a.date)
          bValue = new Date(b.date)
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const categories = [...new Set(transactions.map(t => t.category))]

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await onDelete(id)
        toast.success('Transaction deleted successfully')
      } catch (error) {
        toast.error('Failed to delete transaction')
      }
    }
  }

  const getCategoryIcon = (category) => {
    const icons = {
      'Food & Dining': '🍽️',
      'Transportation': '🚗',
      'Shopping': '🛍️',
      'Entertainment': '🎬',
      'Bills & Utilities': '💡',
      'Healthcare': '🏥',
      'Travel': '✈️',
      'Other': '📝',
      'Salary': '💰',
      'Freelance': '💻',
      'Investment': '📈'
    }
    return icons[category] || '💳'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold gradient-text mb-2">Transaction History</h2>
        <p className="text-white/70">Manage and track all your financial transactions</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass-card"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-white/50" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="all" className="bg-slate-800">All Types</option>
            <option value="income" className="bg-slate-800">Income</option>
            <option value="expense" className="bg-slate-800">Expenses</option>
          </select>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="all" className="bg-slate-800">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category} className="bg-slate-800">
                {category}
              </option>
            ))}
          </select>

          {/* Sort */}
          <div className="flex space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="date" className="bg-slate-800">Date</option>
              <option value="amount" className="bg-slate-800">Amount</option>
              <option value="category" className="bg-slate-800">Category</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Transaction List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-card"
      >
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 text-white/50">
            <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No transactions found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.01, x: 5 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {getCategoryIcon(transaction.category)}
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-white">{transaction.description}</h4>
                      <div className="flex items-center space-x-2 text-sm text-white/60">
                        <span>{transaction.category}</span>
                        <span>•</span>
                        <Calendar className="h-3 w-3" />
                        <span>{format(new Date(transaction.date), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className={`font-semibold text-lg ${
                        transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}
                        ${transaction.amount.toFixed(2)}
                      </p>
                      <div className="flex items-center space-x-1 text-xs text-white/50">
                        {transaction.type === 'income' ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownLeft className="h-3 w-3" />
                        )}
                        <span>{transaction.type}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Summary */}
      {filteredTransactions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-white/70 mb-1">Total Transactions</p>
              <p className="text-2xl font-bold text-white">{filteredTransactions.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-white/70 mb-1">Total Income</p>
              <p className="text-2xl font-bold text-green-400">
                +${filteredTransactions
                  .filter(t => t.type === 'income')
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-white/70 mb-1">Total Expenses</p>
              <p className="text-2xl font-bold text-red-400">
                -${filteredTransactions
                  .filter(t => t.type === 'expense')
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default TransactionList
