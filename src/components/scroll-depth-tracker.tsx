'use client'

import { useEffect, useRef } from 'react'
import { track } from '@/lib/analytics'

const MILESTONES = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

export function ScrollDepthTracker() {
  const firedMilestones = useRef<Set<number>>(new Set())

  useEffect(() => {
    let ticking = false

    function getScrollPercentage(): number {
      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollableHeight = documentHeight - windowHeight

      if (scrollableHeight <= 0) return 100

      return Math.min(100, (scrollTop / scrollableHeight) * 100)
    }

    function checkMilestones() {
      const scrollPercent = getScrollPercentage()

      for (const milestone of MILESTONES) {
        if (
          scrollPercent >= milestone &&
          !firedMilestones.current.has(milestone)
        ) {
          firedMilestones.current.add(milestone)
          track('scroll_depth', { depth: milestone })
        }
      }
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkMilestones()
          ticking = false
        })
        ticking = true
      }
    }

    // Check initial scroll position (user might land mid-page)
    checkMilestones()

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return null
}
