import React from 'react'
import styles from './MobileToggle.module.css'

interface MobileToggleProps {
  isOpen: boolean
  onToggle: () => void
}

const MobileToggle: React.FC<MobileToggleProps> = ({ isOpen, onToggle }) => {
  return (
    <button
      className={`${styles.toggle} ${isOpen ? styles.open : ''}`}
      onClick={onToggle}
      aria-label={isOpen ? 'Close video list' : 'Open video list'}
      aria-expanded={isOpen}
    >
      <span className={styles.line} />
      <span className={styles.line} />
      <span className={styles.line} />
    </button>
  )
}

export default MobileToggle