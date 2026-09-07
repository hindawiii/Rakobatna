'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gamepad2, Trophy, Swords, X } from 'lucide-react'
import { useLanguage } from '@/components/providers/language-provider'
import { cn } from '@/lib/utils'

export type FlashNotificationType = 'game-turn' | 'game-win' | 'game-challenge' | 'custom'

interface FlashNotificationProps {
  isVisible: boolean
  type: FlashNotificationType
  title: string
  titleAr: string
  message?: string
  messageAr?: string
  icon?: string
  onClose: () => void
  duration?: number // in ms, default 2000
}

const typeIcons: Record<FlashNotificationType, React.ReactNode> = {
  'game-turn': <Gamepad2 className="w-5 h-5" />,
  'game-win': <Trophy className="w-5 h-5" />,
  'game-challenge': <Swords className="w-5 h-5" />,
  'custom': null,
}

const typeColors: Record<FlashNotificationType, string> = {
  'game-turn': 'from-primary to-accent',
  'game-win': 'from-amber-500 to-orange-500',
  'game-challenge': 'from-purple-500 to-pink-500',
  'custom': 'from-primary to-accent',
}

export function FlashNotification({
  isVisible,
  type,
  title,
  titleAr,
  message,
  messageAr,
  icon,
  onClose,
  duration = 2000,
}: FlashNotificationProps) {
  const { isRTL } = useLanguage()
  
  // Auto-close after duration
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -100, opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed top-4 inset-x-4 z-[100] flex justify-center"
        >
          <div
            className={cn(
              'relative max-w-sm w-full rounded-2xl overflow-hidden shadow-2xl',
              'bg-gradient-to-r',
              typeColors[type]
            )}
          >
            {/* Shine animation */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
            
            <div className="relative flex items-center gap-3 px-4 py-3">
              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                {icon ? (
                  <span className="text-xl">{icon}</span>
                ) : (
                  typeIcons[type]
                )}
              </div>
              
              {/* Content */}
              <div className={cn('flex-1', isRTL ? 'font-arabic' : '')}>
                <p className="font-semibold text-white">
                  {isRTL ? titleAr : title}
                </p>
                {message && (
                  <p className="text-sm text-white/80">
                    {isRTL ? messageAr : message}
                  </p>
                )}
              </div>
              
              {/* Close button */}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook for managing flash notifications
export function useFlashNotification() {
  const [notification, setNotification] = React.useState<{
    isVisible: boolean
    type: FlashNotificationType
    title: string
    titleAr: string
    message?: string
    messageAr?: string
    icon?: string
  }>({
    isVisible: false,
    type: 'custom',
    title: '',
    titleAr: '',
  })
  
  const showNotification = React.useCallback((
    type: FlashNotificationType,
    title: string,
    titleAr: string,
    message?: string,
    messageAr?: string,
    icon?: string
  ) => {
    setNotification({
      isVisible: true,
      type,
      title,
      titleAr,
      message,
      messageAr,
      icon,
    })
  }, [])
  
  const hideNotification = React.useCallback(() => {
    setNotification((prev) => ({ ...prev, isVisible: false }))
  }, [])
  
  return {
    notification,
    showNotification,
    hideNotification,
  }
}
