import React from 'react'
import { ThemeToggle } from '@/components/ui'
import styles from './Header.module.css'

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.title}>
          <h1>CS 6810 Videos</h1>
        </div>
        
        <div className={styles.actions}>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

export default React.memo(Header)