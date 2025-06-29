import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, 
  FileText, 
  Download, 
  X, 
  CheckCircle, 
  AlertCircle,
  Brain,
  Target,
  Search,
  TrendingUp,
  Calculator
} from 'lucide-react'
import mammoth from 'mammoth'
import { saveAs } from 'file-saver'
import { Document, Packer, Paragraph, TextRun } from 'docx'
import toast from 'react-hot-toast'

const DocumentProcessor = ({ onClose, onWorksheetCreated }) => {
  const [dragActive, setDragActive] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [parsedContent, setParsedContent] = useState(null)
  const [analyticalForm, setAnalyticalForm] = useState(null)
  const [currentStep, setCurrentStep] = useState('upload') // upload, analyze, form, complete

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleFileInput = (e) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleFile = async (file) => {
    if (!file.name.endsWith('.docx') && !file.name.endsWith('.doc')) {
      toast.error('Please upload a .docx or .doc file')
      return
    }

    setProcessing(true)
    setCurrentStep('analyze')

    try {
      const arrayBuffer = await file.arrayBuffer()
      const result = await mammoth.extractRawText({ arrayBuffer })
      const content = result.value

      // Parse the document content
      const parsed = parseDocumentContent(content, file.name)
      setParsedContent(parsed)

      // Generate analytical form
      const analytical = generateAnalyticalForm(parsed)
      setAnalyticalForm(analytical)

      setCurrentStep('form')
      toast.success('Document processed successfully!')
    } catch (error) {
      console.error('Error processing document:', error)
      toast.error('Error processing document')
      setCurrentStep('upload')
    } finally {
      setProcessing(false)
    }
  }

  const parseDocumentContent = (content, filename) => {
    const sections = []
    const lines = content.split('\n').filter(line => line.trim())
    
    let currentSection = null
    let currentQuestions = []

    for (const line of lines) {
      const trimmed = line.trim()
      
      // Detect section headers
      if (trimmed.includes('Reflect on Your Current Practices') || 
          trimmed.includes('Define Your Goals') ||
          trimmed.includes('Create an Action Plan') ||
          trimmed.includes('Track Your Progress') ||
          trimmed.includes('Reflect on Your Progress')) {
        
        if (currentSection) {
          sections.push({
            ...currentSection,
            questions: currentQuestions
          })
        }
        
        currentSection = {
          title: trimmed,
          type: getSectionType(trimmed)
        }
        currentQuestions = []
      }
      // Detect questions (lines ending with ?)
      else if (trimmed.endsWith('?')) {
        currentQuestions.push({
          question: trimmed,
          type: 'text',
          required: true
        })
      }
      // Detect fill-in-the-blank fields
      else if (trimmed.includes('_____')) {
        const question = trimmed.replace(/_+/g, '').trim()
        if (question) {
          currentQuestions.push({
            question: question,
            type: 'input',
            required: true
          })
        }
      }
      // Detect bullet point lists
      else if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
        currentQuestions.push({
          question: trimmed.replace(/^[•-]\s*/, ''),
          type: 'list_item',
          required: false
        })
      }
    }

    // Add the last section
    if (currentSection) {
      sections.push({
        ...currentSection,
        questions: currentQuestions
      })
    }

    return {
      title: filename.replace(/\.(docx?|doc)$/i, ''),
      originalContent: content,
      sections: sections,
      metadata: {
        processedAt: new Date().toISOString(),
        totalSections: sections.length,
        totalQuestions: sections.reduce((sum, s) => sum + s.questions.length, 0)
      }
    }
  }

  const getSectionType = (title) => {
    if (title.includes('Reflect') && title.includes('Current')) return 'reflection'
    if (title.includes('Goals')) return 'goals'
    if (title.includes('Action Plan')) return 'planning'
    if (title.includes('Track') && title.includes('Progress')) return 'tracking'
    if (title.includes('Reflect') && title.includes('Progress')) return 'evaluation'
    return 'general'
  }

  const generateAnalyticalForm = (parsedContent) => {
    return {
      assumptions: [
        'Users have basic financial literacy and understanding of income/expense concepts',
        'Participants are motivated to change their financial habits',
        'The paycheck-to-paycheck cycle is primarily due to spending habits rather than insufficient income',
        'Tracking and awareness will lead to behavioral changes',
        'Small incremental changes can compound into significant financial improvements'
      ],
      hypothesis: [
        'Structured reflection on current financial practices will increase awareness of spending patterns',
        'Setting specific, measurable financial goals will improve motivation and focus',
        'Creating a detailed action plan will increase the likelihood of successful behavior change',
        'Regular progress tracking will maintain accountability and enable course corrections',
        'Combining multiple strategies (budgeting, expense reduction, income increase) will be more effective than single approaches'
      ],
      evidenceToCollect: [
        'Weekly income and expense data over 4-week period',
        'Savings rate percentage and absolute amounts',
        'Number of identified expense reduction opportunities',
        'Success rate of implementing planned changes',
        'Participant self-reported stress levels and confidence',
        'Comparison of pre/post financial awareness scores',
        'Long-term follow-up on sustained behavior changes'
      ],
      expectedConclusions: [
        'Participants will demonstrate improved financial awareness through detailed expense tracking',
        'Goal-setting exercises will result in clearer financial priorities and motivation',
        'Action planning will lead to concrete behavioral changes in spending and saving',
        'Progress tracking will reveal patterns and enable data-driven adjustments',
        'Overall financial stress will decrease as control and predictability increase'
      ],
      calculationStudies: [
        {
          name: 'Savings Rate Analysis',
          formula: '(Total Savings / Total Income) × 100',
          purpose: 'Measure the percentage of income successfully saved',
          targetMetric: 'Achieve minimum 5-10% savings rate'
        },
        {
          name: 'Expense Reduction Impact',
          formula: 'Previous Month Expenses - Current Month Expenses',
          purpose: 'Quantify the financial impact of expense reduction strategies',
          targetMetric: 'Reduce discretionary spending by 15-20%'
        },
        {
          name: 'Emergency Fund Progress',
          formula: 'Total Savings / Monthly Essential Expenses',
          purpose: 'Track progress toward emergency fund goal',
          targetMetric: 'Build 1-month emergency fund within 6 months'
        },
        {
          name: 'Financial Stress Index',
          formula: '(Essential Expenses / Total Income) × 100',
          purpose: 'Measure financial pressure and stability',
          targetMetric: 'Keep essential expenses below 70% of income'
        }
      ]
    }
  }

  const createInteractiveWorksheet = () => {
    const worksheetData = {
      id: Date.now(),
      name: parsedContent.title,
      type: 'Imported Document',
      status: 'interactive',
      isInteractive: true,
      sections: parsedContent.sections,
      analyticalFramework: analyticalForm,
      createdAt: new Date().toISOString()
    }

    onWorksheetCreated(worksheetData)
    toast.success('Interactive worksheet created!')
    onClose()
  }

  const exportAnalyticalReport = async () => {
    try {
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `Analytical Framework Report: ${parsedContent.title}`,
                  bold: true,
                  size: 28
                })
              ]
            }),
            new Paragraph({ text: "" }),
            
            // Assumptions Section
            new Paragraph({
              children: [
                new TextRun({
                  text: "ASSUMPTIONS",
                  bold: true,
                  size: 24
                })
              ]
            }),
            ...analyticalForm.assumptions.map(assumption => 
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${assumption}`,
                    size: 20
                  })
                ]
              })
            ),
            new Paragraph({ text: "" }),
            
            // Hypothesis Section
            new Paragraph({
              children: [
                new TextRun({
                  text: "HYPOTHESIS",
                  bold: true,
                  size: 24
                })
              ]
            }),
            ...analyticalForm.hypothesis.map(hyp => 
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${hyp}`,
                    size: 20
                  })
                ]
              })
            ),
            new Paragraph({ text: "" }),
            
            // Evidence Section
            new Paragraph({
              children: [
                new TextRun({
                  text: "EVIDENCE TO COLLECT",
                  bold: true,
                  size: 24
                })
              ]
            }),
            ...analyticalForm.evidenceToCollect.map(evidence => 
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${evidence}`,
                    size: 20
                  })
                ]
              })
            ),
            new Paragraph({ text: "" }),
            
            // Conclusions Section
            new Paragraph({
              children: [
                new TextRun({
                  text: "EXPECTED CONCLUSIONS",
                  bold: true,
                  size: 24
                })
              ]
            }),
            ...analyticalForm.expectedConclusions.map(conclusion => 
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${conclusion}`,
                    size: 20
                  })
                ]
              })
            ),
            new Paragraph({ text: "" }),
            
            // Calculation Studies Section
            new Paragraph({
              children: [
                new TextRun({
                  text: "CALCULATION STUDIES",
                  bold: true,
                  size: 24
                })
              ]
            }),
            ...analyticalForm.calculationStudies.map(study => 
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${study.name}: ${study.formula}`,
                    bold: true,
                    size: 20
                  })
                ]
              })
            )
          ]
        }]
      })

      const blob = await Packer.toBlob(doc)
      saveAs(blob, `${parsedContent.title}_Analytical_Framework.docx`)
      toast.success('Analytical report exported!')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Error exporting report')
    }
  }

  const renderUploadStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Upload className="h-12 w-12 text-blue-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Import Document</h3>
        <p className="text-white/70">Upload a .docx file to create an analytical worksheet</p>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-400 bg-blue-400/10' 
            : 'border-white/30 hover:border-white/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <FileText className="h-16 w-16 text-white/50 mx-auto mb-4" />
        <p className="text-lg mb-2">Drag and drop your .docx file here</p>
        <p className="text-white/60 mb-4">or</p>
        <label className="glass-button inline-flex items-center space-x-2 cursor-pointer">
          <Upload className="h-4 w-4" />
          <span>Browse Files</span>
          <input
            type="file"
            accept=".docx,.doc"
            onChange={handleFileInput}
            className="hidden"
          />
        </label>
      </div>
    </div>
  )

  const renderAnalysisStep = () => (
    <div className="space-y-6 text-center">
      <div className="animate-spin h-12 w-12 border-4 border-blue-400 border-t-transparent rounded-full mx-auto"></div>
      <h3 className="text-xl font-semibold">Processing Document</h3>
      <p className="text-white/70">Analyzing content and generating analytical framework...</p>
    </div>
  )

  const renderFormStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Document Processed Successfully</h3>
        <p className="text-white/70">Analytical framework generated with calculation studies</p>
      </div>

      {/* Document Summary */}
      <div className="glass-card">
        <h4 className="font-semibold mb-3">Document Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-white/60">Title:</span>
            <span className="ml-2 text-white">{parsedContent.title}</span>
          </div>
          <div>
            <span className="text-white/60">Sections:</span>
            <span className="ml-2 text-white">{parsedContent.metadata.totalSections}</span>
          </div>
          <div>
            <span className="text-white/60">Questions:</span>
            <span className="ml-2 text-white">{parsedContent.metadata.totalQuestions}</span>
          </div>
          <div>
            <span className="text-white/60">Processed:</span>
            <span className="ml-2 text-white">{new Date(parsedContent.metadata.processedAt).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Analytical Framework Preview */}
      <div className="space-y-4">
        <h4 className="font-semibold flex items-center">
          <Brain className="h-5 w-5 mr-2 text-purple-400" />
          Analytical Framework
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card">
            <h5 className="font-medium text-blue-400 mb-2">Assumptions ({analyticalForm.assumptions.length})</h5>
            <ul className="text-sm space-y-1">
              {analyticalForm.assumptions.slice(0, 3).map((assumption, index) => (
                <li key={index} className="text-white/70">• {assumption.substring(0, 60)}...</li>
              ))}
            </ul>
          </div>

          <div className="glass-card">
            <h5 className="font-medium text-green-400 mb-2">Hypothesis ({analyticalForm.hypothesis.length})</h5>
            <ul className="text-sm space-y-1">
              {analyticalForm.hypothesis.slice(0, 3).map((hyp, index) => (
                <li key={index} className="text-white/70">• {hyp.substring(0, 60)}...</li>
              ))}
            </ul>
          </div>

          <div className="glass-card">
            <h5 className="font-medium text-yellow-400 mb-2">Evidence ({analyticalForm.evidenceToCollect.length})</h5>
            <ul className="text-sm space-y-1">
              {analyticalForm.evidenceToCollect.slice(0, 3).map((evidence, index) => (
                <li key={index} className="text-white/70">• {evidence.substring(0, 60)}...</li>
              ))}
            </ul>
          </div>

          <div className="glass-card">
            <h5 className="font-medium text-purple-400 mb-2">Calculations ({analyticalForm.calculationStudies.length})</h5>
            <ul className="text-sm space-y-1">
              {analyticalForm.calculationStudies.slice(0, 3).map((study, index) => (
                <li key={index} className="text-white/70">• {study.name}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        <motion.button
          onClick={createInteractiveWorksheet}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="glass-button flex items-center space-x-2 bg-blue-500/20"
        >
          <Calculator className="h-4 w-4" />
          <span>Create Interactive Worksheet</span>
        </motion.button>

        <motion.button
          onClick={exportAnalyticalReport}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="glass-button flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Export Analytical Report</span>
        </motion.button>
      </div>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-card max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text">Document Processor</h2>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </motion.button>
        </div>

        {currentStep === 'upload' && renderUploadStep()}
        {currentStep === 'analyze' && renderAnalysisStep()}
        {currentStep === 'form' && renderFormStep()}
      </motion.div>
    </motion.div>
  )
}

export default DocumentProcessor
