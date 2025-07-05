import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Brain, 
  Target, 
  Search, 
  TrendingUp, 
  Calculator,
  DollarSign,
  PieChart,
  FileText,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'

const ImportedWorksheet = ({ worksheet, onBack }) => {
  const [activeSection, setActiveSection] = useState(0)
  const [formData, setFormData] = useState({
    monthlyIncome: '',
    fixedExpenses: '',
    variableExpenses: '',
    savingsGoal: '',
    debtPayments: '',
    emergencyFund: ''
  })

  const sections = [
    {
      id: 'income',
      title: 'Monthly Income Analysis',
      icon: DollarSign,
      description: 'Calculate your total monthly income from all sources',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'fixed',
      title: 'Fixed Expenses Review',
      icon: FileText,
      description: 'Track recurring monthly expenses like rent, utilities, insurance',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'variable',
      title: 'Variable Expenses Planning',
      icon: TrendingUp,
      description: 'Manage flexible spending on food, entertainment, shopping',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'savings',
      title: 'Savings Strategy',
      icon: Target,
      description: 'Set and track your monthly savings goals',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'debt',
      title: 'Debt Management',
      icon: Calculator,
      description: 'Plan debt payments and payoff strategies',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'emergency',
      title: 'Emergency Fund Planning',
      icon: AlertCircle,
      description: 'Build your financial safety net',
      color: 'from-yellow-500 to-orange-500'
    }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const calculateBudgetSummary = () => {
    const income = parseFloat(formData.monthlyIncome) || 0
    const fixed = parseFloat(formData.fixedExpenses) || 0
    const variable = parseFloat(formData.variableExpenses) || 0
    const savings = parseFloat(formData.savingsGoal) || 0
    const debt = parseFloat(formData.debtPayments) || 0
    const emergency = parseFloat(formData.emergencyFund) || 0

    const totalExpenses = fixed + variable + debt + emergency
    const totalSavings = savings
    const remaining = income - totalExpenses - totalSavings

    return {
      income,
      totalExpenses,
      totalSavings,
      remaining,
      savingsRate: income > 0 ? ((totalSavings / income) * 100).toFixed(1) : 0
    }
  }

  const renderSectionContent = (section) => {
    switch (section.id) {
      case 'income':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Primary Income (Monthly)
                </label>
                <input
                  type="number"
                  value={formData.monthlyIncome}
                  onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter monthly income"
                />
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text">
                    ${parseFloat(formData.monthlyIncome || 0).toLocaleString()}
                  </div>
                  <div className="text-white/60 text-sm">Monthly Income</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-xl p-6">
              <h4 className="font-semibold text-white mb-4 flex items-center">
                <Info className="h-5 w-5 mr-2 text-blue-400" />
                Income Tips
              </h4>
              <ul className="space-y-2 text-white/70 text-sm">
                <li>• Include salary, freelance work, side hustles</li>
                <li>• Use after-tax (net) income for accurate budgeting</li>
                <li>• Consider seasonal income variations</li>
                <li>• Don't forget irregular income sources</li>
              </ul>
            </div>
          </div>
        )

      case 'fixed':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Total Fixed Expenses
                </label>
                <input
                  type="number"
                  value={formData.fixedExpenses}
                  onChange={(e) => handleInputChange('fixedExpenses', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter fixed expenses"
                />
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">
                    ${parseFloat(formData.fixedExpenses || 0).toLocaleString()}
                  </div>
                  <div className="text-white/60 text-sm">Fixed Expenses</div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-6">
              <h4 className="font-semibold text-white mb-4">Common Fixed Expenses</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-white/70">
                <div>• Rent/Mortgage</div>
                <div>• Insurance</div>
                <div>• Utilities</div>
                <div>• Phone/Internet</div>
                <div>• Subscriptions</div>
                <div>• Loan Payments</div>
              </div>
            </div>
          </div>
        )

      case 'variable':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Variable Expenses Budget
                </label>
                <input
                  type="number"
                  value={formData.variableExpenses}
                  onChange={(e) => handleInputChange('variableExpenses', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter variable expenses budget"
                />
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">
                    ${parseFloat(formData.variableExpenses || 0).toLocaleString()}
                  </div>
                  <div className="text-white/60 text-sm">Variable Budget</div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-6">
              <h4 className="font-semibold text-white mb-4">Variable Expense Categories</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-white/70">
                <div>• Groceries</div>
                <div>• Dining Out</div>
                <div>• Entertainment</div>
                <div>• Shopping</div>
                <div>• Transportation</div>
                <div>• Personal Care</div>
              </div>
            </div>
          </div>
        )

      case 'savings':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Monthly Savings Goal
                </label>
                <input
                  type="number"
                  value={formData.savingsGoal}
                  onChange={(e) => handleInputChange('savingsGoal', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter savings goal"
                />
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">
                    ${parseFloat(formData.savingsGoal || 0).toLocaleString()}
                  </div>
                  <div className="text-white/60 text-sm">Savings Goal</div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-6">
              <h4 className="font-semibold text-white mb-4">Savings Recommendations</h4>
              <div className="space-y-3 text-sm text-white/70">
                <div className="flex justify-between">
                  <span>20% Rule (Recommended)</span>
                  <span className="text-green-400">
                    ${(parseFloat(formData.monthlyIncome || 0) * 0.2).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Current Savings Rate</span>
                  <span className="text-purple-400">
                    {calculateBudgetSummary().savingsRate}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )

      case 'debt':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Monthly Debt Payments
                </label>
                <input
                  type="number"
                  value={formData.debtPayments}
                  onChange={(e) => handleInputChange('debtPayments', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter debt payments"
                />
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400">
                    ${parseFloat(formData.debtPayments || 0).toLocaleString()}
                  </div>
                  <div className="text-white/60 text-sm">Debt Payments</div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-6">
              <h4 className="font-semibold text-white mb-4">Debt Management Strategies</h4>
              <ul className="space-y-2 text-white/70 text-sm">
                <li>• Snowball Method: Pay minimums, focus extra on smallest debt</li>
                <li>• Avalanche Method: Pay minimums, focus extra on highest interest</li>
                <li>• Consider debt consolidation for multiple high-interest debts</li>
                <li>• Aim to keep total debt payments under 36% of income</li>
              </ul>
            </div>
          </div>
        )

      case 'emergency':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Emergency Fund Contribution
                </label>
                <input
                  type="number"
                  value={formData.emergencyFund}
                  onChange={(e) => handleInputChange('emergencyFund', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter emergency fund contribution"
                />
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">
                    ${parseFloat(formData.emergencyFund || 0).toLocaleString()}
                  </div>
                  <div className="text-white/60 text-sm">Emergency Fund</div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-6">
              <h4 className="font-semibold text-white mb-4">Emergency Fund Guidelines</h4>
              <div className="space-y-3 text-sm text-white/70">
                <div className="flex justify-between">
                  <span>3-Month Goal</span>
                  <span className="text-yellow-400">
                    ${(parseFloat(formData.fixedExpenses || 0) * 3).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>6-Month Goal (Recommended)</span>
                  <span className="text-orange-400">
                    ${(parseFloat(formData.fixedExpenses || 0) * 6).toLocaleString()}
                  </span>
                </div>
                <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg">
                  <p className="text-yellow-300 text-xs">
                    💡 Start with $1,000 as your initial emergency fund, then build to 3-6 months of expenses
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const summary = calculateBudgetSummary()

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 glass-card rounded-xl"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </motion.button>
          
          <div>
            <h1 className="text-3xl font-bold gradient-text">
              {worksheet?.name || 'Budget Planning Worksheet'}
            </h1>
            <p className="text-white/60 mt-1">Comprehensive financial planning and analysis</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm text-white/60">Budget Status</div>
          <div className={`text-lg font-bold ${
            summary.remaining >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {summary.remaining >= 0 ? 'Balanced' : 'Over Budget'}
          </div>
        </div>
      </motion.div>

      {/* Section Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {sections.map((section, index) => {
          const Icon = section.icon
          const isActive = activeSection === index
          
          return (
            <motion.button
              key={section.id}
              onClick={() => setActiveSection(index)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-xl transition-all ${
                isActive 
                  ? 'glass-card border-2 border-purple-400/50' 
                  : 'bg-white/5 hover:bg-white/10'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`p-3 rounded-lg bg-gradient-to-br ${section.color} mb-3 mx-auto w-fit`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-sm font-medium text-white text-center">
                {section.title}
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Active Section Content */}
      <motion.div
        key={activeSection}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-card p-8"
      >
        <div className="flex items-center space-x-4 mb-6">
          <div className={`p-3 rounded-lg bg-gradient-to-br ${sections[activeSection].color}`}>
            {React.createElement(sections[activeSection].icon, { className: "h-6 w-6 text-white" })}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{sections[activeSection].title}</h2>
            <p className="text-white/60">{sections[activeSection].description}</p>
          </div>
        </div>

        {renderSectionContent(sections[activeSection])}
      </motion.div>

      {/* Budget Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <PieChart className="h-6 w-6 mr-3 text-purple-400" />
          Budget Summary
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              ${summary.income.toLocaleString()}
            </div>
            <div className="text-white/60 text-sm">Monthly Income</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">
              ${summary.totalExpenses.toLocaleString()}
            </div>
            <div className="text-white/60 text-sm">Total Expenses</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              ${summary.totalSavings.toLocaleString()}
            </div>
            <div className="text-white/60 text-sm">Savings Goal</div>
          </div>

          <div className="text-center">
            <div className={`text-2xl font-bold ${
              summary.remaining >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              ${Math.abs(summary.remaining).toLocaleString()}
            </div>
            <div className="text-white/60 text-sm">
              {summary.remaining >= 0 ? 'Remaining' : 'Over Budget'}
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {summary.savingsRate}%
            </div>
            <div className="text-white/60 text-sm">Savings Rate</div>
          </div>
        </div>

        {/* Budget Health Indicator */}
        <div className="mt-6 p-4 rounded-xl bg-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/80">Budget Health</span>
            <span className={`font-semibold ${
              summary.remaining >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {summary.remaining >= 0 ? 'Healthy' : 'Needs Adjustment'}
            </span>
          </div>
          
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all ${
                summary.remaining >= 0 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                  : 'bg-gradient-to-r from-red-500 to-orange-500'
              }`}
              style={{ 
                width: `${Math.min(100, Math.max(0, (summary.income - summary.totalExpenses - summary.totalSavings) / summary.income * 100))}%` 
              }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ImportedWorksheet
