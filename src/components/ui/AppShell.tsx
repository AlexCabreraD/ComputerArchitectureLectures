import React from 'react'
import styles from './AppShell.module.css'

interface AppShellProps {
  children: React.ReactNode
  className?: string
}

interface AppShellSidebarProps {
  children: React.ReactNode
  className?: string
}

interface AppShellMainProps {
  children: React.ReactNode
  className?: string
}

const AppShell: React.FC<AppShellProps> & {
  Sidebar: React.FC<AppShellSidebarProps>
  Main: React.FC<AppShellMainProps>
} = ({ children, className = '' }) => {
  return (
    <div className={`${styles.appShell} ${className}`}>
      {children}
    </div>
  )
}

const AppShellSidebar: React.FC<AppShellSidebarProps> = ({ children, className = '' }) => {
  return (
    <aside className={`${styles.sidebar} ${className}`}>
      <div className={styles.sidebarContent}>
        {children}
      </div>
    </aside>
  )
}

const AppShellMain: React.FC<AppShellMainProps> = ({ children, className = '' }) => {
  return (
    <main className={`${styles.main} ${className}`}>
      {children}
    </main>
  )
}

AppShell.Sidebar = AppShellSidebar
AppShell.Main = AppShellMain

export default AppShell