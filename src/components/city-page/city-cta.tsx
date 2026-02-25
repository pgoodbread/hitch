'use client'

import { useCallback } from 'react'
import { Button } from '@/components/button'
import { track } from '@/lib/analytics'

const STRIPE_URL = 'https://buy.stripe.com/6oUcN59Ub3Zm4jr07R6EU05'

export function CityCta({ city, label }: { city: string; label?: string }) {
  const handleClick = useCallback(() => {
    track('city_cta_click', { city })
    window.location.href = STRIPE_URL
  }, [city])

  return <Button onClick={handleClick}>{label || 'Optimize my profile'}</Button>
}
