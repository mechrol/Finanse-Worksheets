import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Brain, 
  Target, 
  Search, 
  TrendingUp, 
  Calculator,
  CheckCircle,
  AlertCircle,
  FileText,
  BarChart3,
  PieChart,
  Download
} from 'lucide-react'
import { saveAs } from 'file-saver'
import { Document, Packer, Paragraph, TextRun } from 'docx'
import toast from 'react-hot-toast'

const ImportedWorksheet = ({ worksheet, onBack }) => {
  const [currentSection, setCurrentSection] = useState(0)
  const [formData, setFormData] = useState({})
  const [calculations, setCalculations] = useState({})
  const [showAnalyticalFramework, setShowAnalyticalFramework] = useState(false)

  useEffect(() => {
    // Initialize form data structure
    const initialData = {}
    worksheet.sections.forEach((section, sectionIndex) => {
      initialData[sectionIndex] = {}
      section.questions.forEach((question, questionIndex) => {
        if (question.type === 'list_item') {
          if (!initialData[sectionIndex].listItems) {
            initialData[sectionIndex].listItems = []
          }
          initialData[sectionIndex].listItems.push('')
        } else {
          initialData[sectionIndex][questionIndex] = ''
        }
      })
    })
    setFormData(initialData)
  }, [worksheet])

  const updateFormData = (sectionIndex, questionIndex, value) => {
    setFormData(prev => ({
      ...prev,
      [sectionIndex]: {
        ...prev[sectionIndex],
        [questionIndex]: value
      }
    }))
  }

  const updateListItem = (sectionIndex, itemIndex, value) => {
    setFormData(prev => ({
      ...prev,
      [sectionIndex]: {
        ...prev[sectionIndex],
        listItems: prev[sectionIndex].listItems?.map((item, i) => 
          i === itemIndex ? value : item
        ) || []
      }
    }))
  }

  const performCalculations = () => {
    // Extract numerical data for calculations
    const numericData = {}
    
    // Look for tracking data (income, expenses, savings)
    Object.entries(formData).forEach(([sectionIndex, sectionData]) => {
      Object.entries(sectionData).forEach(([key, value]) => {
        if (typeof value === 'string' && !isNaN(parseFloat(value))) {
          numericData[`${sectionIndex}_${key}`] = parseFloat(value)
        }
      })
    })

    // Perform analytical calculations based on the framework
    const results = {}
    
    if (worksheet.analyticalFramework?.calculationStudies) {
      worksheet.analyticalFramework.calculationStudies.forEach(study => {
        switch (study.name) {
          case 'Savings Rate Analysis':
            const totalIncome = Object.values(numericData).filter((_, i) => i % 4 === 0).reduce((a, b) => a + b, 0)
            const totalSavings = Object.values(numericData).filter((_, i) => i % 4 === 3).reduce((a, b) => a + b, 0)
            results[study.name] = totalIncome > 0 ? (totalSavings / totalIncome * 100).toFixed(2) : 0
            break
          case 'Expense Reduction Impact':
            const expenses = Object.values(numericData).filter((_, i) => i % 4 === 1 || i % 4 === 2)
            results[study.name] = expenses.reduce((a, b) => a + b, 0).toFixed(2)
            break
          default:
            results[study.name] = 'Calculation pending'
        }
      })
    }

    setCalculations(results)
  }

  const exportWorksheetResults = async () => {
    try {
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${worksheet.name} - Completed Results`,
                  bold: true,
                  size: 28
                })
              ]
            }),
            new Paragraph({ text: "" }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Completed on: ${new Date().toLocaleDateString()}`,
                  size: 20
                })
              ]
            }),
            new Paragraph({ text: "" }),

            // Add sections and responses
            ...worksheet.sections.map((section, sectionIndex) => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: section.title,
                    bold: true,
                    size: 24
                  })
                ]
              }),
              new Paragraph({ text: "" }),
              ...section.questions.map((question, questionIndex) => [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: question.question,
                      bold: true,
                      size: 18
                    })
                  ]
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: formData[sectionIndex]?.[questionIndex] || 'No response',
                      size: 16
                    })
                  ]
                }),
                new Paragraph({ text: "" })
              ]).flat()
            ]).flat(),

            // Add calculations if available
            Object.keys(calculations).length > 0 ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "CALCULATION RESULTS",
                    bold: true,
                    size: 24
                  })
                ]
              }),
              new Paragraph({ text: "" }),
              ...Object.entries(calculations).map(([name, value]) => 
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${name}: ${value}`,
                      size: 18
                    })
                  ]
                })
              )
            ] : []
          ].flat()
        }]
      })

      const blob = await Packer.toBlob(doc)
      saveAs(blob, `${worksheet.name}_Results.docx`)
      toast.success('Worksheet results exported!')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Error exporting results')
    }
  }

  const renderQuestion = (question, sectionIndex, questionIndex) => {
    const value = formData[sectionIndex]?.[questionIndex] || ''

    switch (question.type) {
      case 'text':
        return (
          <textarea
            value={value}
            onChange={(e) => updateFormData(sectionIndex, questionIndex, e.target.value)}
            rows={3}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
            placeholder="Enter your response..."
          />
        )
      case 'input':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => updateFormData(sectionIndex, questionIndex, e.target.value)}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
            placeholder="Enter your response..."
          />
        )
      case 'list_item':
        const listItems = formData[sectionIndex]?.listItems || []
        return (
          <div className="space-y-2">
            {[...Array(3)].map((_, itemIndex) => (
              <input
                key={itemIndex}
                type="text"
                value={listItems[itemIndex] || ''}
                onChange={(e) => updateListItem(sectionIndex, itemIndex, e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                placeholder={`Item ${itemIndex + 1}...`}
              />
            ))}
          </div>
        )
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => updateFormData(sectionIndex, questionIndex, e.target.value)}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
            placeholder="Enter your response..."
          />
        )
    }
  }

  const renderAnalyticalFramework = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <Brain className="h-6 w-6 mr-2 text-purple-400" />
        Analytical Framework
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Assumptions */}
        <div className="glass-card">
          <h4 className="font-semibold text-blue-400 mb-3 flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Assumptions
          </h4>
          <ul className="space-y-2">
            {worksheet.analyticalFramework.assumptions.map((assumption, index) => (
              <li key={index} className="text-sm text-white/80 flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                {assumption}
              </li>
            ))}
          </ul>
        </div>

        {/* Hypothesis */}
        <div className="glass-card">
          <h4 className="font-semibold text-green-400 mb-3 flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Hypothesis
          </h4>
          <ul className="space-y-2">
            {worksheet.analyticalFramework.hypothesis.map((hyp, index) => (
              <li key={index} className="text-sm text-white/80 flex items-start">
                <span className="text-green-400 mr-2">•</span>
                {hyp}
              </li>
            ))}
          </ul>
        </div>

        {/* Evidence */}
        <div className="glass-card">
          <h4 className="font-semibold text-yellow-400 mb-3 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Evidence to Collect
          </h4>
          <ul className="space-y-2">
            {worksheet.analyticalFramework.evidenceToCollect.map((evidence, index) => (
              <li key={index} className="text-sm text-white/80 flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                {evidence}
              </li>
            ))}
          </ul>
        </div>

        {/* Expected Conclusions */}
        <div className="glass-card">
          <h4 className="font-semibold text-purple-400 mb-3 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Expected Conclusions
          </h4>
          <ul className="space-y-2">
            {worksheet.analyticalFramework.expectedConclusions.map((conclusion, index) => (
              <li key={index} className="text-sm text-white/80 flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                {conclusion}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Calculation Studies */}
      <div className="glass-card">
        <h4 className="font-semibold text-orange-400 mb-3 flex items-center">
          <Calculator className="h-5 w-5 mr-2" />
          Calculation Studies
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {worksheet.analyticalFramework.calculationStudies.map((study, index) => (
            <div key={index} className="bg-white/5 p-4 rounded-lg">
              <h5 className="font-medium text-white mb-2">{study.name}</h5>
              <p className="text-sm text-white/70 mb-1">Formula: {study.formula}</p>
              <p className="text-sm text-white/60 mb-2">{study.purpose}</p>
              <p className="text-xs text-orange-400">{study.targetMetric}</p>
              {calculations[study.name] && (
                <div className="mt-2 p-2 bg-green-500/20 rounded">
                  <span className="text-green-400 font-medium">Result: {calculations[study.name]}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )

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
              <h2 className="text-2xl font-bold gradient-text">{worksheet.name}</h2>
              <p className="text-white/70">Imported Document Worksheet with Analytical Framework</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={() => setShowAnalyticalFramework(!showAnalyticalFramework)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`glass-button flex items-center space-x-2 ${
                showAnalyticalFramework ? 'bg-purple-500/20' : ''
              }`}
            >
              <Brain className="h-4 w-4" />
              <span>Framework</span>
            </motion.button>
            
            <motion.button
              onClick={performCalculations}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-button flex items-center space-x-2"
            >
              <Calculator className="h-4 w-4" />
              <span>Calculate</span>
            </motion.button>
            
            <motion.button
              onClick={exportWorksheetResults}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-button flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </motion.button>
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
              onClick={() => setCurrentSection(index)}
              className={`px-4 py-2 rounded-lg transition-all text-sm ${
                currentSection === index
                  ? 'bg-blue-500/30 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {section.title}
            </motion.button>
          ))}
          
          <motion.button
            onClick={() => setShowAnalyticalFramework(true)}
            className="px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-all text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Brain className="h-4 w-4 inline mr-1" />
            Analytical Framework
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        key={showAnalyticalFramework ? 'framework' : currentSection}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="glass-card"
      >
        {showAnalyticalFramework ? (
          renderAnalyticalFramework()
        ) : (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">
              {worksheet.sections[currentSection]?.title}
            </h3>
            
            <div className="space-y-4">
              {worksheet.sections[currentSection]?.questions.map((question, questionIndex) => (
                <div key={questionIndex} className="space-y-2">
                  <label className="block text-sm font-medium text-white/90">
                    {question.question}
                    {question.required && <span className="text-red-400 ml-1">*</span>}
                  </label>
                  {renderQuestion(question, currentSection, questionIndex)}
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Calculation Results */}
      {Object.keys(calculations).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
            Calculation Results
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(calculations).map(([name, value]) => (
              <div key={name} className="bg-white/5 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-400">{value}</div>
                <div className="text-sm text-white/60">{name}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      {!showAnalyticalFramework && (
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
            onClick={() => setCurrentSection(Math.min(worksheet.sections.length - 1, currentSection + 1))}
            disabled={currentSection === worksheet.sections.length - 1}
            className={`px-6 py-2 rounded-lg flex items-center space-x-2 ${
              currentSection === worksheet.sections.length - 1
                ? 'bg-white/10 text-white/50 cursor-not-allowed'
                : 'glass-button'
            }`}
            whileHover={currentSection < worksheet.sections.length - 1 ? { scale: 1.05 } : {}}
            whileTap={currentSection < worksheet.sections.length - 1 ? { scale: 0.95 } : {}}
          >
            <span>Next</span>
            <TrendingUp className="h-4 w-4" />
          </motion.button>
        </div>
      )}
    </div>
  )
}

export default ImportedWorksheet
