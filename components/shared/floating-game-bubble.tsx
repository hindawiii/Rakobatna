'use client'

import * as React from 'react'
import { motion, AnimatePresence, useDragControls, PanInfo } from 'framer-motion'
import { Gamepad2, X, Maximize2 } from 'lucide-react'
import { useLanguage } from '@/components/providers/language-provider'
import { cn } from '@/lib/utils'

interface FloatingGameBubbleProps {
  isVisible: boolean
  gameName: string
  gameNameAr: string
  gameIcon: string
  onRestore: () => void
  onClose: () => void
}

export function FloatingGameBubble({
  isVisible,
  gameName,
  gameNameAr,
  gameIcon,
  onRestore,
  onClose,
}: FloatingGameBubbleProps) {
  const { isRTL } = useLanguage()
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const constraintsRef = React.useRef<HTMLDivElement>(null)
  const [showMenu, setShowMenu] = React.useState(false)
  
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setPosition({
      x: position.x + info.offset.x,
      y: position.y + info.offset.y,
    })
  }
  
  const handleBubbleClick = () => {
    setShowMenu(!showMenu)
  }
  
  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Constraints container */}
          <div
            ref={constraintsRef}
            className="fixed inset-4 z-40 pointer-events-none"
          />
          
          {/* Floating bubble */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            drag
            dragMomentum={false}
            dragConstraints={constraintsRef}
            onDragEnd={handleDragEnd}
            style={{ x: position.x, y: position.y }}
            className={cn(
              'fixed z-50 cursor-grab active:cursor-grabbing',
              isRTL ? 'left-4 bottom-24' : 'right-4 bottom-24'
            )}
          >
            {/* Main bubble */}
            <motion.button
              onClick={handleBubbleClick}
              className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent shadow-lg flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Pulsing ring animation */}
              <motion.div
                className="absolute inset-0 rounded-full bg-primary"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              
              {/* Game icon */}
              <span className="text-2xl relative z-10">{gameIcon}</span>
              
              {/* Game indicator dot */}
              <div className="absolute top-0 end-0 w-4 h-4 rounded-full bg-green-500 border-2 border-background flex items-center justify-center">
                <Gamepad2 className="w-2.5 h-2.5 text-white" />
              </div>
            </motion.button>
            
            {/* Popup menu */}
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 10 }}
                  className={cn(
                    'absolute bottom-full mb-2 bg-card rounded-2xl shadow-xl border border-border overflow-hidden',
                    isRTL ? 'right-0' : 'left-0'
                  )}
                >
                  {/* Game info */}
                  <div className={cn(
                    'px-4 py-3 border-b border-border',
                    isRTL ? 'font-arabic' : ''
                  )}>
                    <p className="text-sm font-medium text-foreground">
                      {isRTL ? gameNameAr : gameName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isRTL ? 'اللعبة قيد التشغيل' : 'Game in progress'}
                    </p>
                  </div>
                  
                  {/* Actions */}
                  <div className="p-2 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowMenu(false)
                        onRestore()
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                      <Maximize2 className="w-4 h-4" />
                      <span className={cn('text-sm', isRTL ? 'font-arabic' : '')}>
                        {isRTL ? 'استعادة' : 'Restore'}
                      </span>
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowMenu(false)
                        onClose()
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span className={cn('text-sm', isRTL ? 'font-arabic' : '')}>
                        {isRTL ? 'إغلاق' : 'Close'}
                      </span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
