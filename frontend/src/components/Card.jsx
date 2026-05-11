import React from 'react'
import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '', 
  onClick, 
  animate = true,
  staticCard = false,
  ...props 
}) => {
  const baseClasses = staticCard ? 'card-static' : 'card'
  
  if (animate) {
    return (
      <motion.div
        className={`${baseClasses} p-4 ${onClick ? 'cursor-pointer' : ''} ${className}`}
        onClick={onClick}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        whileHover={!staticCard && onClick ? { scale: 1.02 } : {}}
        whileTap={!staticCard && onClick ? { scale: 0.98 } : {}}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
  
  return (
    <div className={`${baseClasses} p-4 ${onClick ? 'cursor-pointer' : ''} ${className}`} onClick={onClick} {...props}>
      {children}
    </div>
  )
}

export default Card
