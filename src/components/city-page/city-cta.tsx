'use client'

import { useCallback } from 'react'
import { Button } from '@/components/button'
import { track } from '@/lib/analytics'

export function CityCta({ city, label }: { city: string; label?: string }) {
  const handleClick = useCallback(() => {
    track('city_cta_click', { city })
    window.location.href = '/optimize'
  }, [city])

  return <Button onClick={handleClick}>{label || 'Optimize my profile'}</Button>
}
