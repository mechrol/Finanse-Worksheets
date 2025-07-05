import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  Target,
  TrendingUp,
  Award,
  Calendar,
  Download,
  BarChart3,
  Zap,
  BookOpen,
  Play
} from 'lucide-react'
import toast from 'react-hot-toast'

const ChecklistForm = ({ checklist, onBack }) => {
  const [answers, setAnswers] = useState({})
  const [selectedHabits, setSelectedHabits] = useState([])
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    // Initialize answers from checklist items
    const initialAnswers = {}
    checklist.items.forEach(item => {
      initialAnswers[item.id] = item.answer
    })
    setAnswers(initialAnswers)
  }, [checklist])

  const handleAnswerChange = (itemId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [itemId]: answer
    }))

    // If answer is YES and item is a habit, add to selected habits
    const item = checklist.items.find(i => i.id === itemId)
    if (item && item.isHabit) {
      if (answer === 'yes') {
        setSelectedHabits(prev => [...prev.filter(h => h.id !== itemId), { id: itemId, text: item.text }])
      } else {
        setSelectedHabits(prev => prev.filter(h => h.id !== itemId))
      }
    }
  }

  const handleSubmit = () => {
    const unanswered = checklist.items.filter(item => !answers[item.id])
    if (unanswered.length > 0) {
      toast.error(`Please answer all questions. ${unanswered.length} remaining.`)
      return
    }
    
    setShowResults(true)
    toast.success('Checklist completed! View your results and habit recommendations.')
  }

  const handleHabitChallenge = (habit) => {
    // Redirect to the 30-day challenge guide
    window.open('https://kontrakt.aitribes.app/ft/eXDMm', '_blank')
    toast.success(`Starting 30-day challenge for: ${habit.text.substring(0, 50)}...`)
  }

  const getAnswerStats = () => {
    const totalAnswers = Object.keys(answers).length
    const yesAnswers = Object.values(answers).filter(answer => answer === 'yes').length
    const noAnswers = Object.values(answers).filter(answer => answer === 'no').length
    const completionRate = totalAnswers > 0 ? (totalAnswers / checklist.items.length * 100) : 0
    const positiveRate = totalAnswers > 0 ? (yesAnswers / totalAnswers * 100) : 0
    
    return { totalAnswers, yesAnswers, noAnswers, completionRate, positiveRate }
  }

  const stats = getAnswerStats()

  const renderResults = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <BarChart3 className="h-6 w-6 mr-2 text-blue-400" />
          Analysis Results
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{stats.completionRate.toFixed(0)}%</div>
            <div className="text-sm text-white/60">Completion Rate</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{stats.yesAnswers}</div>
            <div className="text-sm text-white/60">Positive Responses</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{stats.noAnswers}</div>
            <div className="text-sm text-white/60">Areas to Improve</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{selectedHabits.length}</div>
            <div className="text-sm text-white/60">Habits to Develop</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Overall Progress</span>
            <span>{stats.positiveRate.toFixed(0)}% Positive</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${stats.positiveRate}%` }}
            ></div>
          </div>
        </div>
      </motion.div>

      {/* Habit Recommendations */}
      {selectedHabits.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card"
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Target className="h-6 w-6 mr-2 text-orange-400" />
            Recommended Habits to Develop
          </h3>
          
          <p className="text-white/70 mb-4">
            Based on your responses, here are the habits you should focus on developing. 
            Click "Start 30-Day Challenge" to get a comprehensive implementation guide.
          </p>
          
          <div className="space-y-3">
            {selectedHabits.map((habit, index) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                    <Zap className="h-4 w-4 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{habit.text}</p>
                    <p className="text-sm text-white/60">30-day implementation challenge available</p>
                  </div>
                </div>
                
                <motion.button
                  onClick={() => handleHabitChallenge(habit)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white font-medium hover:from-orange-600 hover:to-red-600 transition-all"
                >
                  <Play className="h-4 w-4" />
                  <span>Start 30-Day Challenge</span>
                  <ExternalLink className="h-4 w-4" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Areas for Improvement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card"
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <TrendingUp className="h-6 w-6 mr-2 text-red-400" />
          Areas for Improvement
        </h3>
        
        <div className="space-y-2">
          {checklist.items
            .filter(item => answers[item.id] === 'no')
            .map((item, index) => (
              <div key={item.id} className="flex items-center space-x-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <XCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                <span className="text-white/90">{item.text}</span>
              </div>
            ))}
        </div>
      </motion.div>

      {/* Strengths */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card"
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Award className="h-6 w-6 mr-2 text-green-400" />
          Your Strengths
        </h3>
        
        <div className="space-y-2">
          {checklist.items
            .filter(item => answers[item.id] === 'yes')
            .map((item, index) => (
              <div key={item.id} className="flex items-center space-x-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span className="text-white/90">{item.text}</span>
              </div>
            ))}
        </div>
      </motion.div>
    </div>
  )

  const renderChecklist = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
      >
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">{checklist.title}</h3>
          {checklist.videoId && (
            <p className="text-purple-400 font-medium mb-2">{checklist.videoId}</p>
          )}
          <p className="text-white/70">{checklist.description}</p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Progress</span>
            <span>{stats.totalAnswers}/{checklist.items.length} completed</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${stats.completionRate}%` }}
            ></div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-4 px-2 font-semibold text-white bg-gray-600">ACTIONABLE STEP</th>
                <th className="text-center py-4 px-4 font-semibold text-white bg-green-600 min-w-[100px]">YES</th>
                <th className="text-center py-4 px-4 font-semibold text-white bg-red-600 min-w-[100px]">NO</th>
              </tr>
            </thead>
            <tbody>
              {checklist.items.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="border-b border-white/10 hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 px-2 text-white/90">
                    <div className="flex items-center space-x-2">
                      <span>{item.text}</span>
                      {item.isHabit && (
                        <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                          Habit
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <motion.button
                      onClick={() => handleAnswerChange(item.id, 'yes')}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-8 h-8 rounded border-2 flex items-center justify-center transition-all ${
                        answers[item.id] === 'yes'
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-green-500 text-green-500 hover:bg-green-500/20'
                      }`}
                    >
                      {answers[item.id] === 'yes' && <CheckCircle className="h-5 w-5" />}
                    </motion.button>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <motion.button
                      onClick={() => handleAnswerChange(item.id, 'no')}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-8 h-8 rounded border-2 flex items-center justify-center transition-all ${
                        answers[item.id] === 'no'
                          ? 'bg-red-500 border-red-500 text-white'
                          : 'border-red-500 text-red-500 hover:bg-red-500/20'
                      }`}
                    >
                      {answers[item.id] === 'no' && <XCircle className="h-5 w-5" />}
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-center">
          <motion.button
            onClick={handleSubmit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={stats.totalAnswers < checklist.items.length}
            className={`px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all ${
              stats.totalAnswers < checklist.items.length
                ? 'bg-white/10 text-white/50 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
            }`}
          >
            <TrendingUp className="h-5 w-5" />
            <span>Complete Analysis</span>
          </motion.button>
        </div>
      </motion.div>
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
              <h2 className="text-2xl font-bold gradient-text">
                {showResults ? 'Analysis Results' : 'Interactive Checklist'}
              </h2>
              <p className="text-white/70">
                {showResults ? 'Your synthesis analysis and habit recommendations' : 'Answer all questions to get personalized insights'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {showResults && (
              <motion.button
                onClick={() => setShowResults(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-button flex items-center space-x-2"
              >
                <BookOpen className="h-4 w-4" />
                <span>Back to Checklist</span>
              </motion.button>
            )}
            
            <motion.button
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

      {/* Main Content */}
      {showResults ? renderResults() : renderChecklist()}
    </div>
  )
}

export default ChecklistForm
