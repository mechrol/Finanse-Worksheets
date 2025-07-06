import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, TrendingUp } from 'lucide-react'

const AffiliateBanner = ({ 
  variant = 'default', 
  className = '', 
  showCloseButton = true,
  autoHide = false,
  hideDelay = 10000 
}) => {
  const [isVisible, setIsVisible] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  React.useEffect(() => {
    if (autoHide && hideDelay) {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, hideDelay)
      return () => clearTimeout(timer)
    }
  }, [autoHide, hideDelay])

  const handleClick = () => {
    // Track click for analytics if needed
    window.open('https://backoffice.thevyb.io/invite/u:jankra', '_blank', 'noopener,noreferrer')
  }

  const handleClose = (e) => {
    e.stopPropagation()
    setIsVisible(false)
  }

  if (!isVisible) return null

  const variants = {
    default: {
      gradient: 'from-blue-600/20 to-purple-600/20',
      border: 'border-blue-400/30',
      text: 'text-blue-300',
      accent: 'text-purple-400'
    },
    success: {
      gradient: 'from-green-600/20 to-emerald-600/20',
      border: 'border-green-400/30',
      text: 'text-green-300',
      accent: 'text-emerald-400'
    },
    warning: {
      gradient: 'from-yellow-600/20 to-orange-600/20',
      border: 'border-yellow-400/30',
      text: 'text-yellow-300',
      accent: 'text-orange-400'
    },
    minimal: {
      gradient: 'from-white/5 to-white/10',
      border: 'border-white/20',
      text: 'text-white/80',
      accent: 'text-white'
    }
  }

  const currentVariant = variants[variant] || variants.default

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className={`relative overflow-hidden ${className}`}
      >
        <motion.div
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className={`
            relative cursor-pointer p-4 rounded-xl border backdrop-blur-sm
            bg-gradient-to-br ${currentVariant.gradient} ${currentVariant.border}
            hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300
            group
          `}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12" />
          </div>

          {/* Close Button */}
          {showCloseButton && (
            <motion.button
              onClick={handleClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-2 right-2 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
            >
              <X className="h-3 w-3 text-white/60" />
            </motion.button>
          )}

          <div className="relative z-10">
            <div className="flex items-center space-x-3">
              {/* Banner Image */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <img 
                    src="https://nai.info.pl/zasoby/grafika/" 
                    alt="Financial Services"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                  <div className="hidden w-full h-full items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className={`font-semibold ${currentVariant.accent}`}>
                    Boost Your Financial Growth
                  </h4>
                  <motion.div
                    animate={{ x: isHovered ? 5 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ExternalLink className="h-4 w-4 text-white/60" />
                  </motion.div>
                </div>
                
                <p className={`text-sm ${currentVariant.text} mb-2`}>
                  Discover professional financial tools and services to maximize your wealth building potential.
                </p>
                
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-white/70">
                    Sponsored
                  </span>
                  <span className="text-xs text-white/50">
                    Click to learn more
                  </span>
                </div>
              </div>
            </div>

            {/* Hover Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: isHovered ? '100%' : '-100%' }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AffiliateBanner
