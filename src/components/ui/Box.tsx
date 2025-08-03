import React from 'react'
import styles from './Box.module.css'

interface BoxProps {
  children: React.ReactNode
  as?: keyof JSX.IntrinsicElements
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
  variant?: 'default' | 'interactive' | 'card'
  size?: 'sm' | 'md' | 'lg'
  active?: boolean
}

const Box: React.FC<BoxProps> = ({
  children,
  as: Component = 'div',
  className = '',
  style = {},
  onClick,
  variant = 'default',
  size = 'md',
  active = false,
  ...props
}) => {
  const classes = [
    styles.box,
    styles[variant],
    styles[size],
    active && styles.active,
    onClick && styles.clickable,
    className
  ].filter(Boolean).join(' ')

  return (
    <Component
      className={classes}
      style={style}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Box