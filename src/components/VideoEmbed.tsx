import React, { useMemo } from 'react'
import useStore from '@/utils/store'
import styles from './VideoEmbed.module.css'

const VideoEmbed: React.FC = () => {
    const currentVideoURL = useStore((state) => state.currentVideoURL)
    const autoplay = useStore((state) => state.autoplay)
    
    const embedUrl = useMemo(() => {
        return `https://www.youtube.com/embed/${currentVideoURL}?autoplay=${autoplay}&rel=0&modestbranding=1&iv_load_policy=3`
    }, [currentVideoURL, autoplay])

    return (
        <div className={styles.container}>
            <div className={styles.videoWrapper}>
                <iframe
                    src={embedUrl}
                    title='YouTube video player'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                    allowFullScreen
                    className={styles.iframe}
                    loading="lazy"
                />
            </div>
        </div>
    )
}

export default React.memo(VideoEmbed)