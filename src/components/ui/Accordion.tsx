import React, { useState, useRef, useEffect } from 'react'
import styles from './Accordion.module.css'

interface AccordionProps {
  children: React.ReactNode
  multiple?: boolean
  defaultValue?: string[]
  className?: string
}

interface AccordionItemProps {
  children: React.ReactNode
  value: string
  className?: string
}

interface AccordionTriggerProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

interface AccordionContentProps {
  children: React.ReactNode
  className?: string
}

interface AccordionContextType {
  openItems: Set<string>
  toggleItem: (value: string) => void
  multiple: boolean
}

const AccordionContext = React.createContext<AccordionContextType | null>(null)

const useAccordion = () => {
  const context = React.useContext(AccordionContext)
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion')
  }
  return context
}

const Accordion: React.FC<AccordionProps> & {
  Item: React.FC<AccordionItemProps>
  Trigger: React.FC<AccordionTriggerProps>
  Content: React.FC<AccordionContentProps>
} = ({ children, multiple = false, defaultValue = [], className = '' }) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(defaultValue))

  const toggleItem = (value: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(value)) {
        newSet.delete(value)
      } else {
        if (!multiple) {
          newSet.clear()
        }
        newSet.add(value)
      }
      return newSet
    })
  }

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, multiple }}>
      <div className={`${styles.accordion} ${className}`}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

const AccordionItemContext = React.createContext<{ value: string; isOpen: boolean } | null>(null)

const AccordionItem: React.FC<AccordionItemProps> = ({ children, value, className = '' }) => {
  const { openItems } = useAccordion()
  const isOpen = openItems.has(value)

  return (
    <AccordionItemContext.Provider value={{ value, isOpen }}>
      <div className={`${styles.accordionItem} ${className}`}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  )
}

const AccordionTrigger: React.FC<AccordionTriggerProps> = ({ children, className = '', style = {} }) => {
  const { toggleItem } = useAccordion()
  const itemContext = React.useContext(AccordionItemContext)
  
  if (!itemContext) {
    throw new Error('AccordionTrigger must be used within an AccordionItem')
  }

  const { value, isOpen } = itemContext

  return (
    <button
      className={`${styles.accordionTrigger} ${isOpen ? styles.open : ''} ${className}`}
      onClick={() => toggleItem(value)}
      type="button"
      style={style}
      aria-expanded={isOpen}
    >
      <span className={styles.triggerContent}>{children}</span>
      <svg
        className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 6L8 10L12 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

const AccordionContent: React.FC<AccordionContentProps> = ({ children, className = '' }) => {
  const itemContext = React.useContext(AccordionItemContext)
  const contentRef = useRef<HTMLDivElement>(null)
  
  if (!itemContext) {
    throw new Error('AccordionContent must be used within an AccordionItem')
  }

  const { isOpen } = itemContext

  useEffect(() => {
    const element = contentRef.current
    if (!element) return

    if (isOpen) {
      element.style.maxHeight = `${element.scrollHeight}px`
    } else {
      element.style.maxHeight = '0px'
    }
  }, [isOpen])

  return (
    <div
      ref={contentRef}
      className={`${styles.accordionContent} ${isOpen ? styles.open : ''} ${className}`}
    >
      <div className={styles.contentInner}>
        {children}
      </div>
    </div>
  )
}

Accordion.Item = AccordionItem
Accordion.Trigger = AccordionTrigger
Accordion.Content = AccordionContent

export default Accordion