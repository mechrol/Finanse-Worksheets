import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckSquare, 
  Plus, 
  Download, 
  Upload,
  Search,
  Filter,
  Target,
  Calendar,
  TrendingUp,
  ExternalLink,
  Play,
  BookOpen,
  Award,
  Clock,
  Users,
  Zap
} from 'lucide-react'
import ChecklistForm from './ChecklistForm'
import ChecklistImporter from './ChecklistImporter'
import toast from 'react-hot-toast'

const Checklists = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [activeChecklist, setActiveChecklist] = useState(null)
  const [showImporter, setShowImporter] = useState(false)
  const [importedChecklists, setImportedChecklists] = useState([])

  // Sample checklists with different categories
  const sampleChecklists = [
    {
      id: 1,
      title: 'Set Clear Goals - Define what you want to achieve',
      category: 'Goal Setting',
      description: 'Comprehensive checklist for defining and structuring your personal and professional goals',
      totalItems: 14,
      completedItems: 0,
      lastModified: '2024-01-15',
      status: 'active',
      icon: Target,
      color: 'blue',
      videoId: 'Video-01',
      items: [
        { id: 1, text: 'Have you defined what you want to achieve in your job?', answer: null, isHabit: true },
        { id: 2, text: 'Are your personal life goals written down and specific?', answer: null, isHabit: true },
        { id: 3, text: 'Have you broken your main goals into smaller, manageable steps?', answer: null, isHabit: true },
        { id: 4, text: 'Are your goals measurable?', answer: null, isHabit: false },
        { id: 5, text: 'Do your goals have deadlines?', answer: null, isHabit: false },
        { id: 6, text: 'Do you regularly check your progress towards your goals?', answer: null, isHabit: true },
        { id: 7, text: 'Have you adjusted your goals based on your progress?', answer: null, isHabit: false },
        { id: 8, text: 'Do you feel a sense of direction and purpose from your goals?', answer: null, isHabit: false },
        { id: 9, text: 'Are your health goals clearly defined?', answer: null, isHabit: true },
        { id: 10, text: 'Have you identified the specific steps needed to achieve your goals?', answer: null, isHabit: false },
        { id: 11, text: 'Do you keep track of your progress in a journal or app?', answer: null, isHabit: true },
        { id: 12, text: 'Have you set both short-term and long-term goals?', answer: null, isHabit: false },
        { id: 13, text: 'Do you review and adjust your goals periodically?', answer: null, isHabit: true },
        { id: 14, text: 'Are your goals aligned with your values and priorities?', answer: null, isHabit: false }
      ]
    },
    {
      id: 2,
      title: 'Daily Productivity Habits',
      category: 'Productivity',
      description: 'Essential daily habits for maximum productivity and efficiency',
      totalItems: 12,
      completedItems: 0,
      lastModified: '2024-01-14',
      status: 'active',
      icon: Zap,
      color: 'yellow',
      videoId: 'Video-02',
      items: [
        { id: 1, text: 'Do you start your day with a morning routine?', answer: null, isHabit: true },
        { id: 2, text: 'Have you identified your most productive hours?', answer: null, isHabit: false },
        { id: 3, text: 'Do you prioritize your tasks using a system (like Eisenhower Matrix)?', answer: null, isHabit: true },
        { id: 4, text: 'Are you eliminating distractions during work time?', answer: null, isHabit: true },
        { id: 5, text: 'Do you take regular breaks to maintain focus?', answer: null, isHabit: true },
        { id: 6, text: 'Have you automated repetitive tasks?', answer: null, isHabit: false },
        { id: 7, text: 'Do you batch similar activities together?', answer: null, isHabit: true },
        { id: 8, text: 'Are you using time-blocking for your schedule?', answer: null, isHabit: true },
        { id: 9, text: 'Do you review and plan your next day the evening before?', answer: null, isHabit: true },
        { id: 10, text: 'Have you established boundaries for work-life balance?', answer: null, isHabit: false },
        { id: 11, text: 'Do you track your time to identify inefficiencies?', answer: null, isHabit: true },
        { id: 12, text: 'Are you continuously learning and improving your skills?', answer: null, isHabit: true }
      ]
    },
    {
      id: 3,
      title: 'Financial Health Assessment',
      category: 'Finance',
      description: 'Comprehensive evaluation of your financial habits and planning',
      totalItems: 16,
      completedItems: 0,
      lastModified: '2024-01-13',
      status: 'active',
      icon: TrendingUp,
      color: 'green',
      videoId: 'Video-03',
      items: [
        { id: 1, text: 'Do you track your monthly income and expenses?', answer: null, isHabit: true },
        { id: 2, text: 'Have you created and stick to a budget?', answer: null, isHabit: true },
        { id: 3, text: 'Do you have an emergency fund covering 3-6 months of expenses?', answer: null, isHabit: false },
        { id: 4, text: 'Are you regularly saving a percentage of your income?', answer: null, isHabit: true },
        { id: 5, text: 'Do you invest in retirement accounts (401k, IRA)?', answer: null, isHabit: true },
        { id: 6, text: 'Have you diversified your investment portfolio?', answer: null, isHabit: false },
        { id: 7, text: 'Do you review your financial goals quarterly?', answer: null, isHabit: true },
        { id: 8, text: 'Are you paying off high-interest debt first?', answer: null, isHabit: true },
        { id: 9, text: 'Do you have adequate insurance coverage?', answer: null, isHabit: false },
        { id: 10, text: 'Have you automated your savings and bill payments?', answer: null, isHabit: true },
        { id: 11, text: 'Do you regularly check your credit score?', answer: null, isHabit: true },
        { id: 12, text: 'Are you educating yourself about personal finance?', answer: null, isHabit: true },
        { id: 13, text: 'Do you negotiate bills and subscriptions regularly?', answer: null, isHabit: true },
        { id: 14, text: 'Have you planned for major future expenses?', answer: null, isHabit: false },
        { id: 15, text: 'Do you track your net worth monthly?', answer: null, isHabit: true },
        { id: 16, text: 'Are you maximizing tax-advantaged accounts?', answer: null, isHabit: false }
      ]
    },
    {
      id: 4,
      title: 'Health & Wellness Routine',
      category: 'Health',
      description: 'Essential habits for maintaining physical and mental well-being',
      totalItems: 15,
      completedItems: 0,
      lastModified: '2024-01-12',
      status: 'active',
      icon: Award,
      color: 'pink',
      videoId: 'Video-04',
      items: [
        { id: 1, text: 'Do you exercise at least 30 minutes, 5 days a week?', answer: null, isHabit: true },
        { id: 2, text: 'Are you drinking adequate water daily (8+ glasses)?', answer: null, isHabit: true },
        { id: 3, text: 'Do you get 7-9 hours of quality sleep nightly?', answer: null, isHabit: true },
        { id: 4, text: 'Have you established a consistent sleep schedule?', answer: null, isHabit: true },
        { id: 5, text: 'Do you eat a balanced diet with fruits and vegetables?', answer: null, isHabit: true },
        { id: 6, text: 'Are you practicing stress management techniques?', answer: null, isHabit: true },
        { id: 7, text: 'Do you take regular breaks from screens?', answer: null, isHabit: true },
        { id: 8, text: 'Have you scheduled regular health check-ups?', answer: null, isHabit: false },
        { id: 9, text: 'Do you practice mindfulness or meditation?', answer: null, isHabit: true },
        { id: 10, text: 'Are you maintaining social connections?', answer: null, isHabit: true },
        { id: 11, text: 'Do you spend time outdoors regularly?', answer: null, isHabit: true },
        { id: 12, text: 'Have you limited processed foods and sugar?', answer: null, isHabit: true },
        { id: 13, text: 'Do you practice good posture and ergonomics?', answer: null, isHabit: true },
        { id: 14, text: 'Are you managing your mental health proactively?', answer: null, isHabit: true },
        { id: 15, text: 'Do you have hobbies that bring you joy?', answer: null, isHabit: true }
      ]
    },
    ...importedChecklists
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20'
      case 'completed': return 'text-blue-400 bg-blue-400/20'
      case 'draft': return 'text-yellow-400 bg-yellow-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  const getIconColor = (color) => {
    switch (color) {
      case 'blue': return 'text-blue-400 bg-blue-500/20'
      case 'green': return 'text-green-400 bg-green-500/20'
      case 'yellow': return 'text-yellow-400 bg-yellow-500/20'
      case 'pink': return 'text-pink-400 bg-pink-500/20'
      case 'purple': return 'text-purple-400 bg-purple-500/20'
      default: return 'text-blue-400 bg-blue-500/20'
    }
  }

  const filteredChecklists = sampleChecklists.filter(checklist => 
    checklist.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'all' || checklist.category.toLowerCase() === selectedCategory.toLowerCase())
  )

  const handleChecklistClick = (checklist) => {
    setActiveChecklist(checklist)
  }

  const handleImport = () => {
    setShowImporter(true)
  }

  const handleChecklistCreated = (checklistData) => {
    setImportedChecklists(prev => [checklistData, ...prev])
    toast.success('New checklist imported successfully!')
  }

  if (activeChecklist) {
    return (
      <ChecklistForm 
        checklist={activeChecklist} 
        onBack={() => setActiveChecklist(null)} 
      />
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
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold gradient-text mb-2">Interactive Checklists</h2>
            <p className="text-white/70">Analysis by synthesis with YES/NO forms and habit tracking</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <motion.button
              onClick={handleImport}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-button flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>Import Checklist</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-button flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export Results</span>
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
                placeholder="Search checklists..."
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
              <option value="all">All Categories</option>
              <option value="goal setting">Goal Setting</option>
              <option value="productivity">Productivity</option>
              <option value="finance">Finance</option>
              <option value="health">Health</option>
              <option value="imported">Imported</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Checklists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredChecklists.map((checklist, index) => {
          const Icon = checklist.icon || CheckSquare
          const completionRate = checklist.totalItems > 0 ? (checklist.completedItems / checklist.totalItems * 100) : 0
          
          return (
            <motion.div
              key={checklist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="glass-card cursor-pointer group"
              onClick={() => handleChecklistClick(checklist)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getIconColor(checklist.color)}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                      {checklist.title}
                    </h3>
                    <p className="text-sm text-white/60">{checklist.category}</p>
                    {checklist.videoId && (
                      <p className="text-xs text-purple-400 mt-1">{checklist.videoId}</p>
                    )}
                  </div>
                </div>
                
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(checklist.status)}`}>
                  {checklist.status}
                </span>
              </div>
              
              <p className="text-sm text-white/70 mb-4 line-clamp-2">{checklist.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Progress</span>
                  <span className="text-white font-medium">{checklist.completedItems}/{checklist.totalItems}</span>
                </div>
                
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Last Modified</span>
                  <span className="text-white/80">{checklist.lastModified}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                >
                  <Play className="h-3 w-3" />
                  <span>Start Checklist</span>
                </motion.button>
                
                <div className="flex items-center space-x-2 text-white/60">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs">{Math.ceil(checklist.totalItems * 0.5)} min</span>
                </div>
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
        <h3 className="text-lg font-semibold mb-4">Checklist Summary</h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{sampleChecklists.length}</div>
            <div className="text-sm text-white/60">Total Checklists</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {sampleChecklists.reduce((sum, c) => sum + c.totalItems, 0)}
            </div>
            <div className="text-sm text-white/60">Total Items</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {sampleChecklists.reduce((sum, c) => sum + c.completedItems, 0)}
            </div>
            <div className="text-sm text-white/60">Completed</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {sampleChecklists.filter(c => c.status === 'active').length}
            </div>
            <div className="text-sm text-white/60">Active</div>
          </div>
        </div>
      </motion.div>

      {/* Checklist Importer Modal */}
      {showImporter && (
        <ChecklistImporter
          onClose={() => setShowImporter(false)}
          onChecklistCreated={handleChecklistCreated}
        />
      )}
    </div>
  )
}

export default Checklists
