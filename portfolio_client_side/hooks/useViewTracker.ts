// hooks/useViewTracker.ts
import { useEffect, useRef, useState } from 'react'

interface ViewTrackerOptions {
  blogId: string
  minTimeSeconds?: number
  minScrollPercent?: number
}

/**
 * Custom hook to track blog post views
 * Increments view count only after user has:
 * 1. Been on page for at least minTimeSeconds (default 30s)
 * 2. Scrolled at least minScrollPercent (default 25%)
 * 3. Not viewed this blog recently (prevents duplicate counts)
 */
export function useViewTracker({
  blogId,
  minTimeSeconds = 30,
  minScrollPercent = 25
}: ViewTrackerOptions) {
  const [viewCounted, setViewCounted] = useState(false)
  const timeThresholdMet = useRef(false)
  const scrollThresholdMet = useRef(false)
  const viewSent = useRef(false)

  useEffect(() => {
    if (!blogId) return

    // Check if user has already viewed this blog recently (within last 24 hours)
    const viewKey = `blog_view_${blogId}`
    const lastViewTime = localStorage.getItem(viewKey)
    
    if (lastViewTime) {
      const hoursSinceView = (Date.now() - parseInt(lastViewTime)) / (1000 * 60 * 60)
      if (hoursSinceView < 24) {
        // Already counted within last 24 hours, don't count again
        return
      }
    }

    // Timer for minimum time on page
    const timer = setTimeout(() => {
      timeThresholdMet.current = true
      checkAndSendView()
    }, minTimeSeconds * 1000)

    // Scroll depth tracker
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100

      if (scrollPercent >= minScrollPercent) {
        scrollThresholdMet.current = true
        checkAndSendView()
      }
    }

    // Check if both conditions are met and send view
    const checkAndSendView = async () => {
      if (
        timeThresholdMet.current && 
        scrollThresholdMet.current && 
        !viewSent.current
      ) {
        viewSent.current = true
        
        try {
          const response = await fetch(`/api/blogs/${blogId}/views`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          })

          if (response.ok) {
            // Store view timestamp in localStorage
            localStorage.setItem(viewKey, Date.now().toString())
            setViewCounted(true)
            console.log('View counted for blog:', blogId)
          }
        } catch (error) {
          console.error('Error tracking view:', error)
          viewSent.current = false // Allow retry
        }
      }
    }

    window.addEventListener('scroll', handleScroll)

    // Cleanup
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [blogId, minTimeSeconds, minScrollPercent])

  return viewCounted
}