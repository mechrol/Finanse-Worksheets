import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle, 
  Circle, 
  Target, 
  TrendingUp, 
  Heart, 
  DollarSign,
  Download,
  FileText,
  Loader2
} from 'lucide-react'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const ChecklistTab = () => {
  const [activeChecklist, setActiveChecklist] = useState('goal-setting')
  const [checkedItems, setCheckedItems] = useState({})
  const [isExporting, setIsExporting] = useState(false)
  const checklistRef = useRef(null)

  const checklists = {
    'goal-setting': {
      title: 'Goal Setting & Planning',
      icon: Target,
      color: 'from-purple-500 to-pink-500',
      items: [
        { id: 'vision', text: 'Define your long-term vision (5-10 years)', type: 'yes-no' },
        { id: 'smart-goals', text: 'Set SMART goals for this year', type: 'yes-no' },
        { id: 'quarterly', text: 'Break down annual goals into quarterly milestones', type: 'yes-no' },
        { id: 'monthly', text: 'Create monthly action plans', type: 'yes-no' },
        { id: 'weekly', text: 'Plan weekly priorities', type: 'yes-no' },
        { id: 'daily', text: 'Establish daily routines', type: 'yes-no' },
        { id: 'review', text: 'Schedule regular goal review sessions', type: 'yes-no' },
        { id: 'accountability', text: 'Find an accountability partner', type: 'yes-no' },
        { id: 'obstacles', text: 'Identify potential obstacles and solutions', type: 'yes-no' },
        { id: 'celebrate', text: 'Plan how to celebrate achievements', type: 'yes-no' }
      ]
    },
    'productivity': {
      title: 'Productivity & Time Management',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500',
      items: [
        { id: 'time-audit', text: 'Complete a time audit for one week', type: 'yes-no' },
        { id: 'priorities', text: 'Identify your top 3 daily priorities', type: 'yes-no' },
        { id: 'time-blocks', text: 'Use time blocking for important tasks', type: 'yes-no' },
        { id: 'distractions', text: 'Eliminate or minimize distractions', type: 'yes-no' },
        { id: 'pomodoro', text: 'Try the Pomodoro Technique', type: 'yes-no' },
        { id: 'delegate', text: 'Identify tasks you can delegate', type: 'yes-no' },
        { id: 'automation', text: 'Automate repetitive tasks', type: 'yes-no' },
        { id: 'workspace', text: 'Organize your workspace', type: 'yes-no' },
        { id: 'breaks', text: 'Schedule regular breaks', type: 'yes-no' },
        { id: 'energy', text: 'Identify your peak energy hours', type: 'yes-no' }
      ]
    },
    'financial': {
      title: 'Financial Health',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      items: [
        { id: 'budget', text: 'Create a monthly budget', type: 'yes-no' },
        { id: 'emergency', text: 'Build an emergency fund (3-6 months expenses)', type: 'yes-no' },
        { id: 'debt', text: 'Create a debt payoff plan', type: 'yes-no' },
        { id: 'savings', text: 'Automate your savings', type: 'yes-no' },
        { id: 'investments', text: 'Start investing (even small amounts)', type: 'yes-no' },
        { id: 'insurance', text: 'Review your insurance coverage', type: 'yes-no' },
        { id: 'retirement', text: 'Contribute to retirement accounts', type: 'yes-no' },
        { id: 'expenses', text: 'Track all expenses for one month', type: 'yes-no' },
        { id: 'subscriptions', text: 'Cancel unused subscriptions', type: 'yes-no' },
        { id: 'financial-goals', text: 'Set specific financial goals', type: 'yes-no' }
      ]
    },
    'wellness': {
      title: 'Health & Wellness',
      icon: Heart,
      color: 'from-red-500 to-pink-500',
      items: [
        { id: 'exercise', text: 'Exercise at least 30 minutes, 3x per week', type: 'yes-no' },
        { id: 'water', text: 'Drink 8 glasses of water daily', type: 'yes-no' },
        { id: 'sleep', text: 'Get 7-9 hours of sleep nightly', type: 'yes-no' },
        { id: 'nutrition', text: 'Eat 5 servings of fruits/vegetables daily', type: 'yes-no' },
        { id: 'meditation', text: 'Practice meditation or mindfulness', type: 'yes-no' },
        { id: 'checkup', text: 'Schedule annual health checkup', type: 'yes-no' },
        { id: 'stress', text: 'Develop stress management techniques', type: 'yes-no' },
        { id: 'social', text: 'Maintain social connections', type: 'yes-no' },
        { id: 'hobbies', text: 'Engage in hobbies you enjoy', type: 'yes-no' },
        { id: 'screen-time', text: 'Limit recreational screen time', type: 'yes-no' }
      ]
    }
  }

  const handleItemToggle = (checklistId, itemId) => {
    const key = `${checklistId}-${itemId}`
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const getCompletionPercentage = (checklistId) => {
    const checklist = checklists[checklistId]
    const totalItems = checklist.items.length
    const completedItems = checklist.items.filter(item => 
      checkedItems[`${checklistId}-${item.id}`]
    ).length
    return Math.round((completedItems / totalItems) * 100)
  }

  const exportToPDF = async () => {
    if (!checklistRef.current) return

    setIsExporting(true)
    toast.loading('Generating PDF...', { id: 'pdf-export' })

    try {
      // Create a new jsPDF instance
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      
      // Add title
      pdf.setFontSize(20)
      pdf.setTextColor(127, 0, 255) // Purple color
      pdf.text('Personal Development Checklists', pageWidth / 2, 20, { align: 'center' })
      
      // Add date
      pdf.setFontSize(12)
      pdf.setTextColor(100, 100, 100)
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' })
      
      let yPosition = 50

      // Add each checklist
      Object.entries(checklists).forEach(([checklistId, checklist]) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 60) {
          pdf.addPage()
          yPosition = 20
        }

        // Checklist title
        pdf.setFontSize(16)
        pdf.setTextColor(0, 0, 0)
        pdf.text(checklist.title, 20, yPosition)
        
        // Completion percentage
        const completion = getCompletionPercentage(checklistId)
        pdf.setFontSize(12)
        pdf.setTextColor(127, 0, 255)
        pdf.text(`${completion}% Complete`, pageWidth - 20, yPosition, { align: 'right' })
        
        yPosition += 10

        // Add items
        checklist.items.forEach((item, index) => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage()
            yPosition = 20
          }

          const isChecked = checkedItems[`${checklistId}-${item.id}`]
          
          // Checkbox
          pdf.setDrawColor(0, 0, 0)
          pdf.rect(20, yPosition - 3, 4, 4)
          
          if (isChecked) {
            pdf.setTextColor(0, 150, 0)
            pdf.text('✓', 21, yPosition)
          }
          
          // Item text
          pdf.setTextColor(0, 0, 0)
          pdf.setFontSize(10)
          const lines = pdf.splitTextToSize(item.text, pageWidth - 40)
          pdf.text(lines, 30, yPosition)
          
          yPosition += Math.max(6, lines.length * 4)
        })

        yPosition += 10 // Space between checklists
      })

      // Add summary page
      pdf.addPage()
      pdf.setFontSize(18)
      pdf.setTextColor(127, 0, 255)
      pdf.text('Progress Summary', pageWidth / 2, 30, { align: 'center' })

      yPosition = 50
      Object.entries(checklists).forEach(([checklistId, checklist]) => {
        const completion = getCompletionPercentage(checklistId)
        const completedItems = checklist.items.filter(item => 
          checkedItems[`${checklistId}-${item.id}`]
        ).length
        
        pdf.setFontSize(14)
        pdf.setTextColor(0, 0, 0)
        pdf.text(checklist.title, 20, yPosition)
        
        pdf.setFontSize(12)
        pdf.setTextColor(completion === 100 ? 0 : 150, completion === 100 ? 150 : 0, 0)
        pdf.text(`${completedItems}/${checklist.items.length} items (${completion}%)`, pageWidth - 20, yPosition, { align: 'right' })
        
        yPosition += 15
      })

      // Save the PDF
      pdf.save('personal-development-checklists.pdf')
      
      toast.success('PDF exported successfully!', { id: 'pdf-export' })
    } catch (error) {
      console.error('Error exporting PDF:', error)
      toast.error('Failed to export PDF', { id: 'pdf-export' })
    } finally {
      setIsExporting(false)
    }
  }

  const currentChecklist = checklists[activeChecklist]

  return (
    <div className="space-y-8" ref={checklistRef}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold gradient-text mb-2">Personal Development Checklists</h2>
        <p className="text-white/70">Track your progress across key life areas</p>
        
        {/* Export Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportToPDF}
          disabled={isExporting}
          className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
        >
          {isExporting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Download className="h-5 w-5" />
          )}
          <span>{isExporting ? 'Generating PDF...' : 'Export to PDF'}</span>
        </motion.button>
      </motion.div>

      {/* Checklist Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass-card"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(checklists).map(([id, checklist]) => {
            const Icon = checklist.icon
            const completion = getCompletionPercentage(id)
            
            return (
              <motion.button
                key={id}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveChecklist(id)}
                className={`p-4 rounded-xl transition-all duration-300 text-left ${
                  activeChecklist === id
                    ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-400/50'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10'
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${checklist.color}`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-medium text-white">{checklist.title}</h3>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Progress</span>
                    <span className="text-white font-medium">{completion}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${completion}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className={`h-2 rounded-full bg-gradient-to-r ${checklist.color}`}
                    />
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Active Checklist */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeChecklist}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="glass-card"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${currentChecklist.color}`}>
              <currentChecklist.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{currentChecklist.title}</h3>
              <p className="text-white/70">
                {currentChecklist.items.filter(item => checkedItems[`${activeChecklist}-${item.id}`]).length} of {currentChecklist.items.length} completed
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {currentChecklist.items.map((item, index) => {
              const isChecked = checkedItems[`${activeChecklist}-${item.id}`]
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                    isChecked
                      ? 'bg-green-500/10 border-green-400/50'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                  onClick={() => handleItemToggle(activeChecklist, item.id)}
                >
                  <div className="flex items-center space-x-4">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex-shrink-0"
                    >
                      {isChecked ? (
                        <CheckCircle className="h-6 w-6 text-green-400" />
                      ) : (
                        <Circle className="h-6 w-6 text-white/50" />
                      )}
                    </motion.div>
                    
                    <div className="flex-1">
                      <p className={`font-medium ${isChecked ? 'text-green-400' : 'text-white'}`}>
                        {item.text}
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          setCheckedItems(prev => ({
                            ...prev,
                            [`${activeChecklist}-${item.id}`]: true
                          }))
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          isChecked === true
                            ? 'bg-green-500/20 text-green-400 border border-green-400/50'
                            : 'bg-white/10 text-white/70 hover:bg-green-500/20 hover:text-green-400'
                        }`}
                      >
                        YES
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          setCheckedItems(prev => ({
                            ...prev,
                            [`${activeChecklist}-${item.id}`]: false
                          }))
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          isChecked === false
                            ? 'bg-red-500/20 text-red-400 border border-red-400/50'
                            : 'bg-white/10 text-white/70 hover:bg-red-500/20 hover:text-red-400'
                        }`}
                      >
                        NO
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Challenge Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open('https://kontrakt.aitribes.app/ft/eXDMm', '_blank')}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
            >
              Take the Challenge →
            </motion.button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default ChecklistTab
