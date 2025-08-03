import React, { useMemo, useCallback, useState } from 'react'
import { Accordion, SearchInput, ThemeToggle } from '@/components/ui'
import styles from './VideoList.module.css'

import useStore from '@/utils/store'
import videos from '@/utils/videoList.json'
import type { VideoData } from '@/types'

interface VideoItemProps {
    url: string
    index: number
    isActive: boolean
    onSelect: (url: string) => void
}

const VideoItem = React.memo<VideoItemProps>(({ url, index, isActive, onSelect }) => {
    const isWatched = useStore((state) => state.isVideoWatched(url))
    const isCompleted = useStore((state) => state.isVideoCompleted(url))
    
    const handleClick = useCallback(() => {
        onSelect(url)
    }, [url, onSelect])

    return (
        <div className={`${styles.videoItem} ${isActive ? styles.active : ''} ${isWatched ? styles.watched : ''} ${isCompleted ? styles.completed : ''}`}>
            <button 
                onClick={handleClick}
                className={styles.videoItemButton}
                aria-label={`Play part ${index + 1}${isCompleted ? ' (completed)' : isWatched ? ' (watched)' : ''}`}
            >
                <div className={styles.videoItemContent}>
                    <div className={styles.videoItemIcon}>
                        {isActive ? (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        ) : (
                            <div className={styles.partNumber}>{index + 1}</div>
                        )}
                    </div>
                    
                    <div className={styles.videoItemText}>
                        <span className={styles.videoTitle}>Part {index + 1}</span>
                        {isWatched && (
                            <span className={styles.videoMeta}>
                                {isCompleted ? 'Completed' : 'Watched'}
                            </span>
                        )}
                    </div>
                </div>
                
                <div className={styles.videoItemStatus}>
                    {isCompleted && (
                        <div className={`${styles.statusBadge} ${styles.completed}`}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                            </svg>
                        </div>
                    )}
                    {isWatched && !isCompleted && (
                        <div className={`${styles.statusBadge} ${styles.watched}`}>
                            <div className={styles.watchedDot}></div>
                        </div>
                    )}
                    {!isWatched && (
                        <div className={`${styles.statusBadge} ${styles.unwatched}`}>
                            <div className={styles.unwatchedRing}></div>
                        </div>
                    )}
                </div>
            </button>
        </div>
    )
})

VideoItem.displayName = 'VideoItem'

interface VideoGroupProps {
    group: VideoData[0]
    groupIndex: number
    currentVideoURL: string
    onVideoSelect: (url: string) => void
}

const VideoGroup = React.memo<VideoGroupProps>(({ group, groupIndex, currentVideoURL, onVideoSelect }) => {
    const isVideoWatched = useStore((state) => state.isVideoWatched)
    const isVideoCompleted = useStore((state) => state.isVideoCompleted)
    
    const isGroupActive = useMemo(() => {
        return group.videos.includes(currentVideoURL)
    }, [group.videos, currentVideoURL])

    const groupProgress = useMemo(() => {
        const totalVideos = group.videos.length
        const watchedCount = group.videos.filter(url => isVideoWatched(url)).length
        const completedCount = group.videos.filter(url => isVideoCompleted(url)).length
        
        return {
            total: totalVideos,
            watched: watchedCount,
            completed: completedCount,
            percentage: totalVideos > 0 ? Math.round((completedCount / totalVideos) * 100) : 0
        }
    }, [group.videos, isVideoWatched, isVideoCompleted])

    return (
        <Accordion.Item value={groupIndex.toString()}>
            <Accordion.Trigger className={`${styles.groupTrigger} ${isGroupActive ? styles.active : ''}`}>
                <div className={styles.groupHeader}>
                    <div className={styles.groupTitleSection}>
                        <h3 className={styles.groupTitle}>{group.topicName}</h3>
                        <div className={styles.groupMeta}>
                            {groupProgress.completed > 0 && (
                                <span className={styles.progressText}>
                                    {groupProgress.completed}/{groupProgress.total} completed
                                </span>
                            )}
                            {groupProgress.watched > groupProgress.completed && (
                                <span className={styles.progressText}>
                                    {groupProgress.watched - groupProgress.completed} in progress
                                </span>
                            )}
                        </div>
                    </div>
                    
                    <div className={styles.groupProgress}>
                        {groupProgress.completed > 0 && (
                            <div className={styles.progressRing}>
                                <svg width="20" height="20" viewBox="0 0 20 20">
                                    <circle
                                        cx="10"
                                        cy="10"
                                        r="8"
                                        fill="none"
                                        stroke="var(--color-surface-hover)"
                                        strokeWidth="2"
                                    />
                                    <circle
                                        cx="10"
                                        cy="10"
                                        r="8"
                                        fill="none"
                                        stroke="var(--color-accent-success)"
                                        strokeWidth="2"
                                        strokeDasharray={`${groupProgress.percentage * 0.503} 50.3`}
                                        strokeDashoffset="12.575"
                                        transform="rotate(-90 10 10)"
                                        className={styles.progressCircle}
                                    />
                                </svg>
                                <span className={styles.progressPercentage}>{groupProgress.percentage}%</span>
                            </div>
                        )}
                    </div>
                </div>
            </Accordion.Trigger>
            <Accordion.Content>
                <div className={styles.videoItemsList}>
                    {group.videos.map((url, videoIndex) => (
                        <VideoItem
                            key={url}
                            url={url}
                            index={videoIndex}
                            isActive={url === currentVideoURL}
                            onSelect={onVideoSelect}
                        />
                    ))}
                </div>
            </Accordion.Content>
        </Accordion.Item>
    )
})

VideoGroup.displayName = 'VideoGroup'

const VideoList: React.FC = () => {
    const currentVideoURL = useStore((state) => state.currentVideoURL)
    const changeVideoURL = useStore((state) => state.changeVideoURL)
    const [searchQuery, setSearchQuery] = useState('')

    const videoData: VideoData = videos

    const filteredVideoData = useMemo(() => {
        if (!searchQuery.trim()) {
            return videoData
        }

        const query = searchQuery.toLowerCase()
        return videoData.map(group => ({
            ...group,
            videos: group.videos.filter((_, index) => {
                const partName = `Part ${index + 1}`
                return group.topicName.toLowerCase().includes(query) || 
                       partName.toLowerCase().includes(query)
            })
        })).filter(group => group.videos.length > 0)
    }, [videoData, searchQuery])

    const handleVideoSelect = useCallback((url: string) => {
        changeVideoURL(url)
    }, [changeVideoURL])

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query)
    }, [])

    const getDefaultOpenValues = useMemo(() => {
        if (searchQuery.trim()) {
            return filteredVideoData.map((_, index) => index.toString())
        }
        return ['0']
    }, [searchQuery, filteredVideoData])

    return (
        <div className={styles.videoList}>
            <div className={styles.searchHeader}>
                <SearchInput onSearch={handleSearch} placeholder="Search topics and videos..." />
                <ThemeToggle />
            </div>
            
            {filteredVideoData.length > 0 ? (
                <Accordion multiple={true} defaultValue={getDefaultOpenValues} key={searchQuery}>
                    {filteredVideoData.map((group, index) => (
                        <VideoGroup
                            key={`${group.topicName}-${index}`}
                            group={group}
                            groupIndex={index}
                            currentVideoURL={currentVideoURL}
                            onVideoSelect={handleVideoSelect}
                        />
                    ))}
                </Accordion>
            ) : (
                <div style={{ 
                    padding: 'var(--space-4)', 
                    textAlign: 'center', 
                    color: 'var(--color-text-tertiary)',
                    fontSize: 'var(--font-size-sm)'
                }}>
                    No videos found for "{searchQuery}"
                </div>
            )}
        </div>
    )
}

export default React.memo(VideoList)