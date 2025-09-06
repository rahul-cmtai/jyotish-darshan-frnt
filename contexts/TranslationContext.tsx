"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface TranslationContextType {
  locale: string
  setLocale: (locale: string) => void
  t: (key: string, fallback?: string) => string
  isLoading: boolean
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

interface TranslationProviderProps {
  children: ReactNode
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [locale, setLocale] = useState('en')
  const [translations, setTranslations] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') || 'en'
    setLocale(savedLocale)
    loadTranslations(savedLocale)
  }, [])

  const loadTranslations = async (newLocale: string) => {
    try {
      setIsLoading(true)
      // Add cache-busting parameter to ensure fresh translations
      const cacheBuster = Date.now()
      const response = await fetch(`/locales/${newLocale}/common.json?t=${cacheBuster}`)
      if (response.ok) {
        const data = await response.json()
        setTranslations(data)
        console.log('Translations loaded for', newLocale, ':', data)
      } else {
        console.error('Failed to fetch translations:', response.status)
      }
    } catch (error) {
      console.error('Failed to load translations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetLocale = (newLocale: string) => {
    setLocale(newLocale)
    localStorage.setItem('locale', newLocale)
    // Force reload translations
    setTranslations({})
    loadTranslations(newLocale)
  }

  const t = (key: string, fallback?: string): string => {
    if (isLoading) {
      console.log('Translation loading, returning fallback for:', key)
      return fallback || key
    }
    
    // If translations are empty, return the key
    if (!translations || Object.keys(translations).length === 0) {
      console.warn('Translations not loaded yet for key:', key)
      return fallback || key
    }
    
    console.log('Looking for translation key:', key, 'in translations:', translations)
    
    const keys = key.split('.')
    let value: any = translations
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
        console.log(`Found key ${k}, value:`, value)
      } else {
        console.warn(`Translation key not found: ${key} (missing: ${k})`)
        return fallback || key
      }
    }
    
    if (typeof value === 'string') {
      console.log(`Translation found for ${key}:`, value)
      return value
    } else {
      console.warn(`Translation value is not a string for key: ${key}`, value)
      return fallback || key
    }
  }

  return (
    <TranslationContext.Provider value={{ locale, setLocale: handleSetLocale, t, isLoading }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider')
  }
  return context
}
