import { useEffect, useCallback } from 'react'
import useStore from '@/utils/store'
import videos from '@/utils/videoList.json'

export const useKeyboardNavigation = () => {
  const currentVideoURL = useStore((state) => state.currentVideoURL)
  const changeVideoURL = useStore((state) => state.changeVideoURL)

  const getCurrentVideoIndex = useCallback(() => {
    let totalIndex = 0
    for (const group of videos) {
      const videoIndex = group.videos.indexOf(currentVideoURL)
      if (videoIndex !== -1) {
        return totalIndex + videoIndex
      }
      totalIndex += group.videos.length
    }
    return -1
  }, [currentVideoURL])

  const getVideoByIndex = useCallback((index: number) => {
    let currentIndex = 0
    for (const group of videos) {
      if (index < currentIndex + group.videos.length) {
        return group.videos[index - currentIndex]
      }
      currentIndex += group.videos.length
    }
    return null
  }, [])

  const getTotalVideos = useCallback(() => {
    return videos.reduce((total, group) => total + group.videos.length, 0)
  }, [])

  const navigateToNext = useCallback(() => {
    const currentIndex = getCurrentVideoIndex()
    const totalVideos = getTotalVideos()
    if (currentIndex !== -1 && currentIndex < totalVideos - 1) {
      const nextVideo = getVideoByIndex(currentIndex + 1)
      if (nextVideo) {
        changeVideoURL(nextVideo)
      }
    }
  }, [getCurrentVideoIndex, getTotalVideos, getVideoByIndex, changeVideoURL])

  const navigateToPrevious = useCallback(() => {
    const currentIndex = getCurrentVideoIndex()
    if (currentIndex > 0) {
      const prevVideo = getVideoByIndex(currentIndex - 1)
      if (prevVideo) {
        changeVideoURL(prevVideo)
      }
    }
  }, [getCurrentVideoIndex, getVideoByIndex, changeVideoURL])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (event.key) {
        case 'ArrowUp':
        case 'k':
          event.preventDefault()
          navigateToPrevious()
          break
        case 'ArrowDown':
        case 'j':
          event.preventDefault()
          navigateToNext()
          break
        case 'Home':
          event.preventDefault()
          const firstVideo = getVideoByIndex(0)
          if (firstVideo) {
            changeVideoURL(firstVideo)
          }
          break
        case 'End':
          event.preventDefault()
          const lastVideo = getVideoByIndex(getTotalVideos() - 1)
          if (lastVideo) {
            changeVideoURL(lastVideo)
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigateToNext, navigateToPrevious, getVideoByIndex, getTotalVideos, changeVideoURL])

  return {
    navigateToNext,
    navigateToPrevious,
    getCurrentVideoIndex,
    getTotalVideos
  }
}