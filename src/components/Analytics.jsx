import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { 
  TrendingUp, 
  Calendar, 
  PieChart, 
  BarChart3,
  Target,
  DollarSign
} from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths, isWithinInterval } from 'date-fns'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const Analytics = ({ transactions }) => {
  const [timeRange, setTimeRange] = useState('6months')
  const [chartType, setChartType] = useState('line')

  // Generate monthly data for the selected time range
  const getMonthlyData = () => {
    const months = timeRange === '6months' ? 6 : 12
    const endDate = new Date()
    const startDate = subMonths(endDate, months - 1)
    
    const monthsArray = eachMonthOfInterval({ start: startDate, end: endDate })
    
    return monthsArray.map(month => {
      const monthStart = startOfMonth(month)
      const monthEnd = endOfMonth(month)
      
      const monthTransactions = transactions.filter(transaction =>
        isWithinInterval(new Date(transaction.date), { start: monthStart, end: monthEnd })
      )
      
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)
      
      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)
      
      return {
        month: format(month, 'MMM yyyy'),
        income,
        expenses,
        net: income - expenses
      }
    })
  }

  const monthlyData = getMonthlyData()

  // Chart configurations
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          callback: function(value) {
            return '$' + value.toFixed(0)
          }
        },
      },
    },
  }

  const lineChartData = {
    labels: monthlyData.map(d => d.month),
    datasets: [
      {
        label: 'Income',
        data: monthlyData.map(d => d.income),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Expenses',
        data: monthlyData.map(d => d.expenses),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Net Income',
        data: monthlyData.map(d => d.net),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const barChartData = {
    labels: monthlyData.map(d => d.month),
    datasets: [
      {
        label: 'Income',
        data: monthlyData.map(d => d.income),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
      {
        label: 'Expenses',
        data: monthlyData.map(d => d.expenses),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
    ],
  }

  // Category analysis
  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount
      return acc
    }, {})

  const categoryChartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 101, 101, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(20, 184, 166, 0.8)',
          'rgba(251, 146, 60, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 101, 101)',
          'rgb(139, 92, 246)',
          'rgb(245, 158, 11)',
          'rgb(236, 72, 153)',
          'rgb(20, 184, 166)',
          'rgb(251, 146, 60)',
        ],
        borderWidth: 2,
      },
    ],
  }

  // Financial insights
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  const avgMonthlyIncome = monthlyData.reduce((sum, d) => sum + d.income, 0) / monthlyData.length
  const avgMonthlyExpenses = monthlyData.reduce((sum, d) => sum + d.expenses, 0) / monthlyData.length
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0

  const insights = [
    {
      title: 'Average Monthly Income',
      value: avgMonthlyIncome,
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'from-green-500/20 to-emerald-500/20'
    },
    {
      title: 'Average Monthly Expenses',
      value: avgMonthlyExpenses,
      icon: TrendingUp,
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
    },
    {
      title: 'Net Worth Trend',
      value: totalIncome - totalExpenses,
      icon: DollarSign,
      color: totalIncome - totalExpenses >= 0 ? 'text-green-400' : 'text-red-400',
      bgColor: totalIncome - totalExpenses >= 0 ? 'from-green-500/20 to-emerald-500/20' : 'from-red-500/20 to-pink-500/20'
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
        <h2 className="text-3xl font-bold gradient-text mb-2">Financial Analytics</h2>
        <p className="text-white/70">Deep insights into your spending patterns and financial health</p>
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
              onClick={() => setTimeRange('6months')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                timeRange === '6months' 
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-400/50' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              6 Months
            </button>
            <button
              onClick={() => setTimeRange('12months')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                timeRange === '12months' 
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-400/50' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              12 Months
            </button>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setChartType('line')}
              className={`p-2 rounded-lg transition-all duration-300 ${
                chartType === 'line' 
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-400/50' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`p-2 rounded-lg transition-all duration-300 ${
                chartType === 'bar' 
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-400/50' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.title}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="glass-card relative overflow-hidden group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${insight.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${insight.bgColor}`}>
                  <insight.icon className={`h-6 w-6 ${insight.color}`} />
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-white/70">{insight.title}</p>
                <p className={`text-2xl font-bold ${insight.color}`}>
                  {insight.isPercentage ? insight.value : new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(Math.abs(insight.value))}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="glass-card"
      >
        <div className="flex items-center space-x-2 mb-6">
          <Calendar className="h-5 w-5 text-blue-400" />
          <h3 className="text-xl font-semibold">Income vs Expenses Trend</h3>
        </div>
        <div className="h-80">
          {chartType === 'line' ? (
            <Line data={lineChartData} options={chartOptions} />
          ) : (
            <Bar data={barChartData} options={chartOptions} />
          )}
        </div>
      </motion.div>

      {/* Category Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="glass-card"
      >
        <div className="flex items-center space-x-2 mb-6">
          <PieChart className="h-5 w-5 text-purple-400" />
          <h3 className="text-xl font-semibold">Expense Categories Analysis</h3>
        </div>
        <div className="h-80">
          <Doughnut 
            data={categoryChartData} 
            options={{
              ...chartOptions,
              cutout: '60%',
              plugins: {
                ...chartOptions.plugins,
                tooltip: {
                  ...chartOptions.plugins.tooltip,
                  callbacks: {
                    label: function(context) {
                      const total = context.dataset.data.reduce((a, b) => a + b, 0)
                      const percentage = ((context.parsed / total) * 100).toFixed(1)
                      return `${context.label}: $${context.parsed.toFixed(2)} (${percentage}%)`
                    }
                  }
                }
              }
            }} 
          />
        </div>
      </motion.div>
    </div>
  )
}

export default Analytics
