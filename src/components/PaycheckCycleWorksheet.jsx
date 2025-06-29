import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Calculator, 
  Target, 
  TrendingUp, 
  DollarSign, 
  Save, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  PiggyBank,
  Wallet
} from 'lucide-react'

const PaycheckCycleWorksheet = ({ onBack }) => {
  const [currentSection, setCurrentSection] = useState(0)
  const [formData, setFormData] = useState({
    // Reflection Section
    trackingMethod: '',
    clearPicture: '',
    financialStressors: '',
    spendingHabits: ['', '', '', ''],
    
    // Goals Section
    financialStability: '',
    threeMonthChanges: '',
    longTermGoals: ['', '', ''],
    whyImportant: '',
    
    // Action Plan Section
    budgetingMethod: '',
    expensesToReduce: '',
    savingsPercentage: '',
    incomeStreams: ['', '', ''],
    accountabilitySystem: '',
    
    // Progress Tracking
    weeklyData: [
      { week: 1, income: '', essential: '', discretionary: '', savings: '', notes: '' },
      { week: 2, income: '', essential: '', discretionary: '', savings: '', notes: '' },
      { week: 3, income: '', essential: '', discretionary: '', savings: '', notes: '' },
      { week: 4, income: '', essential: '', discretionary: '', savings: '', notes: '' }
    ],
    
    // Final Reflection
    workingStrategies: ['', '', ''],
    challenges: '',
    adjustments: ''
  })

  const [calculations, setCalculations] = useState({
    totalIncome: 0,
    totalEssential: 0,
    totalDiscretionary: 0,
    totalSavings: 0,
    savingsRate: 0,
    monthlyProjection: 0
  })

  const sections = [
    { id: 0, title: 'Current Practices', icon: AlertCircle },
    { id: 1, title: 'Define Goals', icon: Target },
    { id: 2, title: 'Action Plan', icon: CheckCircle },
    { id: 3, title: 'Track Progress', icon: TrendingUp },
    { id: 4, title: 'Final Reflection', icon: PiggyBank }
  ]

  // Calculate totals whenever weekly data changes
  useEffect(() => {
    const totals = formData.weeklyData.reduce((acc, week) => {
      const income = parseFloat(week.income) || 0
      const essential = parseFloat(week.essential) || 0
      const discretionary = parseFloat(week.discretionary) || 0
      const savings = parseFloat(week.savings) || 0
      
      return {
        totalIncome: acc.totalIncome + income,
        totalEssential: acc.totalEssential + essential,
        totalDiscretionary: acc.totalDiscretionary + discretionary,
        totalSavings: acc.totalSavings + savings
      }
    }, { totalIncome: 0, totalEssential: 0, totalDiscretionary: 0, totalSavings: 0 })

    const savingsRate = totals.totalIncome > 0 ? (totals.totalSavings / totals.totalIncome) * 100 : 0
    const monthlyProjection = totals.totalSavings * 4.33 // Average weeks per month

    setCalculations({
      ...totals,
      savingsRate,
      monthlyProjection
    })
  }, [formData.weeklyData])

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const updateArrayField = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const updateWeeklyData = (weekIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      weeklyData: prev.weeklyData.map((week, i) => 
        i === weekIndex ? { ...week, [field]: value } : week
      )
    }))
  }

  const renderSection = () => {
    switch (currentSection) {
      case 0:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Reflect on Your Current Practices</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  How do you currently track your income and expenses?
                </label>
                <input
                  type="text"
                  value={formData.trackingMethod}
                  onChange={(e) => updateFormData('trackingMethod', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  placeholder="Describe your current tracking method..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Do you have a clear picture of where your money is going? Why or why not?
                </label>
                <textarea
                  value={formData.clearPicture}
                  onChange={(e) => updateFormData('clearPicture', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  placeholder="Explain your understanding of your spending patterns..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  What are your biggest financial stressors?
                </label>
                <textarea
                  value={formData.financialStressors}
                  onChange={(e) => updateFormData('financialStressors', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  placeholder="List your main financial concerns..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Are there any spending habits you'd like to change?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {formData.spendingHabits.map((habit, index) => (
                    <input
                      key={index}
                      type="text"
                      value={habit}
                      onChange={(e) => updateArrayField('spendingHabits', index, e.target.value)}
                      className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                      placeholder={`Spending habit ${index + 1}...`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Define Your Goals</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  What does financial stability mean for you?
                </label>
                <textarea
                  value={formData.financialStability}
                  onChange={(e) => updateFormData('financialStability', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  placeholder="Define what financial stability looks like for you..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  What changes would you like to see in your finances over the next three months?
                </label>
                <textarea
                  value={formData.threeMonthChanges}
                  onChange={(e) => updateFormData('threeMonthChanges', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  placeholder="Describe your 3-month financial goals..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  What long-term financial goals are you working toward?
                </label>
                <div className="space-y-3">
                  {formData.longTermGoals.map((goal, index) => (
                    <input
                      key={index}
                      type="text"
                      value={goal}
                      onChange={(e) => updateArrayField('longTermGoals', index, e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                      placeholder={`Long-term goal ${index + 1} (e.g., Emergency fund, debt payoff)...`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Why is breaking the paycheck-to-paycheck cycle important to you?
                </label>
                <textarea
                  value={formData.whyImportant}
                  onChange={(e) => updateFormData('whyImportant', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  placeholder="Explain your motivation for financial change..."
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Create an Action Plan</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Track Your Income and Expenses: Choose a budgeting method
                </label>
                <input
                  type="text"
                  value={formData.budgetingMethod}
                  onChange={(e) => updateFormData('budgetingMethod', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  placeholder="App, spreadsheet, notebook, etc..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Identify Expenses to Reduce: List at least one non-essential expense you can cut this month
                </label>
                <textarea
                  value={formData.expensesToReduce}
                  onChange={(e) => updateFormData('expensesToReduce', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  placeholder="List expenses you can reduce or eliminate..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Commit to Saving: What percentage of your paycheck will you set aside for savings?
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    value={formData.savingsPercentage}
                    onChange={(e) => updateFormData('savingsPercentage', e.target.value)}
                    className="w-24 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                    placeholder="5"
                    min="0"
                    max="100"
                  />
                  <span className="text-white">%</span>
                  {formData.savingsPercentage && (
                    <span className="text-green-400 text-sm">
                      Great! Even {formData.savingsPercentage}% is a solid start.
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Explore Additional Income Streams
                </label>
                <div className="space-y-3">
                  {formData.incomeStreams.map((stream, index) => (
                    <input
                      key={index}
                      type="text"
                      value={stream}
                      onChange={(e) => updateArrayField('incomeStreams', index, e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                      placeholder={`Income idea ${index + 1} (e.g., freelancing, selling items)...`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Hold Yourself Accountable: Set up a system for tracking progress
                </label>
                <textarea
                  value={formData.accountabilitySystem}
                  onChange={(e) => updateFormData('accountabilitySystem', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  placeholder="How will you track progress and how often will you check?"
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Track Your Progress</h3>
            
            {/* Calculation Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="glass-card text-center">
                <DollarSign className="h-6 w-6 text-green-400 mx-auto mb-2" />
                <div className="text-lg font-bold text-green-400">
                  ${calculations.totalIncome.toFixed(2)}
                </div>
                <div className="text-xs text-white/60">Total Income</div>
              </div>
              
              <div className="glass-card text-center">
                <Wallet className="h-6 w-6 text-red-400 mx-auto mb-2" />
                <div className="text-lg font-bold text-red-400">
                  ${(calculations.totalEssential + calculations.totalDiscretionary).toFixed(2)}
                </div>
                <div className="text-xs text-white/60">Total Expenses</div>
              </div>
              
              <div className="glass-card text-center">
                <PiggyBank className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                <div className="text-lg font-bold text-blue-400">
                  ${calculations.totalSavings.toFixed(2)}
                </div>
                <div className="text-xs text-white/60">Total Saved</div>
              </div>
              
              <div className="glass-card text-center">
                <TrendingUp className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                <div className="text-lg font-bold text-purple-400">
                  {calculations.savingsRate.toFixed(1)}%
                </div>
                <div className="text-xs text-white/60">Savings Rate</div>
              </div>
            </div>

            {/* Weekly Tracking Table */}
            <div className="glass-card overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-2">Week</th>
                    <th className="text-left py-3 px-2">Income</th>
                    <th className="text-left py-3 px-2">Essential</th>
                    <th className="text-left py-3 px-2">Discretionary</th>
                    <th className="text-left py-3 px-2">Savings</th>
                    <th className="text-left py-3 px-2">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.weeklyData.map((week, index) => (
                    <tr key={week.week} className="border-b border-white/10">
                      <td className="py-3 px-2 font-medium">{week.week}</td>
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          value={week.income}
                          onChange={(e) => updateWeeklyData(index, 'income', e.target.value)}
                          className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-400/50"
                          placeholder="0"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          value={week.essential}
                          onChange={(e) => updateWeeklyData(index, 'essential', e.target.value)}
                          className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-400/50"
                          placeholder="0"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          value={week.discretionary}
                          onChange={(e) => updateWeeklyData(index, 'discretionary', e.target.value)}
                          className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-400/50"
                          placeholder="0"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          value={week.savings}
                          onChange={(e) => updateWeeklyData(index, 'savings', e.target.value)}
                          className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-400/50"
                          placeholder="0"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="text"
                          value={week.notes}
                          onChange={(e) => updateWeeklyData(index, 'notes', e.target.value)}
                          className="w-32 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-400/50"
                          placeholder="Notes..."
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Monthly Projection */}
            {calculations.totalSavings > 0 && (
              <div className="glass-card">
                <h4 className="font-semibold mb-3">Monthly Projection</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      ${calculations.monthlyProjection.toFixed(2)}
                    </div>
                    <div className="text-sm text-white/60">Projected Monthly Savings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      ${(calculations.monthlyProjection * 12).toFixed(2)}
                    </div>
                    <div className="text-sm text-white/60">Projected Annual Savings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {Math.ceil((1000 / calculations.monthlyProjection) || 0)} months
                    </div>
                    <div className="text-sm text-white/60">To Save $1,000</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Reflect on Your Progress</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  What strategies worked well in helping you manage your budget?
                </label>
                <div className="space-y-3">
                  {formData.workingStrategies.map((strategy, index) => (
                    <input
                      key={index}
                      type="text"
                      value={strategy}
                      onChange={(e) => updateArrayField('workingStrategies', index, e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                      placeholder={`Working strategy ${index + 1}...`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  What challenges did you face, and how did you handle them?
                </label>
                <textarea
                  value={formData.challenges}
                  onChange={(e) => updateFormData('challenges', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  placeholder="Describe challenges and your solutions..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  What adjustments can you make to improve your financial habits next month?
                </label>
                <textarea
                  value={formData.adjustments}
                  onChange={(e) => updateFormData('adjustments', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  placeholder="Plan your improvements for next month..."
                />
              </div>
            </div>

            {/* Final Summary */}
            <div className="glass-card bg-gradient-to-r from-green-500/20 to-blue-500/20">
              <h4 className="font-semibold mb-3 text-center">🎉 Congratulations on Your Progress!</h4>
              <p className="text-center text-white/80 mb-4">
                Breaking the paycheck-to-paycheck cycle takes time, commitment, and consistency. 
                Celebrate small wins along the way and remember that each step brings you closer to financial freedom.
              </p>
              
              {calculations.totalSavings > 0 && (
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-400">
                    You've saved ${calculations.totalSavings.toFixed(2)} over 4 weeks!
                  </div>
                  <div className="text-sm text-white/70">
                    That's a {calculations.savingsRate.toFixed(1)}% savings rate - keep it up!
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.button
              onClick={onBack}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>
            <div>
              <h2 className="text-2xl font-bold gradient-text">Breaking the Paycheck-to-Paycheck Cycle</h2>
              <p className="text-white/70">Interactive Financial Planning Worksheet</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calculator className="h-6 w-6 text-blue-400" />
            <span className="text-sm text-white/70">Calculation Simulator</span>
          </div>
        </div>
      </motion.div>

      {/* Progress Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card"
      >
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <motion.button
                key={section.id}
                onClick={() => setCurrentSection(section.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  currentSection === section.id
                    ? 'bg-blue-500/30 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm">{section.title}</span>
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        key={currentSection}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="glass-card"
      >
        {renderSection()}
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <motion.button
          onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
          disabled={currentSection === 0}
          className={`px-6 py-2 rounded-lg flex items-center space-x-2 ${
            currentSection === 0
              ? 'bg-white/10 text-white/50 cursor-not-allowed'
              : 'glass-button'
          }`}
          whileHover={currentSection > 0 ? { scale: 1.05 } : {}}
          whileTap={currentSection > 0 ? { scale: 0.95 } : {}}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous</span>
        </motion.button>

        <motion.button
          onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
          disabled={currentSection === sections.length - 1}
          className={`px-6 py-2 rounded-lg flex items-center space-x-2 ${
            currentSection === sections.length - 1
              ? 'bg-white/10 text-white/50 cursor-not-allowed'
              : 'glass-button'
          }`}
          whileHover={currentSection < sections.length - 1 ? { scale: 1.05 } : {}}
          whileTap={currentSection < sections.length - 1 ? { scale: 0.95 } : {}}
        >
          <span>Next</span>
          <TrendingUp className="h-4 w-4" />
        </motion.button>
      </div>
    </div>
  )
}

export default PaycheckCycleWorksheet
