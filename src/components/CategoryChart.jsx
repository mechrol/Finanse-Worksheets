import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const CategoryChart = ({ transactions = [] }) => {
  console.log('CategoryChart received transactions:', transactions.length)
  
  // Filter expense transactions and ensure we have valid data
  const expenseTransactions = transactions.filter(t => 
    t && t.type === 'expense' && t.amount && t.category
  )
  
  console.log('Filtered expense transactions:', expenseTransactions.length)
  
  const categoryTotals = expenseTransactions.reduce((acc, transaction) => {
    const category = transaction.category || 'Other'
    const amount = parseFloat(transaction.amount) || 0
    acc[category] = (acc[category] || 0) + amount
    return acc
  }, {})

  console.log('Category totals:', categoryTotals)

  const categories = Object.keys(categoryTotals)
  const amounts = Object.values(categoryTotals)

  const colors = [
    'rgba(59, 130, 246, 0.8)',   // Blue
    'rgba(16, 185, 129, 0.8)',   // Green
    'rgba(245, 101, 101, 0.8)',  // Red
    'rgba(139, 92, 246, 0.8)',   // Purple
    'rgba(245, 158, 11, 0.8)',   // Yellow
    'rgba(236, 72, 153, 0.8)',   // Pink
    'rgba(20, 184, 166, 0.8)',   // Teal
    'rgba(251, 146, 60, 0.8)',   // Orange
  ]

  const borderColors = colors.map(color => color.replace('0.8', '1'))

  const data = {
    labels: categories,
    datasets: [
      {
        data: amounts,
        backgroundColor: colors,
        borderColor: borderColors,
        borderWidth: 2,
        hoverBorderWidth: 3,
        hoverOffset: 10,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
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
            const value = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(context.parsed)
            return `${context.label}: ${value}`
          }
        }
      },
    },
    cutout: '60%',
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
    },
  }

  if (categories.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-white/50 space-y-4">
        <div className="text-6xl">📊</div>
        <div className="text-center">
          <p className="text-lg font-medium">No expense data available</p>
          <p className="text-sm">Add some expense transactions to see the breakdown</p>
          <p className="text-xs mt-2 text-white/30">
            Total transactions: {transactions.length} | 
            Expense transactions: {expenseTransactions.length}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-64">
      <Doughnut data={data} options={options} />
    </div>
  )
}

export default CategoryChart
