import React from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  PieChart
} from 'lucide-react'
import { format, startOfMonth, endOfMonth, isWithinInterval, subMonths } from 'date-fns'
import AffiliateBanner from './AffiliateBanner'

const Dashboard = ({ transactions = [] }) => {
  const currentMonth = new Date()
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const lastMonth = subMonths(currentMonth, 1)
  const lastMonthStart = startOfMonth(lastMonth)
  const lastMonthEnd = endOfMonth(lastMonth)

  // Current month transactions
  const currentMonthTransactions = transactions.filter(transaction => {
    if (!transaction || !transaction.date) return false
    try {
      return isWithinInterval(new Date(transaction.date), { start: monthStart, end: monthEnd })
    } catch (error) {
      return false
    }
  })

  // Last month transactions for comparison
  const lastMonthTransactions = transactions.filter(transaction => {
    if (!transaction || !transaction.date) return false
    try {
      return isWithinInterval(new Date(transaction.date), { start: lastMonthStart, end: lastMonthEnd })
    } catch (error) {
      return false
    }
  })

  // Calculate totals
  const currentIncome = currentMonthTransactions
    .filter(t => t && t.type === 'income' && t.amount)
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)

  const currentExpenses = currentMonthTransactions
    .filter(t => t && t.type === 'expense' && t.amount)
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)

  const lastMonthExpenses = lastMonthTransactions
    .filter(t => t && t.type === 'expense' && t.amount)
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)

  const balance = currentIncome - currentExpenses
  const expenseChange = lastMonthExpenses > 0 ? ((currentExpenses - lastMonthExpenses) / lastMonthExpenses * 100) : 0

  // Category breakdown
  const categoryData = currentMonthTransactions
    .filter(t => t && t.type === 'expense' && t.category && t.amount)
    .reduce((acc, transaction) => {
      const category = transaction.category || 'Other'
      const amount = parseFloat(transaction.amount) || 0
      acc[category] = (acc[category] || 0) + amount
      return acc
    }, {})

  const topCategories = Object.entries(categoryData)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 4)

  // Recent transactions
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4)

  const getCategoryIcon = (category) => {
    const icons = {
      'Food & Dining': '🍽️',
      'Transportation': '🚗',
      'Shopping': '🛍️',
      'Entertainment': '🎬',
      'Bills & Utilities': '💡',
      'Healthcare': '🏥',
      'Travel': '✈️',
      'Other': '📝'
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
        <h2 className="text-2xl font-bold gradient-text mb-1">Spending Overview</h2>
        <p className="text-white/60 text-sm flex items-center justify-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span>{format(currentMonth, 'MMMM yyyy')}</span>
        </p>
      </motion.div>

      {/* Monthly Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Spent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-500/20 to-pink-500/20">
              <TrendingDown className="h-6 w-6 text-red-400" />
            </div>
            <div className={`text-sm px-2 py-1 rounded-full ${
              expenseChange > 0 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
            }`}>
              {expenseChange > 0 ? '+' : ''}{expenseChange.toFixed(1)}%
            </div>
          </div>
          <div>
            <p className="text-white/60 text-sm mb-1">Total Spent</p>
            <p className="text-2xl font-bold text-red-400">
              ${currentExpenses.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </div>
        </motion.div>

        {/* Income */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20">
              <TrendingUp className="h-6 w-6 text-green-400" />
            </div>
          </div>
          <div>
            <p className="text-white/60 text-sm mb-1">Income</p>
            <p className="text-2xl font-bold text-green-400">
              ${currentIncome.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </div>
        </motion.div>

        {/* Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${
              balance >= 0 ? 'from-blue-500/20 to-purple-500/20' : 'from-red-500/20 to-pink-500/20'
            }`}>
              <DollarSign className={`h-6 w-6 ${balance >= 0 ? 'text-blue-400' : 'text-red-400'}`} />
            </div>
          </div>
          <div>
            <p className="text-white/60 text-sm mb-1">Net Balance</p>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
              ${Math.abs(balance).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Affiliate Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <AffiliateBanner 
          variant="minimal" 
          showCloseButton={true}
        />
      </motion.div>

      {/* Spend Breakdown & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Spending Categories */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="glass-card p-6"
        >
          <div className="flex items-center space-x-2 mb-6">
            <PieChart className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-semibold">Top Spending</h3>
          </div>

          {topCategories.length === 0 ? (
            <div className="text-center py-8 text-white/50">
              <p className="text-sm">No expenses this month</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topCategories.map(([category, amount], index) => {
                const percentage = currentExpenses > 0 ? (amount / currentExpenses * 100) : 0
                return (
                  <div key={category} className="flex items-center space-x-4">
                    <div className="text-2xl">{getCategoryIcon(category)}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-white text-sm font-medium">{category}</span>
                        <span className="text-white/80 text-sm">${amount.toFixed(0)}</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                          className="h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                        />
                      </div>
                      <p className="text-xs text-white/50 mt-1">{percentage.toFixed(1)}% of spending</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <span className="text-xs text-white/50">{recentTransactions.length} transactions</span>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="text-center py-8 text-white/50">
              <p className="text-sm">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-lg">
                      {getCategoryIcon(transaction.category)}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium truncate max-w-32">
                        {transaction.description}
                      </p>
                      <p className="text-white/50 text-xs">
                        {format(new Date(transaction.date), 'MMM dd')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${
                      transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(0)}
                    </span>
                    <div className={`p-1 rounded-full ${
                      transaction.type === 'income' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {transaction.type === 'income' ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownLeft className="h-3 w-3" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Spending Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="glass-card p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Spending Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <p className="text-2xl font-bold text-blue-400">
              ${currentExpenses > 0 ? (currentExpenses / currentMonthTransactions.filter(t => t.type === 'expense').length).toFixed(0) : '0'}
            </p>
            <p className="text-sm text-white/60">Avg per transaction</p>
          </div>
          
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <p className="text-2xl font-bold text-purple-400">
              {topCategories.length > 0 ? topCategories[0][0] : 'None'}
            </p>
            <p className="text-sm text-white/60">Top category</p>
          </div>
          
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <p className="text-2xl font-bold text-green-400">
              {currentIncome > 0 ? ((currentIncome - currentExpenses) / currentIncome * 100).toFixed(0) : '0'}%
            </p>
            <p className="text-sm text-white/60">Savings rate</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard
