import React, { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Check localStorage first, then browser language, default to Polish
    const saved = localStorage.getItem('preferred-language')
    if (saved) return saved
    
    const browserLang = navigator.language.toLowerCase()
    return browserLang.startsWith('pl') ? 'pl' : 'pl' // Default to Polish
  })

  useEffect(() => {
    localStorage.setItem('preferred-language', language)
  }, [language])

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'pl' ? 'en' : 'pl')
  }

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    isPolish: language === 'pl',
    isEnglish: language === 'en'
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
