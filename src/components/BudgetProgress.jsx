import React from 'react'
import { motion } from 'framer-motion'

const BudgetProgress = ({ transactions }) => {
  const budgets = {
    'Food & Dining': 800,
    'Transportation': 300,
    'Shopping': 500,
    'Entertainment': 200,
    'Bills & Utilities': 600,
    'Healthcare': 400,
    'Travel': 300,
    'Other': 200
  }

  const expenseTransactions = transactions.filter(t => t.type === 'expense')
  
  const categorySpending = expenseTransactions.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount
    return acc
  }, {})

  const budgetData = Object.entries(budgets).map(([category, budget]) => {
    const spent = categorySpending[category] || 0
    const percentage = (spent / budget) * 100
    const remaining = Math.max(0, budget - spent)
    
    return {
      category,
      budget,
      spent,
      remaining,
      percentage: Math.min(percentage, 100),
      isOverBudget: spent > budget
    }
  })

  return (
    <div className="space-y-4">
      {budgetData.map((item, index) => (
        <motion.div
          key={item.category}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="space-y-2"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-white/90">{item.category}</span>
            <div className="text-right">
              <span className={`text-sm font-semibold ${
                item.isOverBudget ? 'text-red-400' : 'text-white/70'
              }`}>
                ${item.spent.toFixed(0)} / ${item.budget}
              </span>
            </div>
          </div>
          
          <div className="relative">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.percentage}%` }}
                transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                className={`h-full rounded-full ${
                  item.isOverBudget 
                    ? 'bg-gradient-to-r from-red-500 to-red-600' 
                    : item.percentage > 80
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                    : 'bg-gradient-to-r from-green-500 to-emerald-500'
                }`}
              />
            </div>
            
            {item.isOverBudget && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 + 0.5 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
              >
                <span className="text-xs text-white">!</span>
              </motion.div>
            )}
          </div>
          
          <div className="flex justify-between text-xs text-white/60">
            <span>{item.percentage.toFixed(1)}% used</span>
            <span className={item.isOverBudget ? 'text-red-400' : ''}>
              {item.isOverBudget ? `$${(item.spent - item.budget).toFixed(0)} over` : `$${item.remaining.toFixed(0)} left`}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default BudgetProgress
