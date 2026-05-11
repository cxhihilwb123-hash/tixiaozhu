import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  fullScreen = false,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay */}
          <motion.div
            className="modal-overlay absolute inset-0"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          {/* Modal Content */}
          <motion.div
            className={`modal-content absolute ${
              fullScreen 
                ? 'inset-4 rounded-[14px]' 
                : 'left-4 right-4 top-[20%] max-h-[70vh] overflow-auto'
            } mx-auto max-w-[92vw] sm:max-w-[720px] lg:max-w-[860px]`}
            initial={fullScreen ? { scale: 0.95, opacity: 0 } : { y: 20, opacity: 0 }}
            animate={fullScreen ? { scale: 1, opacity: 1 } : { y: 0, opacity: 1 }}
            exit={fullScreen ? { scale: 0.95, opacity: 0 } : { y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between border-b border-neutral-100 p-4 sm:p-5">
                <h2 className="text-title-1 text-neutral-800">{title}</h2>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
                    aria-label="关闭"
                  >
                    <X size={16} className="text-neutral-500" />
                  </button>
                )}
              </div>
            )}
            
            {/* Body */}
            <div className={fullScreen ? 'h-full overflow-auto' : 'p-4 sm:p-5'}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Modal
