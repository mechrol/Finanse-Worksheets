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
  Download,
  Eye,
  Users,
  Calendar,
  DollarSign,
  Lightbulb,
  Flag,
  Activity
} from 'lucide-react'
import { saveAs } from 'file-saver'
import { Document, Packer, Paragraph, TextRun } from 'docx'
import toast from 'react-hot-toast'

const ImportedWorksheet = ({ worksheet, onBack }) => {
  const [currentSection, setCurrentSection] = useState(0)
  const [formData, setFormData] = useState({})
  const [calculations, setCalculations] = useState({})
  const [showAnalyticalFramework, setShowAnalyticalFramework] = useState(false)

  // Enhanced sections for imported worksheets
  const enhancedSections = [
    { id: 0, title: 'Data Overview', icon: BarChart3, color: 'blue' },
    { id: 1, title: 'Analysis & Insights', icon: Brain, color: 'purple' },
    { id: 2, title: 'Action Items', icon: CheckCircle, color: 'green' },
    { id: 3, title: 'Goals & Targets', icon: Target, color: 'orange' },
    { id: 4, title: 'Progress Tracking', icon: TrendingUp, color: 'pink' },
    { id: 5, title: 'Recommendations', icon: Lightbulb, color: 'yellow' }
  ]

  useEffect(() => {
    // Initialize comprehensive form data structure
    const initialData = {
      // Data Overview Section
      dataOverview: {
        keyMetrics: [
          { metric: 'Total Revenue', value: '', target: '', variance: '' },
          { metric: 'Total Expenses', value: '', target: '', variance: '' },
          { metric: 'Net Profit', value: '', target: '', variance: '' },
          { metric: 'Cash Flow', value: '', target: '', variance: '' }
        ],
        dataQuality: '',
        timeframe: '',
        dataSource: '',
        assumptions: ['', '', '']
      },
      
      // Analysis & Insights Section
      analysisInsights: {
        trendAnalysis: '',
        keyFindings: ['', '', '', ''],
        riskFactors: ['', '', ''],
        opportunities: ['', '', ''],
        comparativeAnalysis: '',
        seasonalPatterns: ''
      },
      
      // Action Items Section
      actionItems: {
        immediateActions: [
          { action: '', priority: 'high', deadline: '', owner: '', status: 'pending' },
          { action: '', priority: 'medium', deadline: '', owner: '', status: 'pending' },
          { action: '', priority: 'low', deadline: '', owner: '', status: 'pending' }
        ],
        longTermActions: [
          { action: '', timeline: '', resources: '', impact: '' },
          { action: '', timeline: '', resources: '', impact: '' }
        ],
        dependencies: ['', '', '']
      },
      
      // Goals & Targets Section
      goalsTargets: {
        financialGoals: [
          { goal: '', target: '', deadline: '', progress: '0' },
          { goal: '', target: '', deadline: '', progress: '0' },
          { goal: '', target: '', deadline: '', progress: '0' }
        ],
        kpis: [
          { kpi: '', current: '', target: '', frequency: 'monthly' },
          { kpi: '', current: '', target: '', frequency: 'monthly' },
          { kpi: '', current: '', target: '', frequency: 'monthly' }
        ],
        milestones: ['', '', '', '']
      },
      
      // Progress Tracking Section
      progressTracking: {
        weeklyData: [
          { week: 1, metric1: '', metric2: '', metric3: '', notes: '' },
          { week: 2, metric1: '', metric2: '', metric3: '', notes: '' },
          { week: 3, metric1: '', metric2: '', metric3: '', notes: '' },
          { week: 4, metric1: '', metric2: '', metric3: '', notes: '' }
        ],
        reviewFrequency: 'weekly',
        stakeholders: ['', '', ''],
        reportingMethod: ''
      },
      
      // Recommendations Section
      recommendations: {
        strategicRecommendations: ['', '', '', ''],
        tacticalRecommendations: ['', '', '', ''],
        riskMitigation: ['', '', ''],
        resourceRequirements: '',
        implementationPlan: '',
        successMetrics: ['', '', '']
      }
    }

    // Also initialize from original worksheet structure if available
    if (worksheet?.sections) {
      worksheet.sections.forEach((section, sectionIndex) => {
        initialData[sectionIndex] = {}
        section.questions?.forEach((question, questionIndex) => {
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
    }

    setFormData(initialData)
  }, [worksheet])

  const updateFormData = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const updateArrayField = (section, field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: prev[section][field].map((item, i) => i === index ? value : item)
      }
    }))
  }

  const updateObjectArrayField = (section, field, index, key, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: prev[section][field].map((item, i) => 
          i === index ? { ...item, [key]: value } : item
        )
      }
    }))
  }

  const performCalculations = () => {
    const results = {}
    
    // Calculate metrics from data overview
    const metrics = formData.dataOverview?.keyMetrics || []
    const totalRevenue = parseFloat(metrics.find(m => m.metric === 'Total Revenue')?.value) || 0
    const totalExpenses = parseFloat(metrics.find(m => m.metric === 'Total Expenses')?.value) || 0
    const netProfit = totalRevenue - totalExpenses
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue * 100) : 0
    
    results['Net Profit'] = netProfit.toFixed(2)
    results['Profit Margin'] = profitMargin.toFixed(2) + '%'
    
    // Calculate goal progress
    const goals = formData.goalsTargets?.financialGoals || []
    const avgProgress = goals.reduce((sum, goal) => sum + (parseFloat(goal.progress) || 0), 0) / goals.length
    results['Average Goal Progress'] = avgProgress.toFixed(1) + '%'
    
    // Calculate KPI performance
    const kpis = formData.goalsTargets?.kpis || []
    const kpiPerformance = kpis.map(kpi => {
      const current = parseFloat(kpi.current) || 0
      const target = parseFloat(kpi.target) || 1
      return (current / target * 100)
    })
    const avgKpiPerformance = kpiPerformance.reduce((sum, perf) => sum + perf, 0) / kpiPerformance.length
    results['KPI Performance'] = avgKpiPerformance.toFixed(1) + '%'

    setCalculations(results)
    toast.success('Calculations updated!')
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
                  text: `${worksheet.name} - Comprehensive Analysis`,
                  bold: true,
                  size: 28
                })
              ]
            }),
            new Paragraph({ text: "" }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Analysis Date: ${new Date().toLocaleDateString()}`,
                  size: 20
                })
              ]
            }),
            new Paragraph({ text: "" }),

            // Data Overview Section
            new Paragraph({
              children: [
                new TextRun({
                  text: "DATA OVERVIEW",
                  bold: true,
                  size: 24
                })
              ]
            }),
            new Paragraph({ text: "" }),
            ...formData.dataOverview?.keyMetrics?.map(metric => 
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${metric.metric}: ${metric.value} (Target: ${metric.target})`,
                    size: 16
                  })
                ]
              })
            ) || [],

            // Analysis & Insights Section
            new Paragraph({ text: "" }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "ANALYSIS & INSIGHTS",
                  bold: true,
                  size: 24
                })
              ]
            }),
            new Paragraph({ text: "" }),
            new Paragraph({
              children: [
                new TextRun({
                  text: formData.analysisInsights?.trendAnalysis || 'No trend analysis provided',
                  size: 16
                })
              ]
            }),

            // Calculations
            Object.keys(calculations).length > 0 ? [
              new Paragraph({ text: "" }),
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
      saveAs(blob, `${worksheet.name}_Analysis.docx`)
      toast.success('Analysis exported successfully!')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Error exporting analysis')
    }
  }

  const renderEnhancedSection = () => {
    const section = enhancedSections[currentSection]
    
    switch (section.id) {
      case 0: // Data Overview
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <BarChart3 className="h-6 w-6 mr-2 text-blue-400" />
              Data Overview & Key Metrics
            </h3>
            
            {/* Key Metrics Table */}
            <div className="glass-card overflow-x-auto">
              <h4 className="font-semibold mb-3">Key Performance Metrics</h4>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-2">Metric</th>
                    <th className="text-left py-3 px-2">Current Value</th>
                    <th className="text-left py-3 px-2">Target</th>
                    <th className="text-left py-3 px-2">Variance</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.dataOverview?.keyMetrics?.map((metric, index) => (
                    <tr key={index} className="border-b border-white/10">
                      <td className="py-3 px-2 font-medium">{metric.metric}</td>
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          value={metric.value}
                          onChange={(e) => updateObjectArrayField('dataOverview', 'keyMetrics', index, 'value', e.target.value)}
                          className="w-24 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-400/50"
                          placeholder="0"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          value={metric.target}
                          onChange={(e) => updateObjectArrayField('dataOverview', 'keyMetrics', index, 'target', e.target.value)}
                          className="w-24 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-400/50"
                          placeholder="0"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="text"
                          value={metric.variance}
                          onChange={(e) => updateObjectArrayField('dataOverview', 'keyMetrics', index, 'variance', e.target.value)}
                          className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-400/50"
                          placeholder="+/-"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Data Quality & Source */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Data Quality Assessment</label>
                <textarea
                  value={formData.dataOverview?.dataQuality || ''}
                  onChange={(e) => updateFormData('dataOverview', 'dataQuality', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  placeholder="Assess data completeness, accuracy, and reliability..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Data Source & Timeframe</label>
                <input
                  type="text"
                  value={formData.dataOverview?.dataSource || ''}
                  onChange={(e) => updateFormData('dataOverview', 'dataSource', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 mb-2"
                  placeholder="Primary data source..."
                />
                <input
                  type="text"
                  value={formData.dataOverview?.timeframe || ''}
                  onChange={(e) => updateFormData('dataOverview', 'timeframe', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  placeholder="Analysis timeframe..."
                />
              </div>
            </div>

            {/* Key Assumptions */}
            <div>
              <label className="block text-sm font-medium mb-2">Key Assumptions</label>
              <div className="space-y-2">
                {formData.dataOverview?.assumptions?.map((assumption, index) => (
                  <input
                    key={index}
                    type="text"
                    value={assumption}
                    onChange={(e) => updateArrayField('dataOverview', 'assumptions', index, e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                    placeholder={`Assumption ${index + 1}...`}
                  />
                ))}
              </div>
            </div>
          </div>
        )

      case 1: // Analysis & Insights
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Brain className="h-6 w-6 mr-2 text-purple-400" />
              Analysis & Strategic Insights
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Trend Analysis</label>
                <textarea
                  value={formData.analysisInsights?.trendAnalysis || ''}
                  onChange={(e) => updateFormData('analysisInsights', 'trendAnalysis', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                  placeholder="Describe key trends, patterns, and directional changes in the data..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Key Findings</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {formData.analysisInsights?.keyFindings?.map((finding, index) => (
                    <input
                      key={index}
                      type="text"
                      value={finding}
                      onChange={(e) => updateArrayField('analysisInsights', 'keyFindings', index, e.target.value)}
                      className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                      placeholder={`Key finding ${index + 1}...`}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Risk Factors</label>
                  <div className="space-y-2">
                    {formData.analysisInsights?.riskFactors?.map((risk, index) => (
                      <input
                        key={index}
                        type="text"
                        value={risk}
                        onChange={(e) => updateArrayField('analysisInsights', 'riskFactors', index, e.target.value)}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-400/50"
                        placeholder={`Risk factor ${index + 1}...`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Opportunities</label>
                  <div className="space-y-2">
                    {formData.analysisInsights?.opportunities?.map((opportunity, index) => (
                      <input
                        key={index}
                        type="text"
                        value={opportunity}
                        onChange={(e) => updateArrayField('analysisInsights', 'opportunities', index, e.target.value)}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400/50"
                        placeholder={`Opportunity ${index + 1}...`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Comparative Analysis</label>
                <textarea
                  value={formData.analysisInsights?.comparativeAnalysis || ''}
                  onChange={(e) => updateFormData('analysisInsights', 'comparativeAnalysis', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                  placeholder="Compare performance against benchmarks, previous periods, or competitors..."
                />
              </div>
            </div>
          </div>
        )

      case 2: // Action Items
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <CheckCircle className="h-6 w-6 mr-2 text-green-400" />
              Action Items & Implementation
            </h3>
            
            {/* Immediate Actions */}
            <div className="glass-card overflow-x-auto">
              <h4 className="font-semibold mb-3">Immediate Actions (Next 30 Days)</h4>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-2">Action</th>
                    <th className="text-left py-3 px-2">Priority</th>
                    <th className="text-left py-3 px-2">Deadline</th>
                    <th className="text-left py-3 px-2">Owner</th>
                    <th className="text-left py-3 px-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.actionItems?.immediateActions?.map((action, index) => (
                    <tr key={index} className="border-b border-white/10">
                      <td className="py-3 px-2">
                        <input
                          type="text"
                          value={action.action}
                          onChange={(e) => updateObjectArrayField('actionItems', 'immediateActions', index, 'action', e.target.value)}
                          className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-400/50"
                          placeholder="Action description..."
                        />
                      </td>
                      <td className="py-3 px-2">
                        <select
                          value={action.priority}
                          onChange={(e) => updateObjectArrayField('actionItems', 'immediateActions', index, 'priority', e.target.value)}
                          className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-400/50"
                        >
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="date"
                          value={action.deadline}
                          onChange={(e) => updateObjectArrayField('actionItems', 'immediateActions', index, 'deadline', e.target.value)}
                          className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-400/50"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="text"
                          value={action.owner}
                          onChange={(e) => updateObjectArrayField('actionItems', 'immediateActions', index, 'owner', e.target.value)}
                          className="w-24 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-400/50"
                          placeholder="Owner"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <select
                          value={action.status}
                          onChange={(e) => updateObjectArrayField('actionItems', 'immediateActions', index, 'status', e.target.value)}
                          className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-400/50"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Long-term Actions */}
            <div className="glass-card overflow-x-auto">
              <h4 className="font-semibold mb-3">Long-term Strategic Actions</h4>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-2">Action</th>
                    <th className="text-left py-3 px-2">Timeline</th>
                    <th className="text-left py-3 px-2">Resources Needed</th>
                    <th className="text-left py-3 px-2">Expected Impact</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.actionItems?.longTermActions?.map((action, index) => (
                    <tr key={index} className="border-b border-white/10">
                      <td className="py-3 px-2">
                        <input
                          type="text"
                          value={action.action}
                          onChange={(e) => updateObjectArrayField('actionItems', 'longTermActions', index, 'action', e.target.value)}
                          className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-400/50"
                          placeholder="Long-term action..."
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="text"
                          value={action.timeline}
                          onChange={(e) => updateObjectArrayField('actionItems', 'longTermActions', index, 'timeline', e.target.value)}
                          className="w-24 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-400/50"
                          placeholder="6 months"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="text"
                          value={action.resources}
                          onChange={(e) => updateObjectArrayField('actionItems', 'longTermActions', index, 'resources', e.target.value)}
                          className="w-32 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-400/50"
                          placeholder="Resources..."
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="text"
                          value={action.impact}
                          onChange={(e) => updateObjectArrayField('actionItems', 'longTermActions', index, 'impact', e.target.value)}
                          className="w-32 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-400/50"
                          placeholder="Impact..."
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Dependencies */}
            <div>
              <label className="block text-sm font-medium mb-2">Key Dependencies & Constraints</label>
              <div className="space-y-2">
                {formData.actionItems?.dependencies?.map((dependency, index) => (
                  <input
                    key={index}
                    type="text"
                    value={dependency}
                    onChange={(e) => updateArrayField('actionItems', 'dependencies', index, e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400/50"
                    placeholder={`Dependency ${index + 1}...`}
                  />
                ))}
              </div>
            </div>
          </div>
        )

      case 3: // Goals & Targets
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Target className="h-6 w-6 mr-2 text-orange-400" />
              Goals & Performance Targets
            </h3>
            
            {/* Financial Goals */}
            <div className="glass-card overflow-x-auto">
              <h4 className="font-semibold mb-3">Financial Goals</h4>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-2">Goal</th>
                    <th className="text-left py-3 px-2">Target Value</th>
                    <th className="text-left py-3 px-2">Deadline</th>
                    <th className="text-left py-3 px-2">Progress (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.goalsTargets?.financialGoals?.map((goal, index) => (
                    <tr key={index} className="border-b border-white/10">
                      <td className="py-3 px-2">
                        <input
                          type="text"
                          value={goal.goal}
                          onChange={(e) => updateObjectArrayField('goalsTargets', 'financialGoals', index, 'goal', e.target.value)}
                          className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-orange-400/50"
                          placeholder="Financial goal..."
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="text"
                          value={goal.target}
                          onChange={(e) => updateObjectArrayField('goalsTargets', 'financialGoals', index, 'target', e.target.value)}
                          className="w-24 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-orange-400/50"
                          placeholder="Target"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="date"
                          value={goal.deadline}
                          onChange={(e) => updateObjectArrayField('goalsTargets', 'financialGoals', index, 'deadline', e.target.value)}
                          className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-orange-400/50"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={goal.progress}
                          onChange={(e) => updateObjectArrayField('goalsTargets', 'financialGoals', index, 'progress', e.target.value)}
                          className="w-16 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-orange-400/50"
                          placeholder="0"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* KPIs */}
            <div className="glass-card overflow-x-auto">
              <h4 className="font-semibold mb-3">Key Performance Indicators</h4>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-2">KPI</th>
                    <th className="text-left py-3 px-2">Current</th>
                    <th className="text-left py-3 px-2">Target</th>
                    <th className="text-left py-3 px-2">Frequency</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.goalsTargets?.kpis?.map((kpi, index) => (
                    <tr key={index} className="border-b border-white/10">
                      <td className="py-3 px-2">
                        <input
                          type="text"
                          value={kpi.kpi}
                          onChange={(e) => updateObjectArrayField('goalsTargets', 'kpis', index, 'kpi', e.target.value)}
                          className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-orange-400/50"
                          placeholder="KPI name..."
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          value={kpi.current}
                          onChange={(e) => updateObjectArrayField('goalsTargets', 'kpis', index, 'current', e.target.value)}
                          className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-orange-400/50"
                          placeholder="0"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          value={kpi.target}
                          onChange={(e) => updateObjectArrayField('goalsTargets', 'kpis', index, 'target', e.target.value)}
                          className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-orange-400/50"
                          placeholder="0"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <select
                          value={kpi.frequency}
                          onChange={(e) => updateObjectArrayField('goalsTargets', 'kpis', index, 'frequency', e.target.value)}
                          className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-orange-400/50"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Milestones */}
            <div>
              <label className="block text-sm font-medium mb-2">Key Milestones</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {formData.goalsTargets?.milestones?.map((milestone, index) => (
                  <input
                    key={index}
                    type="text"
                    value={milestone}
                    onChange={(e) => updateArrayField('goalsTargets', 'milestones', index, e.target.value)}
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                    placeholder={`Milestone ${index + 1}...`}
                  />
                ))}
              </div>
            </div>
          </div>
        )

      case 4: // Progress Tracking
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <TrendingUp className="h-6 w-6 mr-2 text-pink-400" />
              Progress Tracking & Monitoring
            </h3>
            
            {/* Weekly Progress Table */}
            <div className="glass-card overflow-x-auto">
              <h4 className="font-semibold mb-3">Weekly Progress Tracking</h4>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-2">Week</th>
                    <th className="text-left py-3 px-2">Metric 1</th>
                    <th className="text-left py-3 px-2">Metric 2</th>
                    <th className="text-left py-3 px-2">Metric 3</th>
                    <th className="text-left py-3 px-2">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.progressTracking?.weeklyData?.map((week, index) => (
                    <tr key={week.week} className="border-b border-white/10">
                      <td className="py-3 px-2 font-medium">Week {week.week}</td>
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          value={week.metric1}
                          onChange={(e) => updateObjectArrayField('progressTracking', 'weeklyData', index, 'metric1', e.target.value)}
                          className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-pink-400/50"
                          placeholder="0"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          value={week.metric2}
                          onChange={(e) => updateObjectArrayField('progressTracking', 'weeklyData', index, 'metric2', e.target.value)}
                          className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-pink-400/50"
                          placeholder="0"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          value={week.metric3}
                          onChange={(e) => updateObjectArrayField('progressTracking', 'weeklyData', index, 'metric3', e.target.value)}
                          className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-pink-400/50"
                          placeholder="0"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="text"
                          value={week.notes}
                          onChange={(e) => updateObjectArrayField('progressTracking', 'weeklyData', index, 'notes', e.target.value)}
                          className="w-32 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-pink-400/50"
                          placeholder="Notes..."
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tracking Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Review Frequency</label>
                <select
                  value={formData.progressTracking?.reviewFrequency || 'weekly'}
                  onChange={(e) => updateFormData('progressTracking', 'reviewFrequency', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-400/50"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Reporting Method</label>
                <input
                  type="text"
                  value={formData.progressTracking?.reportingMethod || ''}
                  onChange={(e) => updateFormData('progressTracking', 'reportingMethod', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400/50"
                  placeholder="Dashboard, email, meetings..."
                />
              </div>
            </div>

            {/* Stakeholders */}
            <div>
              <label className="block text-sm font-medium mb-2">Key Stakeholders</label>
              <div className="space-y-2">
                {formData.progressTracking?.stakeholders?.map((stakeholder, index) => (
                  <input
                    key={index}
                    type="text"
                    value={stakeholder}
                    onChange={(e) => updateArrayField('progressTracking', 'stakeholders', index, e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400/50"
                    placeholder={`Stakeholder ${index + 1}...`}
                  />
                ))}
              </div>
            </div>
          </div>
        )

      case 5: // Recommendations
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Lightbulb className="h-6 w-6 mr-2 text-yellow-400" />
              Strategic Recommendations
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Strategic Recommendations</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {formData.recommendations?.strategicRecommendations?.map((rec, index) => (
                    <textarea
                      key={index}
                      value={rec}
                      onChange={(e) => updateArrayField('recommendations', 'strategicRecommendations', index, e.target.value)}
                      rows={2}
                      className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                      placeholder={`Strategic recommendation ${index + 1}...`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tactical Recommendations</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {formData.recommendations?.tacticalRecommendations?.map((rec, index) => (
                    <textarea
                      key={index}
                      value={rec}
                      onChange={(e) => updateArrayField('recommendations', 'tacticalRecommendations', index, e.target.value)}
                      rows={2}
                      className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                      placeholder={`Tactical recommendation ${index + 1}...`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Risk Mitigation Strategies</label>
                <div className="space-y-2">
                  {formData.recommendations?.riskMitigation?.map((strategy, index) => (
                    <input
                      key={index}
                      type="text"
                      value={strategy}
                      onChange={(e) => updateArrayField('recommendations', 'riskMitigation', index, e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-400/50"
                      placeholder={`Risk mitigation strategy ${index + 1}...`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Resource Requirements</label>
                <textarea
                  value={formData.recommendations?.resourceRequirements || ''}
                  onChange={(e) => updateFormData('recommendations', 'resourceRequirements', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                  placeholder="Detail the resources needed for implementation..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Implementation Plan</label>
                <textarea
                  value={formData.recommendations?.implementationPlan || ''}
                  onChange={(e) => updateFormData('recommendations', 'implementationPlan', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                  placeholder="Outline the step-by-step implementation plan..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Success Metrics</label>
                <div className="space-y-2">
                  {formData.recommendations?.successMetrics?.map((metric, index) => (
                    <input
                      key={index}
                      type="text"
                      value={metric}
                      onChange={(e) => updateArrayField('recommendations', 'successMetrics', index, e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400/50"
                      placeholder={`Success metric ${index + 1}...`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const renderOriginalSection = () => {
    if (!worksheet?.sections || !worksheet.sections[currentSection]) {
      return <div>No content available for this section.</div>
    }

    const section = worksheet.sections[currentSection]
    
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
        
        <div className="space-y-4">
          {section.questions?.map((question, questionIndex) => (
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
    )
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
            {worksheet.analyticalFramework?.assumptions?.map((assumption, index) => (
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
            {worksheet.analyticalFramework?.hypothesis?.map((hyp, index) => (
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
            {worksheet.analyticalFramework?.evidenceToCollect?.map((evidence, index) => (
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
            {worksheet.analyticalFramework?.expectedConclusions?.map((conclusion, index) => (
              <li key={index} className="text-sm text-white/80 flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                {conclusion}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Calculation Studies */}
      {worksheet.analyticalFramework?.calculationStudies && (
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
      )}
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
              <p className="text-white/70">Comprehensive Document Analysis & Planning Worksheet</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {worksheet.analyticalFramework && (
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
            )}
            
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
          {/* Enhanced sections for imported worksheets */}
          {enhancedSections.map((section) => {
            const Icon = section.icon
            return (
              <motion.button
                key={section.id}
                onClick={() => {
                  setCurrentSection(section.id)
                  setShowAnalyticalFramework(false)
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all text-sm ${
                  currentSection === section.id && !showAnalyticalFramework
                    ? `bg-${section.color}-500/30 text-white`
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="h-4 w-4" />
                <span>{section.title}</span>
              </motion.button>
            )
          })}
          
          {/* Original sections if available */}
          {worksheet?.sections?.map((section, index) => (
            <motion.button
              key={`original-${index}`}
              onClick={() => {
                setCurrentSection(index + enhancedSections.length)
                setShowAnalyticalFramework(false)
              }}
              className={`px-4 py-2 rounded-lg transition-all text-sm ${
                currentSection === index + enhancedSections.length && !showAnalyticalFramework
                  ? 'bg-blue-500/30 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {section.title}
            </motion.button>
          ))}
          
          {worksheet.analyticalFramework && (
            <motion.button
              onClick={() => setShowAnalyticalFramework(true)}
              className={`px-4 py-2 rounded-lg transition-all text-sm ${
                showAnalyticalFramework
                  ? 'bg-purple-500/30 text-purple-400'
                  : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Brain className="h-4 w-4 inline mr-1" />
              Analytical Framework
            </motion.button>
          )}
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
        ) : currentSection < enhancedSections.length ? (
          renderEnhancedSection()
        ) : (
          renderOriginalSection()
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
            onClick={() => {
              const maxSection = enhancedSections.length + (worksheet?.sections?.length || 0) - 1
              setCurrentSection(Math.min(maxSection, currentSection + 1))
            }}
            disabled={currentSection >= enhancedSections.length + (worksheet?.sections?.length || 0) - 1}
            className={`px-6 py-2 rounded-lg flex items-center space-x-2 ${
              currentSection >= enhancedSections.length + (worksheet?.sections?.length || 0) - 1
                ? 'bg-white/10 text-white/50 cursor-not-allowed'
                : 'glass-button'
            }`}
            whileHover={currentSection < enhancedSections.length + (worksheet?.sections?.length || 0) - 1 ? { scale: 1.05 } : {}}
            whileTap={currentSection < enhancedSections.length + (worksheet?.sections?.length || 0) - 1 ? { scale: 0.95 } : {}}
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
