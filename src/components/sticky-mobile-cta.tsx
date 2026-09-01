'use client'

import { useCallback, useEffect, useState } from 'react'
import clsx from 'clsx'
import { Button } from '@/components/button'
import { track } from '@/lib/analytics'

export function StickyMobileCta() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 100)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleClick = useCallback(() => {
    track('free_score_cta_click', { placement: 'sticky' })
  }, [])

  return (
    <div
      className={clsx(
        'fixed right-0 bottom-0 left-0 z-50 border-t border-slate-200 bg-white/95 p-3 backdrop-blur-sm transition-transform duration-300 md:hidden',
        visible ? 'translate-y-0' : 'translate-y-full',
      )}
    >
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
