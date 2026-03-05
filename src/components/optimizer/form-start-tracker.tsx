'use client'

import { useEffect } from 'react'
import { track } from '@/lib/analytics'

export function FormStartTracker() {
  useEffect(() => {
    track('optimizer_form_started')
  }, [])

  return null
}
