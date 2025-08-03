import React from 'react'
import styles from './Skeleton.module.css'

interface SkeletonProps {
  width?: string | number
  height?: string | number
  borderRadius?: string
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
}

const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  borderRadius,
  className = '',
  variant = 'rectangular'
}) => {
  const style: React.CSSProperties = {
    width,
    height,
    borderRadius: borderRadius || (variant === 'circular' ? '50%' : 'var(--radius-base)')
  }

  return (
    <div 
      className={`${styles.skeleton} ${styles[variant]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  )
}

interface SkeletonGroupProps {
  children: React.ReactNode
  loading?: boolean
}

export const SkeletonGroup: React.FC<SkeletonGroupProps> = ({ children, loading = true }) => {
  if (!loading) return <>{children}</>
  
  return <div className={styles.group}>{children}</div>
}

export const VideoListSkeleton: React.FC = () => (
  <div className={styles.videoListSkeleton}>
    {[...Array(3)].map((_, groupIndex) => (
      <div key={groupIndex} className={styles.groupSkeleton}>
        <Skeleton height="48px" className={styles.headerSkeleton} />
        <div className={styles.itemsSkeleton}>
          {[...Array(2)].map((_, itemIndex) => (
            <Skeleton key={itemIndex} height="40px" className={styles.itemSkeleton} />
          ))}
        </div>
      </div>
    ))}
  </div>
)

export const VideoEmbedSkeleton: React.FC = () => (
  <div className={styles.videoEmbedSkeleton}>
    <Skeleton 
      width="100%" 
      height="0" 
      style={{ 
        paddingBottom: '56.25%',
        position: 'relative'
      }} 
      borderRadius="var(--radius-lg)"
    />
  </div>
)

export default Skeleton