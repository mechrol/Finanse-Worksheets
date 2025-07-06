import React from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target,
  Calendar,
  PieChart
} from 'lucide-react'
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'
import BalanceCard from './BalanceCard'
import CategoryChart from './CategoryChart'
import RecentTransactions from './RecentTransactions'
import BudgetProgress from './BudgetProgress'
import AffiliateBanner from './AffiliateBanner'

const Dashboard = ({ transactions = [] }) => {
  console.log('Dashboard received transactions:', transactions.length)
  
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

  console.log('Current month transactions:', currentMonthTransactions.length)

  const totalIncome = currentMonthTransactions
    .filter(t => t && t.type === 'income' && t.amount)
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)

  const totalExpenses = currentMonthTransactions
    .filter(t => t && t.type === 'expense' && t.amount)
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)

  const balance = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0

  const stats = [
    {
      title: 'Total Balance',
      value: balance,
      icon: DollarSign,
      color: balance >= 0 ? 'text-green-400' : 'text-red-400',
      bgColor: balance >= 0 ? 'from-green-500/20 to-emerald-500/20' : 'from-red-500/20 to-pink-500/20'
    },
    {
      title: 'Monthly Income',
      value: totalIncome,
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'from-green-500/20 to-emerald-500/20'
    },
    {
      title: 'Monthly Expenses',
      value: totalExpenses,
      icon: TrendingDown,
      color: 'text-red-400',
      bgColor: 'from-red-500/20 to-pink-500/20'
    },
    {
      title: 'Savings Rate',
      value: `${savingsRate.toFixed(1)}%`,
      icon: Target,
      color: 'text-blue-400',
      bgColor: 'from-blue-500/20 to-purple-500/20',
      isPercentage: true
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold gradient-text mb-2">Financial Dashboard</h2>
        <p className="text-white/70 flex items-center justify-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span>{format(currentMonth, 'MMMM yyyy')}</span>
        </p>
        <p className="text-xs text-white/50 mt-1">
          {transactions.length} total transactions | {currentMonthTransactions.length} this month
        </p>
      </motion.div>

      {/* Top Affiliate Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <AffiliateBanner 
          variant="success" 
          className="mb-6"
          showCloseButton={true}
        />
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <BalanceCard
            key={stat.title}
            {...stat}
            delay={index * 0.1}
          />
        ))}
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-card"
        >
          <div className="flex items-center space-x-2 mb-6">
            <PieChart className="h-5 w-5 text-blue-400" />
            <h3 className="text-xl font-semibold">Expense Categories</h3>
          </div>
          <CategoryChart transactions={currentMonthTransactions} />
        </motion.div>

        {/* Budget Progress */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="glass-card"
        >
          <div className="flex items-center space-x-2 mb-6">
            <Target className="h-5 w-5 text-purple-400" />
            <h3 className="text-xl font-semibold">Budget Overview</h3>
          </div>
          <BudgetProgress transactions={currentMonthTransactions} />
        </motion.div>
      </div>

      {/* Middle Affiliate Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <AffiliateBanner 
          variant="default" 
          className="my-8"
          showCloseButton={true}
        />
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="glass-card"
      >
        <RecentTransactions transactions={transactions.slice(0, 5)} />
      </motion.div>
    </div>
  )
}

export default Dashboard
