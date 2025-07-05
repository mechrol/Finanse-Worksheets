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
  Calendar,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'
import toast from 'react-hot-toast'

const ImportedWorksheet = ({ worksheet, onBack }) => {
  const [activeSection, setActiveSection] = useState(0)
  const [formData, setFormData] = useState({})
  const [calculations, setCalculations] = useState({})

  // Initialize form data based on worksheet sections
  useEffect(() => {
    if (worksheet?.sections) {
      const initialData = {}
      worksheet.sections.forEach((section, sectionIndex) => {
        section.fields?.forEach((field, fieldIndex) => {
          const key = `${sectionIndex}_${fieldIndex}`
          initialData[key] = field.defaultValue || ''
        })
      })
      setFormData(initialData)
    }
  }, [worksheet])

  // Calculate totals and derived values
  useEffect(() => {
    const newCalculations = {}
    
    // Example calculations based on common financial worksheet patterns
    const monthlyIncome = parseFloat(formData['0_0']) || 0
    const monthlyExpenses = parseFloat(formData['0_1']) || 0
    const savingsGoal = parseFloat(formData['1_0']) || 0
    
    newCalculations.netIncome = monthlyIncome - monthlyExpenses
    newCalculations.savingsRate = monthlyIncome > 0 ? ((savingsGoal / monthlyIncome) * 100).toFixed(1) : 0
    newCalculations.emergencyFund = monthlyExpenses * 6
    newCalculations.debtToIncomeRatio = monthlyIncome > 0 ? ((monthlyExpenses / monthlyIncome) * 100).toFixed(1) : 0
    
    setCalculations(newCalculations)
  }, [formData])

  const handleInputChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSectionComplete = () => {
    if (activeSection < worksheet.sections.length - 1) {
      setActiveSection(activeSection + 1)
      toast.success('Section completed!')
    } else {
      toast.success('Worksheet completed!')
    }
  }

  const getFieldIcon = (type) => {
    switch (type) {
      case 'currency': return DollarSign
      case 'percentage': return PieChart
      case 'date': return Calendar
      case 'number': return Calculator
      default: return Info
    }
  }

  const renderField = (field, sectionIndex, fieldIndex) => {
    const key = `${sectionIndex}_${fieldIndex}`
    const Icon = getFieldIcon(field.type)
    
    return (
      <motion.div
        key={key}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: fieldIndex * 0.1 }}
        className="glass-card"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Icon className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h4 className="font-semibold text-white">{field.label}</h4>
            {field.description && (
              <p className="text-sm text-white/60">{field.description}</p>
            )}
          </div>
        </div>
        
        <div className="space-y-3">
          {field.type === 'select' ? (
            <select
              value={formData[key] || ''}
              onChange={(e) => handleInputChange(key, e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50"
            >
              <option value="">Select an option</option>
              {field.options?.map((option, idx) => (
                <option key={idx} value={option} className="bg-gray-800">
                  {option}
                </option>
              ))}
            </select>
          ) : field.type === 'textarea' ? (
            <textarea
              value={formData[key] || ''}
              onChange={(e) => handleInputChange(key, e.target.value)}
              placeholder={field.placeholder}
              rows={4}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 resize-none"
            />
          ) : (
            <input
              type={field.type === 'currency' || field.type === 'percentage' ? 'number' : field.type}
              value={formData[key] || ''}
              onChange={(e) => handleInputChange(key, e.target.value)}
              placeholder={field.placeholder}
              step={field.type === 'currency' ? '0.01' : field.type === 'percentage' ? '0.1' : undefined}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
            />
          )}
          
          {field.type === 'currency' && formData[key] && (
            <div className="text-sm text-green-400">
              ${parseFloat(formData[key] || 0).toLocaleString()}
            </div>
          )}
          
          {field.type === 'percentage' && formData[key] && (
            <div className="text-sm text-blue-400">
              {formData[key]}%
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  const renderCalculations = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-green-500/20 rounded-lg">
          <Calculator className="h-5 w-5 text-green-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">Live Calculations</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-sm text-white/60 mb-1">Net Income</div>
          <div className={`text-xl font-bold ${calculations.netIncome >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ${calculations.netIncome?.toLocaleString() || '0'}
          </div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-sm text-white/60 mb-1">Savings Rate</div>
          <div className="text-xl font-bold text-blue-400">
            {calculations.savingsRate || '0'}%
          </div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-sm text-white/60 mb-1">Emergency Fund Goal</div>
          <div className="text-xl font-bold text-purple-400">
            ${calculations.emergencyFund?.toLocaleString() || '0'}
          </div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-sm text-white/60 mb-1">Debt-to-Income Ratio</div>
          <div className={`text-xl font-bold ${parseFloat(calculations.debtToIncomeRatio) > 40 ? 'text-red-400' : 'text-green-400'}`}>
            {calculations.debtToIncomeRatio || '0'}%
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-400 mb-1">Financial Health Tips</h4>
            <ul className="text-sm text-white/80 space-y-1">
              <li>• Aim for a debt-to-income ratio below 40%</li>
              <li>• Save at least 20% of your income</li>
              <li>• Build an emergency fund of 6 months expenses</li>
              <li>• Review and adjust your budget monthly</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  )

  if (!worksheet || !worksheet.sections) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Worksheet Not Found</h3>
          <p className="text-white/60">The requested worksheet could not be loaded.</p>
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 glass-button"
          >
            Go Back
          </motion.button>
        </div>
      </div>
    )
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
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={onBack}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </motion.button>
            
            <div>
              <h1 className="text-2xl font-bold gradient-text">{worksheet.name}</h1>
              <p className="text-white/70">{worksheet.description}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm text-white/60">Progress</div>
              <div className="text-lg font-semibold text-purple-400">
                {activeSection + 1} / {worksheet.sections.length}
              </div>
            </div>
            
            <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-400 to-blue-400"
                initial={{ width: 0 }}
                animate={{ width: `${((activeSection + 1) / worksheet.sections.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Section Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card"
      >
        <div className="flex flex-wrap gap-2">
          {worksheet.sections.map((section, index) => (
            <motion.button
              key={index}
              onClick={() => setActiveSection(index)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeSection === index
                  ? 'bg-purple-500/30 text-purple-300 ring-2 ring-purple-400/50'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {section.title}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Active Section Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Brain className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {worksheet.sections[activeSection]?.title}
                </h2>
                <p className="text-white/60">
                  {worksheet.sections[activeSection]?.description}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              {worksheet.sections[activeSection]?.fields?.map((field, fieldIndex) =>
                renderField(field, activeSection, fieldIndex)
              )}
            </div>
            
            <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
              <motion.button
                onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
                disabled={activeSection === 0}
                whileHover={{ scale: activeSection > 0 ? 1.05 : 1 }}
                whileTap={{ scale: activeSection > 0 ? 0.95 : 1 }}
                className={`glass-button ${
                  activeSection === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Previous Section
              </motion.button>
              
              <motion.button
                onClick={handleSectionComplete}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-button bg-purple-500/20 text-purple-300 border-purple-400/30"
              >
                {activeSection === worksheet.sections.length - 1 ? 'Complete Worksheet' : 'Next Section'}
              </motion.button>
            </div>
          </motion.div>
        </div>
        
        {/* Calculations Sidebar */}
        <div className="space-y-6">
          {renderCalculations()}
          
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full glass-button flex items-center space-x-2"
              >
                <Target className="h-4 w-4" />
                <span>Save Progress</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full glass-button flex items-center space-x-2"
              >
                <TrendingUp className="h-4 w-4" />
                <span>Generate Report</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full glass-button flex items-center space-x-2"
              >
                <Search className="h-4 w-4" />
                <span>Get Insights</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ImportedWorksheet
