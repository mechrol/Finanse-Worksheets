import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Wallet,
  Shield,
  Zap,
  TrendingUp
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { useTranslation } from '../utils/translations'
import { useAuth } from '../hooks/useAuth'
import LanguageToggle from './LanguageToggle'

const AuthPage = () => {
  const [mode, setMode] = useState('login') // 'login', 'register', 'reset'
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  })

  const { language } = useLanguage()
  const { t } = useTranslation(language)
  const { signIn, signUp, resetPassword, loading } = useAuth()

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (mode === 'login') {
      await signIn(formData.email, formData.password)
    } else if (mode === 'register') {
      if (formData.password !== formData.confirmPassword) {
        toast.error(language === 'pl' ? 'Hasła nie pasują do siebie' : 'Passwords do not match')
        return
      }
      await signUp(formData.email, formData.password, formData.fullName)
    } else if (mode === 'reset') {
      await resetPassword(formData.email)
    }
  }

  const features = [
    {
      icon: TrendingUp,
      title: t('auth.features.smartAnalytics.title'),
      description: t('auth.features.smartAnalytics.description')
    },
    {
      icon: Shield,
      title: t('auth.features.securePrivate.title'),
      description: t('auth.features.securePrivate.description')
    },
    {
      icon: Zap,
      title: t('auth.features.realtimeSync.title'),
      description: t('auth.features.realtimeSync.description')
    }
  ]

  return (
    <div className="min-h-screen flex">
      {/* Language Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageToggle />
      </div>

      {/* Left Side - Features */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 to-indigo-900/90" />
        
        {/* Animated background elements */}
        <motion.div 
          className="absolute top-20 left-20 w-32 h-32 rounded-full bg-purple-500/20 blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-blue-500/20 blur-xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center space-x-3 mb-8">
              <Wallet className="h-10 w-10 text-purple-400" />
              <h1 className="text-3xl font-bold gradient-text">{t('appName')}</h1>
            </div>
            
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              {t('auth.tagline')}
              <span className="block gradient-text">{t('auth.taglineHighlight')}</span>
            </h2>
            
            <p className="text-xl text-white/80 mb-12 leading-relaxed">
              {t('auth.description')}
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="p-3 bg-purple-500/20 rounded-lg">
                      <Icon className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{feature.title}</h3>
                      <p className="text-white/70">{feature.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="glass-card p-8 rounded-2xl">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center space-x-2 mb-8">
              <Wallet className="h-8 w-8 text-purple-400" />
              <h1 className="text-2xl font-bold gradient-text">{t('appName')}</h1>
            </div>

            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                {mode === 'login' && t('auth.welcomeBack')}
                {mode === 'register' && t('auth.createAccount')}
                {mode === 'reset' && t('auth.resetPassword')}
              </h2>
              <p className="text-white/60">
                {mode === 'login' && t('auth.signInSubtitle')}
                {mode === 'register' && t('auth.registerSubtitle')}
                {mode === 'reset' && t('auth.resetSubtitle')}
              </p>
            </div>

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {mode === 'register' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      {t('auth.fullName')}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder={t('auth.fullNamePlaceholder')}
                        required={mode === 'register'}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  {t('auth.email')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder={t('auth.emailPlaceholder')}
                    required
                  />
                </div>
              </div>

              {mode !== 'reset' && (
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    {t('auth.password')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder={t('auth.passwordPlaceholder')}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              )}

              {mode === 'register' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    {t('auth.confirmPassword')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder={t('auth.confirmPasswordPlaceholder')}
                      required
                    />
                  </div>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    <span>
                      {mode === 'login' && t('auth.signIn')}
                      {mode === 'register' && t('auth.signUp')}
                      {mode === 'reset' && t('auth.sendResetEmail')}
                    </span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Mode Switching */}
            <div className="mt-8 text-center space-y-4">
              {mode === 'login' && (
                <>
                  <button
                    onClick={() => setMode('reset')}
                    className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
                  >
                    {t('auth.forgotPassword')}
                  </button>
                  <div className="text-white/60 text-sm">
                    {t('auth.noAccount')}{' '}
                    <button
                      onClick={() => setMode('register')}
                      className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                    >
                      {t('auth.signUp')}
                    </button>
                  </div>
                </>
              )}

              {mode === 'register' && (
                <div className="text-white/60 text-sm">
                  {t('auth.hasAccount')}{' '}
                  <button
                    onClick={() => setMode('login')}
                    className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                  >
                    {t('auth.signIn')}
                  </button>
                </div>
              )}

              {mode === 'reset' && (
                <div className="text-white/60 text-sm">
                  {t('auth.rememberPassword')}{' '}
                  <button
                    onClick={() => setMode('login')}
                    className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                  >
                    {t('auth.signIn')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AuthPage
