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
  CreditCard,
  Percent,
  Calendar,
  TrendingDown
} from 'lucide-react'

const ConsolidatingDebtWorksheet = ({ onBack }) => {
  const [currentSection, setCurrentSection] = useState(0)
  const [formData, setFormData] = useState({
    // Current Practices Section
    debts: [
      { debt: '', balance: '', interestRate: '' },
      { debt: '', balance: '', interestRate: '' },
      { debt: '', balance: '', interestRate: '' },
      { debt: '', balance: '', interestRate: '' },
      { debt: '', balance: '', interestRate: '' },
      { debt: '', balance: '', interestRate: '' },
      { debt: '', balance: '', interestRate: '' },
      { debt: '', balance: '', interestRate: '' }
    ],
    budgetImpact: '',
    missedPayments: '',
    debtChallenges: '',
    
    // Goals Section
    financialFreedom: '',
    consolidationGoal: '',
    debtFreeTimeline: '',
    whyImportant: '',
    
    // Consolidation Options Section
    researchedOptions: ['', '', ''],
    creditScore: '',
    chosenMethod: '',
    interestSavings: '',
    consolidationDownsides: '',
    
    // Action Plan Section
    priorityDebts: ['', '', ''],
    budgetCuts: ['', '', ''],
    consolidationStrategy: '',
    avoidNewDebt: ['', '', ''],
    automatedPayments: ['', '', '', ''],
    progressTracking: '',
    
    // Progress Tracking
    weeklyData: [
      { week: 1, debtConsolidated: '', amountPaid: '', interestBefore: '', interestAfter: '', savings: '', notes: '' },
      { week: 2, debtConsolidated: '', amountPaid: '', interestBefore: '', interestAfter: '', savings: '', notes: '' },
      { week: 3, debtConsolidated: '', amountPaid: '', interestBefore: '', interestAfter: '', savings: '', notes: '' },
      { week: 4, debtConsolidated: '', amountPaid: '', interestBefore: '', interestAfter: '', savings: '', notes: '' },
      { week: 5, debtConsolidated: '', amountPaid: '', interestBefore: '', interestAfter: '', savings: '', notes: '' },
      { week: 6, debtConsolidated: '', amountPaid: '', interestBefore: '', interestAfter: '', savings: '', notes: '' },
      { week: 7, debtConsolidated: '', amountPaid: '', interestBefore: '', interestAfter: '', savings: '', notes: '' },
      { week: 8, debtConsolidated: '', amountPaid: '', interestBefore: '', interestAfter: '', savings: '', notes: '' }
    ],
    
    // Final Reflection
    consolidationChallenges: '',
    stressImpact: '',
    workingStrategies: '',
    futureDebtPrevention: ''
  })

  const [calculations, setCalculations] = useState({
    totalDebt: 0,
    averageInterestRate: 0,
    totalWeeklyPayments: 0,
    totalSavings: 0,
    projectedSavings: 0
  })

  const sections = [
    { id: 0, title: 'Current Practices', icon: AlertCircle },
    { id: 1, title: 'Define Goals', icon: Target },
    { id: 2, title: 'Consolidation Options', icon: CreditCard },
    { id: 3, title: 'Action Plan', icon: CheckCircle },
    { id: 4, title: 'Track Progress', icon: TrendingUp },
    { id: 5, title: 'Final Reflection', icon: PiggyBank }
  ]

  // Calculate totals whenever debt data changes
  useEffect(() => {
    const validDebts = formData.debts.filter(debt => 
      debt.balance && !isNaN(parseFloat(debt.balance)) && 
      debt.interestRate && !isNaN(parseFloat(debt.interestRate))
    )

    const totalDebt = validDebts.reduce((sum, debt) => sum + parseFloat(debt.balance), 0)
    const weightedInterestSum = validDebts.reduce((sum, debt) => 
      sum + (parseFloat(debt.balance) * parseFloat(debt.interestRate)), 0
    )
    const averageInterestRate = totalDebt > 0 ? weightedInterestSum / totalDebt : 0

    const weeklyTotals = formData.weeklyData.reduce((acc, week) => {
      const amountPaid = parseFloat(week.amountPaid) || 0
      const savings = parseFloat(week.savings) || 0
      
      return {
        totalWeeklyPayments: acc.totalWeeklyPayments + amountPaid,
        totalSavings: acc.totalSavings + savings
      }
    }, { totalWeeklyPayments: 0, totalSavings: 0 })

    const projectedSavings = weeklyTotals.totalSavings * 6.5 // Project for 52 weeks

    setCalculations({
      totalDebt,
      averageInterestRate,
      totalWeeklyPayments: weeklyTotals.totalWeeklyPayments,
      totalSavings: weeklyTotals.totalSavings,
      projectedSavings
    })
  }, [formData.debts, formData.weeklyData])

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

  const updateDebtField = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      debts: prev.debts.map((debt, i) => 
        i === index ? { ...debt, [field]: value } : debt
      )
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
                <label className="block text-sm font-medium mb-3">
                  List all outstanding debts, including balance and interest rates:
                </label>
                <div className="glass-card overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left py-3 px-2">Debt</th>
                        <th className="text-left py-3 px-2">Balance ($)</th>
                        <th className="text-left py-3 px-2">Interest Rate (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.debts.map((debt, index) => (
                        <tr key={index} className="border-b border-white/10">
                          <td className="py-3 px-2">
                            <input
                              type="text"
                              value={debt.debt}
                              onChange={(e) => updateDebtField(index, 'debt', e.target.value)}
                              className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-400/50"
                              placeholder="Credit Card, Loan, etc."
                            />
                          </td>
                          <td className="py-3 px-2">
                            <input
                              type="number"
                              value={debt.balance}
                              onChange={(e) => updateDebtField(index, 'balance', e.target.value)}
                              className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-400/50"
                              placeholder="0.00"
                            />
                          </td>
                          <td className="py-3 px-2">
                            <input
                              type="number"
                              step="0.01"
                              value={debt.interestRate}
                              onChange={(e) => updateDebtField(index, 'interestRate', e.target.value)}
                              className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-400/50"
                              placeholder="0.00"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  How do these debts affect your monthly budget?
                </label>
                <textarea
                  value={formData.budgetImpact}
                  onChange={(e) => updateFormData('budgetImpact', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  placeholder="Describe how your debts impact your monthly budget..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Have you missed any payments in the past year? What were the causes?
                </label>
                <textarea
                  value={formData.missedPayments}
                  onChange={(e) => updateFormData('missedPayments', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  placeholder="Describe any missed payments and their causes..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  What challenges do you face in paying off debt?
                </label>
                <textarea
                  value={formData.debtChallenges}
                  onChange={(e) => updateFormData('debtChallenges', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  placeholder="List your main challenges in debt repayment..."
                />
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
                  What does financial freedom look like for you?
                </label>
                <textarea
                  value={formData.financialFreedom}
                  onChange={(e) => updateFormData('financialFreedom', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  placeholder="Describe what financial freedom means to you..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  What is your main goal for consolidating debt? (Example: Lower interest rates, simplify payments, reduce monthly obligations, etc.)
                </label>
                <input
                  type="text"
                  value={formData.consolidationGoal}
                  onChange={(e) => updateFormData('consolidationGoal', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  placeholder="Your main consolidation goal..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  How soon would you like to be debt-free?
                </label>
                <input
                  type="text"
                  value={formData.debtFreeTimeline}
                  onChange={(e) => updateFormData('debtFreeTimeline', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  placeholder="e.g., 2 years, 5 years, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Why is eliminating debt important to you?
                </label>
                <textarea
                  value={formData.whyImportant}
                  onChange={(e) => updateFormData('whyImportant', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  placeholder="Explain your motivation for eliminating debt..."
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Explore Consolidation Options</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  What debt consolidation approaches have you researched?
                </label>
                <div className="space-y-3">
                  {formData.researchedOptions.map((option, index) => (
                    <input
                      key={index}
                      type="text"
                      value={option}
                      onChange={(e) => updateArrayField('researchedOptions', index, e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                      placeholder={`Consolidation option ${index + 1}...`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Have you checked your credit score? If so, how might it affect your consolidation options?
                </label>
                <textarea
                  value={formData.creditScore}
                  onChange={(e) => updateFormData('creditScore', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  placeholder="Describe your credit score and its impact on consolidation options..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Which method suits your situation? (Personal loan, balance transfer card, debt management program, etc.)
                </label>
                <input
                  type="text"
                  value={formData.chosenMethod}
                  onChange={(e) => updateFormData('chosenMethod', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  placeholder="Your preferred consolidation method..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  How much could you save in interest by consolidating?
                </label>
                <input
                  type="text"
                  value={formData.interestSavings}
                  onChange={(e) => updateFormData('interestSavings', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  placeholder="Estimated interest savings..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  What are the potential downsides of consolidating your debt?
                </label>
                <textarea
                  value={formData.consolidationDownsides}
                  onChange={(e) => updateFormData('consolidationDownsides', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  placeholder="List potential downsides or risks..."
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Create an Action Plan</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Prioritize Debt Repayment: List up to three debts you plan to consolidate first.
                </label>
                <div className="space-y-3">
                  {formData.priorityDebts.map((debt, index) => (
                    <input
                      key={index}
                      type="text"
                      value={debt}
                      onChange={(e) => updateArrayField('priorityDebts', index, e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                      placeholder={`Priority debt ${index + 1}...`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Adjust Your Budget: What areas can you cut expenses to allocate more funds toward debt?
                </label>
                <div className="space-y-3">
                  {formData.budgetCuts.map((cut, index) => (
                    <input
                      key={index}
                      type="text"
                      value={cut}
                      onChange={(e) => updateArrayField('budgetCuts', index, e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                      placeholder={`Budget cut ${index + 1}...`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Choose a Consolidation Strategy: What is the best consolidation option based on your financial situation?
                </label>
                <input
                  type="text"
                  value={formData.consolidationStrategy}
                  onChange={(e) => updateFormData('consolidationStrategy', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  placeholder="Your chosen consolidation strategy..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Avoid Accumulating New Debt: What methods will you use to avoid accumulating more debt?
                </label>
                <div className="space-y-3">
                  {formData.avoidNewDebt.map((method, index) => (
                    <input
                      key={index}
                      type="text"
                      value={method}
                      onChange={(e) => updateArrayField('avoidNewDebt', index, e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                      placeholder={`Prevention method ${index + 1}...`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Use Financial Tools: What debts and bills can you set up automated payments for?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {formData.automatedPayments.map((payment, index) => (
                    <input
                      key={index}
                      type="text"
                      value={payment}
                      onChange={(e) => updateArrayField('automatedPayments', index, e.target.value)}
                      className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                      placeholder={`Automated payment ${index + 1}...`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  How will you stay on top of your progress (app, paper tracking, etc.)?
                </label>
                <input
                  type="text"
                  value={formData.progressTracking}
                  onChange={(e) => updateFormData('progressTracking', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  placeholder="Your progress tracking method..."
                />
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Track Your Progress</h3>
            
            {/* Calculation Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="glass-card text-center">
                <DollarSign className="h-6 w-6 text-red-400 mx-auto mb-2" />
                <div className="text-lg font-bold text-red-400">
                  ${calculations.totalDebt.toFixed(2)}
                </div>
                <div className="text-xs text-white/60">Total Debt</div>
              </div>
              
              <div className="glass-card text-center">
                <Percent className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                <div className="text-lg font-bold text-yellow-400">
                  {calculations.averageInterestRate.toFixed(2)}%
                </div>
                <div className="text-xs text-white/60">Avg Interest Rate</div>
              </div>
              
              <div className="glass-card text-center">
                <TrendingDown className="h-6 w-6 text-green-400 mx-auto mb-2" />
                <div className="text-lg font-bold text-green-400">
                  ${calculations.totalWeeklyPayments.toFixed(2)}
                </div>
                <div className="text-xs text-white/60">Total Payments</div>
              </div>
              
              <div className="glass-card text-center">
                <PiggyBank className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                <div className="text-lg font-bold text-blue-400">
                  ${calculations.totalSavings.toFixed(2)}
                </div>
                <div className="text-xs text-white/60">Total Savings</div>
              </div>
            </div>

            {/* Weekly Tracking Table */}
            <div className="glass-card overflow-x-auto">
              <h4 className="font-semibold mb-3">8-Week Progress Tracking</h4>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-2">Week</th>
                    <th className="text-left py-3 px-2">Debt Consolidated</th>
                    <th className="text-left py-3 px-2">Amount Paid</th>
                    <th className="text-left py-3 px-2">Interest Before</th>
                    <th className="text-left py-3 px-2">Interest After</th>
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
                          type="text"
                          value={week.debtConsolidated}
                          onChange={(e) => updateWeeklyData(index, 'debtConsolidated', e.target.value)}
                          className="w-24 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-400/50"
                          placeholder="Debt name"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          value={week.amountPaid}
                          onChange={(e) => updateWeeklyData(index, 'amountPaid', e.target.value)}
                          className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-400/50"
                          placeholder="0"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          step="0.01"
                          value={week.interestBefore}
                          onChange={(e) => updateWeeklyData(index, 'interestBefore', e.target.value)}
                          className="w-16 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-400/50"
                          placeholder="0%"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          step="0.01"
                          value={week.interestAfter}
                          onChange={(e) => updateWeeklyData(index, 'interestAfter', e.target.value)}
                          className="w-16 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-400/50"
                          placeholder="0%"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          value={week.savings}
                          onChange={(e) => updateWeeklyData(index, 'savings', e.target.value)}
                          className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-400/50"
                          placeholder="0"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="text"
                          value={week.notes}
                          onChange={(e) => updateWeeklyData(index, 'notes', e.target.value)}
                          className="w-32 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-400/50"
                          placeholder="Notes..."
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Projected Savings */}
            {calculations.totalSavings > 0 && (
              <div className="glass-card">
                <h4 className="font-semibold mb-3">Annual Projection</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      ${calculations.projectedSavings.toFixed(2)}
                    </div>
                    <div className="text-sm text-white/60">Projected Annual Savings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {calculations.totalDebt > 0 ? Math.ceil(calculations.totalDebt / (calculations.totalWeeklyPayments * 4.33)) : 0} months
                    </div>
                    <div className="text-sm text-white/60">Estimated Payoff Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {calculations.totalWeeklyPayments > 0 ? (calculations.totalSavings / calculations.totalWeeklyPayments * 100).toFixed(1) : 0}%
                    </div>
                    <div className="text-sm text-white/60">Savings Rate</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Reflect on Your Progress</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  What challenges have you faced while consolidating debt?
                </label>
                <textarea
                  value={formData.consolidationChallenges}
                  onChange={(e) => updateFormData('consolidationChallenges', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  placeholder="Describe challenges you've faced during consolidation..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  How has consolidation affected your financial stress and cash flow?
                </label>
                <textarea
                  value={formData.stressImpact}
                  onChange={(e) => updateFormData('stressImpact', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  placeholder="Describe the impact on your stress and cash flow..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  What strategies have worked well for staying committed to debt repayment?
                </label>
                <textarea
                  value={formData.workingStrategies}
                  onChange={(e) => updateFormData('workingStrategies', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  placeholder="List strategies that have worked well for you..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  How will you ensure you don't accumulate more debt in the future?
                </label>
                <textarea
                  value={formData.futureDebtPrevention}
                  onChange={(e) => updateFormData('futureDebtPrevention', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  placeholder="Describe your plan to prevent future debt accumulation..."
                />
              </div>
            </div>

            {/* Final Summary */}
            <div className="glass-card bg-gradient-to-r from-green-500/20 to-blue-500/20">
              <h4 className="font-semibold mb-3 text-center">🎉 Congratulations on Your Debt Consolidation Journey!</h4>
              <p className="text-center text-white/80 mb-4">
                Becoming debt-free is a journey that requires patience and consistency. Keep refining your strategy, 
                celebrating your progress, and stay focused on your long-term financial freedom.
              </p>
              
              {calculations.totalSavings > 0 && (
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-400">
                    You've saved ${calculations.totalSavings.toFixed(2)} over 8 weeks!
                  </div>
                  <div className="text-sm text-white/70">
                    Keep up the great work on your path to financial freedom!
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
              <h2 className="text-2xl font-bold gradient-text">Consolidating Debt Worksheet</h2>
              <p className="text-white/70">Interactive debt consolidation planning and tracking tool</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <CreditCard className="h-6 w-6 text-blue-400" />
            <span className="text-sm text-white/70">Debt Consolidation</span>
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

export default ConsolidatingDebtWorksheet
