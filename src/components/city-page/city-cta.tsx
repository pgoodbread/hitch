'use client'

import { useCallback } from 'react'
import { Button } from '@/components/button'
import { track } from '@/lib/analytics'

export function CityCta({ city, label }: { city: string; label?: string }) {
  const handleClick = useCallback(() => {
    track('city_cta_click', { city })
  }, [city])

  return (
    <Button
      href={`/score?utm_source=city&utm_content=${encodeURIComponent(city)}`}
      onClick={handleClick}
      color="blue"
    >
      {label || 'Get Your Free Profile Score'}
    </Button>
  )
}
