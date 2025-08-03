import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface VideoProgress {
    [videoId: string]: {
        watchedAt: number
        completed: boolean
        lastPosition?: number
    }
}

interface VideoStore {
    autoplay: number
    currentVideoURL: string
    videoProgress: VideoProgress
    changeVideoURL: (url: string) => void
    markVideoWatched: (url: string, completed?: boolean) => void
    updateVideoProgress: (url: string, position: number) => void
    isVideoWatched: (url: string) => boolean
    isVideoCompleted: (url: string) => boolean
}

const useStore = create<VideoStore>()(
    persist(
        (set, get) => ({
            autoplay: 0,
            currentVideoURL: 'ZJCuWcmFWSk',
            videoProgress: {},
            
            changeVideoURL: (url: string) => {
                set(() => ({ currentVideoURL: url, autoplay: 1 }))
                get().markVideoWatched(url, false)
            },
            
            markVideoWatched: (url: string, completed = false) => {
                set((state) => ({
                    videoProgress: {
                        ...state.videoProgress,
                        [url]: {
                            ...state.videoProgress[url],
                            watchedAt: Date.now(),
                            completed
                        }
                    }
                }))
            },
            
            updateVideoProgress: (url: string, position: number) => {
                set((state) => ({
                    videoProgress: {
                        ...state.videoProgress,
                        [url]: {
                            ...state.videoProgress[url],
                            lastPosition: position,
                            watchedAt: state.videoProgress[url]?.watchedAt || Date.now()
                        }
                    }
                }))
            },
            
            isVideoWatched: (url: string) => {
                return !!get().videoProgress[url]?.watchedAt
            },
            
            isVideoCompleted: (url: string) => {
                return !!get().videoProgress[url]?.completed
            }
        }),
        {
            name: 'video-progress-storage',
            partialize: (state) => ({ videoProgress: state.videoProgress })
        }
    )
)

export default useStore