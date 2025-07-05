import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  X, 
  Upload, 
  FileText, 
  CheckSquare,
  Target,
  Zap,
  Award,
  TrendingUp,
  Plus,
  Trash2
} from 'lucide-react'
import toast from 'react-hot-toast'

const ChecklistImporter = ({ onClose, onChecklistCreated }) => {
  const [importMethod, setImportMethod] = useState('manual') // 'manual' or 'file'
  const [checklistData, setChecklistData] = useState({
    title: '',
    category: '',
    description: '',
    videoId: '',
    items: []
  })
  const [newItem, setNewItem] = useState({ text: '', isHabit: false })

  const categories = [
    { value: 'goal-setting', label: 'Goal Setting', icon: Target, color: 'blue' },
    { value: 'productivity', label: 'Productivity', icon: Zap, color: 'yellow' },
    { value: 'finance', label: 'Finance', icon: TrendingUp, color: 'green' },
    { value: 'health', label: 'Health & Wellness', icon: Award, color: 'pink' },
    { value: 'custom', label: 'Custom Category', icon: CheckSquare, color: 'purple' }
  ]

  const handleAddItem = () => {
    if (!newItem.text.trim()) {
      toast.error('Please enter an item description')
      return
    }

    const item = {
      id: Date.now(),
      text: newItem.text.trim(),
      isHabit: newItem.isHabit,
      answer: null
    }

    setChecklistData(prev => ({
      ...prev,
      items: [...prev.items, item]
    }))

    setNewItem({ text: '', isHabit: false })
    toast.success('Item added to checklist')
  }

  const handleRemoveItem = (itemId) => {
    setChecklistData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }))
    toast.success('Item removed from checklist')
  }

  const handleFileImport = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target.result
        
        // Try to parse as JSON first
        try {
          const jsonData = JSON.parse(content)
          if (jsonData.title && jsonData.items) {
            setChecklistData(jsonData)
            toast.success('Checklist imported from JSON file')
            return
          }
        } catch (jsonError) {
          // If not JSON, try to parse as text
          parseTextContent(content)
        }
      } catch (error) {
        toast.error('Error reading file. Please check the format.')
      }
    }
    
    reader.readAsText(file)
  }

  const parseTextContent = (content) => {
    const lines = content.split('\n').filter(line => line.trim())
    const items = []
    let title = ''
    let description = ''
    let videoId = ''

    lines.forEach((line, index) => {
      const trimmedLine = line.trim()
      
      // Extract title (usually first line or contains "CHECKLIST")
      if (index === 0 || trimmedLine.toUpperCase().includes('CHECKLIST')) {
        title = trimmedLine.replace(/CHECKLIST/i, '').trim()
      }
      
      // Extract video ID
      if (trimmedLine.toLowerCase().includes('video-')) {
        const videoMatch = trimmedLine.match(/video-\d+/i)
        if (videoMatch) {
          videoId = videoMatch[0]
          title = trimmedLine.replace(videoMatch[0], '').replace(/[:-]/g, '').trim()
        }
      }
      
      // Extract items (questions)
      if (trimmedLine.includes('?') && !trimmedLine.toUpperCase().includes('CHECKLIST')) {
        const isHabit = trimmedLine.toLowerCase().includes('do you') || 
                       trimmedLine.toLowerCase().includes('have you') ||
                       trimmedLine.toLowerCase().includes('are you')
        
        items.push({
          id: Date.now() + index,
          text: trimmedLine,
          isHabit: isHabit,
          answer: null
        })
      }
    })

    setChecklistData({
      title: title || 'Imported Checklist',
      category: 'imported',
      description: description || 'Imported from text file',
      videoId: videoId,
      items: items
    })

    toast.success(`Imported ${items.length} items from text file`)
  }

  const handleSubmit = () => {
    if (!checklistData.title.trim()) {
      toast.error('Please enter a checklist title')
      return
    }

    if (checklistData.items.length === 0) {
      toast.error('Please add at least one checklist item')
      return
    }

    const selectedCategory = categories.find(cat => cat.value === checklistData.category)
    
    const newChecklist = {
      id: Date.now(),
      title: checklistData.title,
      category: selectedCategory?.label || 'Custom',
      description: checklistData.description || 'Imported checklist',
      totalItems: checklistData.items.length,
      completedItems: 0,
      lastModified: new Date().toISOString().split('T')[0],
      status: 'active',
      icon: selectedCategory?.icon || CheckSquare,
      color: selectedCategory?.color || 'purple',
      videoId: checklistData.videoId,
      items: checklistData.items
    }

    onChecklistCreated(newChecklist)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="glass-card max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text">Import Checklist</h2>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </motion.button>
        </div>

        {/* Import Method Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3">Import Method</label>
          <div className="flex gap-4">
            <motion.button
              onClick={() => setImportMethod('manual')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                importMethod === 'manual'
                  ? 'border-blue-500 bg-blue-500/20'
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
            >
              <CheckSquare className="h-6 w-6 mx-auto mb-2 text-blue-400" />
              <div className="text-sm font-medium">Manual Entry</div>
              <div className="text-xs text-white/60">Create checklist manually</div>
            </motion.button>

            <motion.button
              onClick={() => setImportMethod('file')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                importMethod === 'file'
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
            >
              <Upload className="h-6 w-6 mx-auto mb-2 text-purple-400" />
              <div className="text-sm font-medium">File Import</div>
              <div className="text-xs text-white/60">Import from text or JSON</div>
            </motion.button>
          </div>
        </div>

        {/* File Import */}
        {importMethod === 'file' && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Upload File</label>
            <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-white/50" />
              <p className="text-white/70 mb-4">
                Upload a text file or JSON file containing your checklist
              </p>
              <input
                type="file"
                accept=".txt,.json"
                onChange={handleFileImport}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="glass-button cursor-pointer inline-flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>Choose File</span>
              </label>
            </div>
          </div>
        )}

        {/* Checklist Details */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                value={checklistData.title}
                onChange={(e) => setChecklistData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                placeholder="Enter checklist title..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={checklistData.category}
                onChange={(e) => setChecklistData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50"
              >
                <option value="">Select category...</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Video ID (optional)</label>
              <input
                type="text"
                value={checklistData.videoId}
                onChange={(e) => setChecklistData(prev => ({ ...prev, videoId: e.target.value }))}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                placeholder="e.g., Video-01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <input
                type="text"
                value={checklistData.description}
                onChange={(e) => setChecklistData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                placeholder="Brief description..."
              />
            </div>
          </div>
        </div>

        {/* Manual Item Entry */}
        {importMethod === 'manual' && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Add Checklist Items</label>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newItem.text}
                onChange={(e) => setNewItem(prev => ({ ...prev, text: e.target.value }))}
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                placeholder="Enter checklist item (question)..."
                onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
              />
              <label className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg">
                <input
                  type="checkbox"
                  checked={newItem.isHabit}
                  onChange={(e) => setNewItem(prev => ({ ...prev, isHabit: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm text-white/80">Habit</span>
              </label>
              <motion.button
                onClick={handleAddItem}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        )}

        {/* Items List */}
        {checklistData.items.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">
              Checklist Items ({checklistData.items.length})
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {checklistData.items.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-white/60 w-6">{index + 1}.</span>
                    <span className="text-white/90">{item.text}</span>
                    {item.isHabit && (
                      <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                        Habit
                      </span>
                    )}
                  </div>
                  <motion.button
                    onClick={() => handleRemoveItem(item.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1 text-red-400 hover:bg-red-500/20 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
          >
            Cancel
          </motion.button>
          <motion.button
            onClick={handleSubmit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white hover:from-blue-600 hover:to-purple-600 transition-all"
          >
            Create Checklist
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

export default ChecklistImporter
