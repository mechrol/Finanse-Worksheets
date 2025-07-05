import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileSpreadsheet, 
  Plus, 
  Download, 
  Upload,
  Calendar,
  DollarSign,
  TrendingUp,
  Filter,
  Search,
  Calculator,
  Target,
  CreditCard
} from 'lucide-react'
import PaycheckCycleWorksheet from './PaycheckCycleWorksheet'
import ConsolidatingDebtWorksheet from './ConsolidatingDebtWorksheet'
import DocumentProcessor from './DocumentProcessor'
import ImportedWorksheet from './ImportedWorksheet'
import { saveAs } from 'file-saver'
import toast from 'react-hot-toast'

const Worksheets = ({ transactions }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [activeWorksheet, setActiveWorksheet] = useState(null)
  const [showDocumentProcessor, setShowDocumentProcessor] = useState(false)
  const [importedWorksheets, setImportedWorksheets] = useState([])

  // Sample worksheet data with the new debt consolidation worksheet
  const worksheets = [
    {
      id: 1,
      name: 'Breaking the Paycheck-to-Paycheck Cycle',
      type: 'Financial Planning',
      lastModified: '2024-01-15',
      entries: 0,
      totalAmount: 0,
      status: 'interactive',
      description: 'Interactive worksheet to help break the paycheck-to-paycheck cycle with calculation simulation',
      icon: Calculator,
      isInteractive: true
    },
    {
      id: 2,
      name: 'Consolidating Debt Worksheet',
      type: 'Debt Management',
      lastModified: '2024-01-16',
      entries: 0,
      totalAmount: 0,
      status: 'interactive',
      description: 'Comprehensive debt consolidation planning tool with 8-week progress tracking and calculation features',
      icon: CreditCard,
      isInteractive: true
    },
    {
      id: 3,
      name: 'Monthly Budget Analysis',
      type: 'Budget',
      lastModified: '2024-01-15',
      entries: 45,
      totalAmount: 2850.75,
      status: 'active',
      icon: Target
    },
    {
      id: 4,
      name: 'Q1 Expense Report',
      type: 'Report',
      lastModified: '2024-01-12',
      entries: 128,
      totalAmount: 8420.30,
      status: 'completed',
      icon: FileSpreadsheet
    },
    {
      id: 5,
      name: 'Travel Expenses - January',
      type: 'Travel',
      lastModified: '2024-01-10',
      entries: 23,
      totalAmount: 1245.60,
      status: 'draft',
      icon: FileSpreadsheet
    },
    {
      id: 6,
      name: 'Office Supplies Tracking',
      type: 'Supplies',
      lastModified: '2024-01-08',
      entries: 67,
      totalAmount: 892.45,
      status: 'active',
      icon: FileSpreadsheet
    },
    ...importedWorksheets
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20'
      case 'completed': return 'text-blue-400 bg-blue-400/20'
      case 'draft': return 'text-yellow-400 bg-yellow-400/20'
      case 'interactive': return 'text-purple-400 bg-purple-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  const filteredWorksheets = worksheets.filter(worksheet => 
    worksheet.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'all' || worksheet.type.toLowerCase() === selectedCategory.toLowerCase())
  )

  const handleWorksheetClick = (worksheet) => {
    if (worksheet.isInteractive) {
      setActiveWorksheet(worksheet)
    }
  }

  const handleNewWorksheet = () => {
    setShowDocumentProcessor(true)
  }

  const handleImport = () => {
    setShowDocumentProcessor(true)
  }

  const handleExportAll = async () => {
    try {
      // Dynamic import for docx to avoid build issues
      const { Document, Packer, Paragraph, TextRun } = await import('docx')
      
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Expense Tracker Pro - All Worksheets Export",
                  bold: true,
                  size: 28
                })
              ]
            }),
            new Paragraph({ text: "" }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Export Date: ${new Date().toLocaleDateString()}`,
                  size: 20
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Total Worksheets: ${worksheets.length}`,
                  size: 20
                })
              ]
            }),
            new Paragraph({ text: "" }),
            
            ...worksheets.map(worksheet => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: worksheet.name,
                    bold: true,
                    size: 24
                  })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Type: ${worksheet.type} | Status: ${worksheet.status}`,
                    size: 18
                  })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Last Modified: ${worksheet.lastModified}`,
                    size: 18
                  })
                ]
              }),
              worksheet.description ? new Paragraph({
                children: [
                  new TextRun({
                    text: worksheet.description,
                    size: 16,
                    italics: true
                  })
                ]
              }) : null,
              new Paragraph({ text: "" })
            ]).flat().filter(Boolean)
          ]
        }]
      })

      const blob = await Packer.toBlob(doc)
      saveAs(blob, `ExpenseTracker_All_Worksheets_${new Date().toISOString().split('T')[0]}.docx`)
      toast.success('All worksheets exported successfully!')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Error exporting worksheets')
    }
  }

  const handleWorksheetCreated = (worksheetData) => {
    setImportedWorksheets(prev => [worksheetData, ...prev])
    toast.success('New worksheet created from document!')
  }

  if (activeWorksheet) {
    if (activeWorksheet.id === 1) {
      return <PaycheckCycleWorksheet onBack={() => setActiveWorksheet(null)} />
    } else if (activeWorksheet.id === 2) {
      return <ConsolidatingDebtWorksheet onBack={() => setActiveWorksheet(null)} />
    } else if (activeWorksheet.sections) {
      return (
        <ImportedWorksheet 
          worksheet={activeWorksheet} 
          onBack={() => setActiveWorksheet(null)} 
        />
      )
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
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold gradient-text mb-2">Expense Worksheets</h2>
            <p className="text-white/70">Manage and analyze your expense data with custom worksheets</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <motion.button
              onClick={handleNewWorksheet}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-button flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>New Worksheet</span>
            </motion.button>
            
            <motion.button
              onClick={handleImport}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-button flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>Import</span>
            </motion.button>
            
            <motion.button
              onClick={handleExportAll}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-button flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export All</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
              <input
                type="text"
                placeholder="Search worksheets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50"
            >
              <option value="all">All Types</option>
              <option value="financial planning">Financial Planning</option>
              <option value="debt management">Debt Management</option>
              <option value="budget">Budget</option>
              <option value="report">Report</option>
              <option value="travel">Travel</option>
              <option value="supplies">Supplies</option>
              <option value="imported document">Imported Document</option>
            </select>
            
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Worksheets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredWorksheets.map((worksheet, index) => {
          const Icon = worksheet.icon || FileSpreadsheet
          return (
            <motion.div
              key={worksheet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`glass-card cursor-pointer group ${
                worksheet.isInteractive ? 'ring-2 ring-purple-400/30' : ''
              }`}
              onClick={() => handleWorksheetClick(worksheet)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    worksheet.isInteractive ? 'bg-purple-500/20' : 'bg-blue-500/20'
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      worksheet.isInteractive ? 'text-purple-400' : 'text-blue-400'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {worksheet.name}
                    </h3>
                    <p className="text-sm text-white/60">{worksheet.type}</p>
                    {worksheet.description && (
                      <p className="text-xs text-white/50 mt-1">{worksheet.description}</p>
                    )}
                  </div>
                </div>
                
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(worksheet.status)}`}>
                  {worksheet.status}
                </span>
              </div>
              
              {!worksheet.isInteractive && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Entries</span>
                    <span className="text-white font-medium">{worksheet.entries}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Total Amount</span>
                    <span className="text-green-400 font-medium">
                      ${worksheet.totalAmount.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Last Modified</span>
                    <span className="text-white/80">{worksheet.lastModified}</span>
                  </div>
                </div>
              )}
              
              {worksheet.isInteractive && (
                <div className="space-y-3">
                  <div className="flex items-center justify-center py-4">
                    <div className="text-center">
                      <Icon className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                      <p className="text-sm text-white/80">Interactive Worksheet</p>
                      <p className="text-xs text-white/60">Click to start your financial planning journey</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t border-white/10 flex justify-between">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`text-sm font-medium ${
                    worksheet.isInteractive 
                      ? 'text-purple-400 hover:text-purple-300' 
                      : 'text-blue-400 hover:text-blue-300'
                  }`}
                >
                  {worksheet.isInteractive ? 'Start Worksheet' : 'Open'}
                </motion.button>
                
                {!worksheet.isInteractive && (
                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-white/60 hover:text-white"
                    >
                      <Download className="h-4 w-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-white/60 hover:text-white"
                    >
                      <TrendingUp className="h-4 w-4" />
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card"
      >
        <h3 className="text-lg font-semibold mb-4">Worksheet Summary</h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{worksheets.length}</div>
            <div className="text-sm text-white/60">Total Worksheets</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {worksheets.reduce((sum, w) => sum + w.entries, 0)}
            </div>
            <div className="text-sm text-white/60">Total Entries</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              ${worksheets.reduce((sum, w) => sum + w.totalAmount, 0).toLocaleString()}
            </div>
            <div className="text-sm text-white/60">Total Amount</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {worksheets.filter(w => w.status === 'active' || w.status === 'interactive').length}
            </div>
            <div className="text-sm text-white/60">Active Sheets</div>
          </div>
        </div>
      </motion.div>

      {/* Document Processor Modal */}
      {showDocumentProcessor && (
        <DocumentProcessor
          onClose={() => setShowDocumentProcessor(false)}
          onWorksheetCreated={handleWorksheetCreated}
        />
      )}
    </div>
  )
}

export default Worksheets
