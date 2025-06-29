import React, { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { 
  DollarSign, 
  Calendar, 
  Tag, 
  FileText, 
  Plus,
  Camera,
  Repeat
} from 'lucide-react'

const TransactionForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    recurring: false,
    recurringPeriod: 'monthly'
  })

  const expenseCategories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Travel',
    'Other'
  ]

  const incomeCategories = [
    'Salary',
    'Freelance',
    'Investment',
    'Business',
    'Other'
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.amount || !formData.category || !formData.description) {
      toast.error('Please fill in all required fields')
      return
    }

    const transaction = {
      ...formData,
      amount: parseFloat(formData.amount),
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }

    try {
      await onSubmit(transaction)
      toast.success(`${formData.type === 'income' ? 'Income' : 'Expense'} added successfully!`)
      
      // Reset form
      setFormData({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        recurring: false,
        recurringPeriod: 'monthly'
      })
    } catch (error) {
      toast.error('Failed to add transaction')
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card"
      >
        <div className="flex items-center space-x-2 mb-8">
          <Plus className="h-6 w-6 text-blue-400" />
          <h2 className="text-2xl font-bold gradient-text">Add New Transaction</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction Type */}
          <div className="flex space-x-4">
            <motion.button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'expense', category: '' }))}
              className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 ${
                formData.type === 'expense'
                  ? 'border-red-400 bg-red-500/20 text-red-400'
                  : 'border-white/20 bg-white/5 text-white/70 hover:border-red-400/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">💸</div>
                <div className="font-semibold">Expense</div>
              </div>
            </motion.button>

            <motion.button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'income', category: '' }))}
              className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 ${
                formData.type === 'income'
                  ? 'border-green-400 bg-green-500/20 text-green-400'
                  : 'border-white/20 bg-white/5 text-white/70 hover:border-green-400/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">💰</div>
                <div className="font-semibold">Income</div>
              </div>
            </motion.button>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/90">
              <DollarSign className="inline h-4 w-4 mr-1" />
              Amount *
            </label>
            <div className="relative">
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="0.00"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                required
              />
              <div className="absolute left-3 top-3 text-white/50">$</div>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/90">
              <Tag className="inline h-4 w-4 mr-1" />
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
              required
            >
              <option value="">Select a category</option>
              {(formData.type === 'expense' ? expenseCategories : incomeCategories).map(category => (
                <option key={category} value={category} className="bg-slate-800">
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/90">
              <FileText className="inline h-4 w-4 mr-1" />
              Description *
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter transaction description"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
              required
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/90">
              <Calendar className="inline h-4 w-4 mr-1" />
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
            />
          </div>

          {/* Recurring Transaction */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="recurring"
                checked={formData.recurring}
                onChange={handleChange}
                className="w-4 h-4 text-blue-400 bg-white/10 border-white/20 rounded focus:ring-blue-400"
              />
              <label className="text-sm font-medium text-white/90 flex items-center">
                <Repeat className="h-4 w-4 mr-1" />
                Recurring Transaction
              </label>
            </div>

            {formData.recurring && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium text-white/90">
                  Recurring Period
                </label>
                <select
                  name="recurringPeriod"
                  value={formData.recurringPeriod}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                >
                  <option value="weekly" className="bg-slate-800">Weekly</option>
                  <option value="monthly" className="bg-slate-800">Monthly</option>
                  <option value="yearly" className="bg-slate-800">Yearly</option>
                </select>
              </motion.div>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${
              formData.type === 'expense'
                ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
            } shadow-lg hover:shadow-xl transform hover:scale-105`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Add {formData.type === 'income' ? 'Income' : 'Expense'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}

export default TransactionForm
