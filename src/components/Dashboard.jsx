import React from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingDown, 
  DollarSign, 
  Calendar,
  PieChart,
  Receipt,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react'
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'
import AffiliateBanner from './AffiliateBanner'

const Dashboard = ({ transactions = [] }) => {
  const currentMonth = new Date()
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)

  const currentMonthTransactions = transactions.filter(transaction => {
    if (!transaction || !transaction.date) return false
    try {
      return isWithinInterval(new Date(transaction.date), { start: monthStart, end: monthEnd })
    } catch (error) {
      console.error('Error filtering transaction by date:', transaction, error)
      return false
    }
  })

  const totalIncome = currentMonthTransactions
    .filter(t => t && t.type === 'income' && t.amount)
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)

  const totalExpenses = currentMonthTransactions
    .filter(t => t && t.type === 'expense' && t.amount)
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)

  const balance = totalIncome - totalExpenses

  // Category breakdown for expenses
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
    .slice(0, 5)

  // Recent transactions (last 5)
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount))
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold text-white mb-2">Spending Overview</h2>
        <p className="text-white/60 flex items-center justify-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span>{format(currentMonth, 'MMMM yyyy')}</span>
        </p>
      </motion.div>

      {/* Monthly Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Spent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card text-center"
        >
          <div className="p-2 rounded-full bg-red-500/20 w-fit mx-auto mb-3">
            <TrendingDown className="h-6 w-6 text-red-400" />
          </div>
          <h3 className="text-sm text-white/70 mb-1">Total Spent</h3>
          <p className="text-2xl font-bold text-red-400">{formatCurrency(totalExpenses)}</p>
        </motion.div>

        {/* Income */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card text-center"
        >
          <div className="p-2 rounded-full bg-green-500/20 w-fit mx-auto mb-3">
            <DollarSign className="h-6 w-6 text-green-400" />
          </div>
          <h3 className="text-sm text-white/70 mb-1">Income</h3>
          <p className="text-2xl font-bold text-green-400">{formatCurrency(totalIncome)}</p>
        </motion.div>

        {/* Remaining */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card text-center"
        >
          <div className={`p-2 rounded-full w-fit mx-auto mb-3 ${
            balance >= 0 ? 'bg-blue-500/20' : 'bg-orange-500/20'
          }`}>
            <DollarSign className={`h-6 w-6 ${
              balance >= 0 ? 'text-blue-400' : 'text-orange-400'
            }`} />
          </div>
          <h3 className="text-sm text-white/70 mb-1">Remaining</h3>
          <p className={`text-2xl font-bold ${
            balance >= 0 ? 'text-blue-400' : 'text-orange-400'
          }`}>
            {formatCurrency(balance)}
          </p>
        </motion.div>
      </div>

      {/* Affiliate Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <AffiliateBanner 
          variant="minimal" 
          className="mb-8"
          showCloseButton={true}
        />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Spend Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="glass-card"
        >
          <div className="flex items-center space-x-2 mb-6">
            <PieChart className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Top Spending Categories</h3>
          </div>

          {topCategories.length === 0 ? (
            <div className="text-center py-8 text-white/50">
              <p>No expenses this month</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topCategories.map(([category, amount], index) => {
                const percentage = totalExpenses > 0 ? (amount / totalExpenses * 100) : 0
                return (
                  <div key={category} className="flex items-center space-x-3">
                    <div className="text-2xl">{getCategoryIcon(category)}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-white font-medium">{category}</span>
                        <span className="text-white/70">{formatCurrency(amount)}</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                          className="h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                        />
                      </div>
                      <div className="text-xs text-white/50 mt-1">
                        {percentage.toFixed(1)}% of total spending
                      </div>
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
          className="glass-card"
        >
          <div className="flex items-center space-x-2 mb-6">
            <Receipt className="h-5 w-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="text-center py-8 text-white/50">
              <p>No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-xl">
                      {getCategoryIcon(transaction.category)}
                    </div>
                    <div>
                      <h4 className="font-medium text-white text-sm">
                        {transaction.description}
                      </h4>
                      <p className="text-xs text-white/60">
                        {format(new Date(transaction.date), 'MMM dd')} • {transaction.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`font-semibold text-sm ${
                      transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
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
        transition={{ duration: 0.5, delay: 0.8 }}
        className="glass-card"
      >
        <h3 className="text-lg font-semibold text-white mb-4">💡 Spending Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {totalExpenses > 0 && (
            <>
              <div className="p-4 bg-white/5 rounded-lg">
                <h4 className="text-sm font-medium text-purple-400 mb-1">Top Category</h4>
                <p className="text-white">
                  {topCategories[0] ? topCategories[0][0] : 'No data'}
                </p>
                <p className="text-xs text-white/60">
                  {topCategories[0] ? formatCurrency(topCategories[0][1]) : ''}
                </p>
              </div>

              <div className="p-4 bg-white/5 rounded-lg">
                <h4 className="text-sm font-medium text-blue-400 mb-1">Daily Average</h4>
                <p className="text-white">
                  {formatCurrency(totalExpenses / new Date().getDate())}
                </p>
                <p className="text-xs text-white/60">This month</p>
              </div>

              <div className="p-4 bg-white/5 rounded-lg">
                <h4 className="text-sm font-medium text-green-400 mb-1">Savings Rate</h4>
                <p className="text-white">
                  {totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : '0'}%
                </p>
                <p className="text-xs text-white/60">Of income saved</p>
              </div>
            </>
          )}
        </div>

        {totalExpenses === 0 && (
          <div className="text-center py-8 text-white/50">
            <p>Add some transactions to see your spending insights</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Dashboard
