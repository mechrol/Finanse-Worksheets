import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Tractor, 
  Wheat, 
  Droplets, 
  Zap, 
  Wrench, 
  Users, 
  Truck, 
  Sprout,
  Plus,
  Calendar,
  DollarSign,
  TrendingUp,
  BarChart3,
  Download,
  Filter,
  Search,
  Edit,
  Trash2
} from 'lucide-react'
import { format, startOfYear, endOfYear, isWithinInterval } from 'date-fns'
import toast from 'react-hot-toast'

const FarmLedger = () => {
  const [farmExpenses, setFarmExpenses] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [editingExpense, setEditingExpense] = useState(null)
  const [viewMode, setViewMode] = useState('list') // 'list' or 'analytics'

  const farmCategories = {
    seeds: { label: 'Seeds & Plants', icon: Sprout, color: 'from-green-500 to-emerald-500' },
    fertilizer: { label: 'Fertilizer & Chemicals', icon: Droplets, color: 'from-blue-500 to-cyan-500' },
    equipment: { label: 'Equipment & Machinery', icon: Tractor, color: 'from-yellow-500 to-orange-500' },
    fuel: { label: 'Fuel & Energy', icon: Zap, color: 'from-red-500 to-pink-500' },
    maintenance: { label: 'Maintenance & Repairs', icon: Wrench, color: 'from-purple-500 to-indigo-500' },
    labor: { label: 'Labor & Wages', icon: Users, color: 'from-teal-500 to-cyan-500' },
    transport: { label: 'Transportation', icon: Truck, color: 'from-gray-500 to-slate-500' },
    feed: { label: 'Animal Feed', icon: Wheat, color: 'from-amber-500 to-yellow-500' }
  }

  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    category: 'seeds',
    description: '',
    amount: '',
    quantity: '',
    unit: '',
    supplier: '',
    notes: ''
  })

  // Load farm expenses from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('farmExpenses')
    if (saved) {
      setFarmExpenses(JSON.parse(saved))
    }
  }, [])

  // Save farm expenses to localStorage
  useEffect(() => {
    localStorage.setItem('farmExpenses', JSON.stringify(farmExpenses))
  }, [farmExpenses])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.description || !formData.amount) {
      toast.error('Please fill in required fields')
      return
    }

    const expense = {
      id: editingExpense ? editingExpense.id : Date.now(),
      ...formData,
      amount: parseFloat(formData.amount),
      quantity: formData.quantity ? parseFloat(formData.quantity) : null,
      createdAt: editingExpense ? editingExpense.createdAt : new Date().toISOString()
    }

    if (editingExpense) {
      setFarmExpenses(prev => prev.map(exp => exp.id === editingExpense.id ? expense : exp))
      toast.success('Farm ledger entry updated successfully!')
      setEditingExpense(null)
    } else {
      setFarmExpenses(prev => [expense, ...prev])
      toast.success('Farm ledger entry added successfully!')
    }

    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      category: 'seeds',
      description: '',
      amount: '',
      quantity: '',
      unit: '',
      supplier: '',
      notes: ''
    })
    setShowAddForm(false)
  }

  const handleEdit = (expense) => {
    setFormData({
      date: expense.date,
      category: expense.category,
      description: expense.description,
      amount: expense.amount.toString(),
      quantity: expense.quantity ? expense.quantity.toString() : '',
      unit: expense.unit || '',
      supplier: expense.supplier || '',
      notes: expense.notes || ''
    })
    setEditingExpense(expense)
    setShowAddForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this farm ledger entry?')) {
      setFarmExpenses(prev => prev.filter(exp => exp.id !== id))
      toast.success('Farm ledger entry deleted successfully!')
    }
  }

  // Filter expenses
  const filteredExpenses = farmExpenses.filter(expense => {
    const matchesCategory = selectedCategory === 'all' || expense.category === selectedCategory
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.notes?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Calculate analytics
  const currentYear = new Date()
  const yearStart = startOfYear(currentYear)
  const yearEnd = endOfYear(currentYear)

  const yearlyExpenses = farmExpenses.filter(expense => {
    try {
      return isWithinInterval(new Date(expense.date), { start: yearStart, end: yearEnd })
    } catch {
      return false
    }
  })

  const totalYearlyAmount = yearlyExpenses.reduce((sum, exp) => sum + exp.amount, 0)
  
  const categoryTotals = Object.keys(farmCategories).reduce((acc, category) => {
    acc[category] = yearlyExpenses
      .filter(exp => exp.category === category)
      .reduce((sum, exp) => sum + exp.amount, 0)
    return acc
  }, {})

  const topCategories = Object.entries(categoryTotals)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)

  const avgMonthlyExpense = totalYearlyAmount / 12

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
            <Tractor className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold gradient-text">Farm Ledger</h2>
        </div>
        <p className="text-white/70">Track and manage all your agricultural expenses</p>
        <p className="text-xs text-white/50 mt-1">
          {farmExpenses.length} total entries | ${totalYearlyAmount.toFixed(2)} this year
        </p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass-card"
      >
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                viewMode === 'list' 
                  ? 'bg-green-500/20 text-green-400 border border-green-400/50' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>Ledger</span>
            </button>
            <button
              onClick={() => setViewMode('analytics')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                viewMode === 'analytics' 
                  ? 'bg-green-500/20 text-green-400 border border-green-400/50' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Entry</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Add/Edit Form Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowAddForm(false)
              setEditingExpense(null)
              setFormData({
                date: format(new Date(), 'yyyy-MM-dd'),
                category: 'seeds',
                description: '',
                amount: '',
                quantity: '',
                unit: '',
                supplier: '',
                notes: ''
              })
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">
                  {editingExpense ? 'Edit Farm Ledger Entry' : 'Add Farm Ledger Entry'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingExpense(null)
                  }}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent"
                      required
                    >
                      {Object.entries(farmCategories).map(([key, category]) => (
                        <option key={key} value={key} className="bg-gray-800">
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Description *
                    </label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="e.g., Corn seeds for north field"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Amount ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0.00"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Supplier
                    </label>
                    <input
                      type="text"
                      value={formData.supplier}
                      onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                      placeholder="e.g., John Deere, Local Feed Store"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.quantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                      placeholder="e.g., 50"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Unit
                    </label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                      placeholder="e.g., lbs, gallons, bags"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Additional notes or details..."
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                  >
                    {editingExpense ? 'Update Entry' : 'Add Entry'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => {
                      setShowAddForm(false)
                      setEditingExpense(null)
                    }}
                    className="px-6 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-all duration-300"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'list' ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Filters */}
            <div className="glass-card">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-white/70" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  >
                    <option value="all" className="bg-gray-800">All Categories</option>
                    {Object.entries(farmCategories).map(([key, category]) => (
                      <option key={key} value={key} className="bg-gray-800">
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-2 flex-1 max-w-md">
                  <Search className="h-4 w-4 text-white/70" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search ledger entries..."
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  />
                </div>
              </div>
            </div>

            {/* Expenses List */}
            <div className="space-y-4">
              {filteredExpenses.length === 0 ? (
                <div className="glass-card text-center py-12">
                  <Tractor className="h-16 w-16 text-white/30 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white/70 mb-2">No farm ledger entries found</h3>
                  <p className="text-white/50 mb-6">
                    {farmExpenses.length === 0 
                      ? "Start tracking your agricultural expenses by adding your first ledger entry."
                      : "Try adjusting your filters or search terms."
                    }
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddForm(true)}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                  >
                    Add First Entry
                  </motion.button>
                </div>
              ) : (
                filteredExpenses.map((expense, index) => {
                  const category = farmCategories[expense.category]
                  const Icon = category.icon
                  
                  return (
                    <motion.div
                      key={expense.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="glass-card hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${category.color}`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-1">
                              <h3 className="font-semibold text-white">{expense.description}</h3>
                              <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/70">
                                {category.label}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-white/70">
                              <span>{format(new Date(expense.date), 'MMM dd, yyyy')}</span>
                              {expense.supplier && <span>• {expense.supplier}</span>}
                              {expense.quantity && expense.unit && (
                                <span>• {expense.quantity} {expense.unit}</span>
                              )}
                            </div>
                            
                            {expense.notes && (
                              <p className="text-sm text-white/60 mt-1">{expense.notes}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-xl font-bold text-green-400">
                              ${expense.amount.toFixed(2)}
                            </p>
                          </div>
                          
                          <div className="flex space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleEdit(expense)}
                              className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </motion.button>
                            
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(expense.id)}
                              className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Analytics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="glass-card"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Total This Year</p>
                    <p className="text-2xl font-bold text-green-400">
                      ${totalYearlyAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="glass-card"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Avg Monthly</p>
                    <p className="text-2xl font-bold text-blue-400">
                      ${avgMonthlyExpense.toFixed(2)}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="glass-card"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Total Entries</p>
                    <p className="text-2xl font-bold text-purple-400">
                      {yearlyExpenses.length}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Top Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="glass-card"
            >
              <h3 className="text-xl font-semibold text-white mb-6">Top Expense Categories</h3>
              <div className="space-y-4">
                {topCategories.map(([categoryKey, amount], index) => {
                  const category = farmCategories[categoryKey]
                  const Icon = category.icon
                  const percentage = totalYearlyAmount > 0 ? (amount / totalYearlyAmount * 100) : 0
                  
                  return (
                    <motion.div
                      key={categoryKey}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                      className="flex items-center space-x-4"
                    >
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${category.color}`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-white">{category.label}</span>
                          <div className="text-right">
                            <span className="text-white font-semibold">${amount.toFixed(2)}</span>
                            <span className="text-white/50 text-sm ml-2">({percentage.toFixed(1)}%)</span>
                          </div>
                        </div>
                        
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                            className={`h-2 rounded-full bg-gradient-to-r ${category.color}`}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FarmLedger
