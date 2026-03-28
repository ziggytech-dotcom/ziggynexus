'use client'

import { useEffect, useRef } from 'react'
import type { PortalEventType } from '@/lib/types'

interface Props {
  eventType: PortalEventType
  eventData?: Record<string, unknown>
}

// Drop-in component that fires a single activity tracking call on mount.
// Used on asset/file/article detail pages to log workspace notifications.
export default function ActivityTracker({ eventType, eventData = {} }: Props) {
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current) return
    fired.current = true

    fetch('/api/activity/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType, eventData }),
    }).catch(() => {
      // Non-critical — silently ignore tracking failures
    })
  }, [eventType, eventData])

  return null
}
