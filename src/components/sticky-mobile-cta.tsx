'use client'

import { useCallback } from 'react'
import { Button } from '@/components/button'
import { track } from '@/lib/analytics'

export function StickyMobileCta() {
  const handleClick = useCallback(() => {
    track('free_score_cta_click', { placement: 'sticky' })
  }, [])

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 border-t border-slate-200 bg-white/95 p-3 backdrop-blur-sm md:hidden">
      <Button
        href="/score?utm_source=lp&utm_content=sticky"
        onClick={handleClick}
        color="blue"
        className="w-full"
      >
        Get Your Free Profile Score
      </Button>
    </div>
  )
}
