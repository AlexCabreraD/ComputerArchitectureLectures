import React from 'react'
import styles from './ScrollArea.module.css'

interface ScrollAreaProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  maxHeight?: string | number
}

const ScrollArea: React.FC<ScrollAreaProps> = ({ 
  children, 
  className = '', 
  style = {},
  maxHeight 
}) => {
  const scrollStyle = {
    ...style,
    ...(maxHeight && { maxHeight })
  }

  return (
    <div 
      className={`${styles.scrollArea} ${className}`}
      style={scrollStyle}
    >
      <div className={styles.viewport}>
        {children}
      </div>
    </div>
  )
}

export default ScrollArea