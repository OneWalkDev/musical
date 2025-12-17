'use client'

import { motion, AnimatePresence } from 'motion/react'
import { IoCheckmarkCircle, IoCloseCircle, IoClose } from 'react-icons/io5'
import { useEffect } from 'react'

export type ModalType = 'success' | 'error'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  type: ModalType
  title: string
  message: string
}

export function Modal({ isOpen, onClose, type, title, message }: ModalProps) {
  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // モーダルが開いている間はスクロールを無効化
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const config = {
    success: {
      icon: IoCheckmarkCircle,
      iconColor: 'text-emerald-500',
      bgGradient: 'from-emerald-400 via-green-500 to-teal-500',
      borderColor: 'border-emerald-200',
    },
    error: {
      icon: IoCloseCircle,
      iconColor: 'text-red-500',
      bgGradient: 'from-red-400 via-pink-500 to-rose-500',
      borderColor: 'border-red-200',
    },
  }

  const currentConfig = config[type]
  const Icon = currentConfig.icon

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="modal-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="absolute inset-0 flex items-center justify-center px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl p-8 border border-white/60 shadow-2xl pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                aria-label="閉じる"
              >
                <IoClose className="text-2xl" />
              </button>

              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className="flex justify-center mb-6"
              >
                <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${currentConfig.bgGradient} shadow-lg`}>
                  <Icon className="text-5xl text-white" />
                </div>
              </motion.div>

              {/* Content */}
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">
                  {title}
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  {message}
                </p>
              </div>

              {/* Action Button */}
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full mt-8 py-3 bg-gradient-to-r ${currentConfig.bgGradient} text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                OK
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
