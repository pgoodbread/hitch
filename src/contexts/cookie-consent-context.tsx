'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'

export type ConsentType = 'accepted' | 'declined' | null

interface CookieConsentContextType {
  consent: ConsentType
  showBanner: boolean
  acceptCookies: () => void
  declineCookies: () => void
  resetConsent: () => void
}

const CookieConsentContext = createContext<
  CookieConsentContextType | undefined
>(undefined)

const CONSENT_COOKIE_NAME = 'cookie-consent'
const CONSENT_COOKIE_EXPIRY = 365 // days

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentType>(null)
  const [showBanner, setShowBanner] = useState(false)

  // Load consent from cookie on mount
  useEffect(() => {
    const storedConsent = getCookie(CONSENT_COOKIE_NAME)
    if (storedConsent === 'accepted' || storedConsent === 'declined') {
      setConsent(storedConsent)
      setShowBanner(false)
    } else {
      setShowBanner(true)
    }
  }, [])

  const acceptCookies = () => {
    setConsent('accepted')
    setShowBanner(false)
    setCookie(CONSENT_COOKIE_NAME, 'accepted', CONSENT_COOKIE_EXPIRY)

    // Reload the page to initialize PostHog with consent
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  const declineCookies = () => {
    setConsent('declined')
    setShowBanner(false)
    setCookie(CONSENT_COOKIE_NAME, 'declined', CONSENT_COOKIE_EXPIRY)

    // Clear any existing PostHog cookies
    clearAnalyticsCookies()
  }

  const resetConsent = () => {
    setConsent(null)
    setShowBanner(true)
    deleteCookie(CONSENT_COOKIE_NAME)
    clearAnalyticsCookies()
  }

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        showBanner,
        acceptCookies,
        declineCookies,
        resetConsent,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  )
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext)
  if (context === undefined) {
    throw new Error(
      'useCookieConsent must be used within a CookieConsentProvider',
    )
  }
  return context
}

// Cookie utility functions
function setCookie(name: string, value: string, days: number) {
  if (typeof window === 'undefined') return

  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
  const expires = `expires=${date.toUTCString()}`
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`
}

function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null

  const nameEQ = `${name}=`
  const cookies = document.cookie.split(';')

  for (const cookie of cookies) {
    const c = cookie.trim()
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length)
    }
  }
  return null
}

function deleteCookie(name: string) {
  if (typeof window === 'undefined') return
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
}

function clearAnalyticsCookies() {
  if (typeof window === 'undefined') return

  // Clear PostHog related cookies
  const posthogCookies = ['ph_phc', '_ph_', 'ph_', 'posthog']

  const allCookies = document.cookie.split(';')

  allCookies.forEach((cookie) => {
    const eqPos = cookie.indexOf('=')
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()

    // Check if this cookie is related to PostHog
    if (posthogCookies.some((prefix) => name.startsWith(prefix))) {
      deleteCookie(name)
    }
  })

  // Also clear localStorage items related to PostHog
  if (typeof localStorage !== 'undefined') {
    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (key.includes('posthog') || key.includes('ph_'))) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key))
  }

  // Clear sessionStorage as well
  if (typeof sessionStorage !== 'undefined') {
    const keysToRemove: string[] = []
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      if (key && (key.includes('posthog') || key.includes('ph_'))) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach((key) => sessionStorage.removeItem(key))
  }
}
