import React from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock,
  Receipt
} from 'lucide-react'

const RecentTransactions = ({ transactions }) => {
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

  return (
    <div>
      <div className="flex items-center space-x-2 mb-6">
        <Receipt className="h-5 w-5 text-green-400" />
        <h3 className="text-xl font-semibold">Recent Transactions</h3>
        <Clock className="h-4 w-4 text-white/50" />
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
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10"
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
                    <span>{format(new Date(transaction.date), 'MMM dd, yyyy')}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    ${transaction.amount.toFixed(2)}
                  </p>
                </div>
                
                <div className={`p-2 rounded-full ${
                  transaction.type === 'income' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {transaction.type === 'income' ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownLeft className="h-4 w-4" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RecentTransactions
