import React from 'react'
import { motion } from 'framer-motion'

const BalanceCard = ({ title, value, icon: Icon, color, bgColor, delay = 0, isPercentage = false }) => {
  const formatValue = (val) => {
    if (isPercentage) return val
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(val))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="glass-card relative overflow-hidden group"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${bgColor}`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          <div className="text-right">
            <p className="text-sm text-white/70">{title}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
            className={`text-2xl font-bold ${color}`}
          >
            {formatValue(value)}
          </motion.p>
          
          <div className="flex items-center space-x-2">
            <div className={`h-1 w-full bg-white/10 rounded-full overflow-hidden`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, delay: delay + 0.3 }}
                className={`h-full bg-gradient-to-r ${bgColor.replace('/20', '/60')}`}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default BalanceCard
