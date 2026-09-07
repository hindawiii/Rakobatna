'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, RotateCcw, Minimize2, Trophy, HelpCircle, Check, Lightbulb } from 'lucide-react'
import { useLanguage } from '@/components/providers/language-provider'
import { useAppStore } from '@/lib/stores/app-store'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface ProverbsCrosswordProps {
  onClose: () => void
  onMinimize?: () => void
}

interface Proverb {
  id: string
  arabic: string
  translation: string
  hint: string
  hintAr: string
  answer: string // The word to fill in (Arabic)
  answerIndex: number // Position in the proverb where answer goes
}

const PROVERBS: Proverb[] = [
  {
    id: 'p1',
    arabic: 'اللي ما عندو ___ يأكل بيدو',
    translation: 'He who has no spoon eats with his hand',
    hint: 'A utensil for eating',
    hintAr: 'أداة للأكل',
    answer: 'ملعقة',
    answerIndex: 3,
  },
  {
    id: 'p2',
    arabic: 'الـ___ السامع خير من النار',
    translation: 'The listening neighbor is better than fire',
    hint: 'Someone who lives nearby',
    hintAr: 'شخص يسكن قريب منك',
    answer: 'جار',
    answerIndex: 1,
  },
  {
    id: 'p3',
    arabic: 'القرد في عين ___ غزال',
    translation: 'A monkey in his mother\'s eye is a gazelle',
    hint: 'Female parent',
    hintAr: 'الوالدة',
    answer: 'أمو',
    answerIndex: 3,
  },
  {
    id: 'p4',
    arabic: 'الـ___ بتجيب الناس',
    translation: 'Coffee brings people together',
    hint: 'Traditional Sudanese drink',
    hintAr: 'مشروب سوداني تقليدي',
    answer: 'جبنة',
    answerIndex: 1,
  },
  {
    id: 'p5',
    arabic: 'ما تحمل هم ___ بكرة',
    translation: 'Don\'t worry about tomorrow\'s burden',
    hint: 'The day after today',
    hintAr: 'اليوم اللي بعد اليوم',
    answer: 'يوم',
    answerIndex: 3,
  },
]

export function ProverbsCrossword({ onClose, onMinimize }: ProverbsCrosswordProps) {
  const { isRTL } = useLanguage()
  const { minimizeGame } = useAppStore()
  
  const [currentProverbIndex, setCurrentProverbIndex] = React.useState(0)
  const [userInput, setUserInput] = React.useState('')
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null)
  const [showHint, setShowHint] = React.useState(false)
  const [score, setScore] = React.useState(0)
  const [hintsUsed, setHintsUsed] = React.useState(0)
  const [completed, setCompleted] = React.useState<string[]>([])
  
  const currentProverb = PROVERBS[currentProverbIndex]
  
  const handleSubmit = () => {
    if (!userInput.trim()) return
    
    const isMatch = userInput.trim() === currentProverb.answer
    setIsCorrect(isMatch)
    
    if (isMatch) {
      const pointsEarned = showHint ? 5 : 10
      setScore(prev => prev + pointsEarned)
      setCompleted(prev => [...prev, currentProverb.id])
      
      toast.success(
        isRTL ? 'صحيح!' : 'Correct!',
        { description: isRTL ? `+${pointsEarned} نقطة` : `+${pointsEarned} points` }
      )
      
      // Move to next after delay
      setTimeout(() => {
        if (currentProverbIndex < PROVERBS.length - 1) {
          setCurrentProverbIndex(prev => prev + 1)
          setUserInput('')
          setIsCorrect(null)
          setShowHint(false)
        }
      }, 1500)
    } else {
      toast.error(isRTL ? 'حاول مرة أخرى' : 'Try again')
    }
  }
  
  const handleHint = () => {
    if (!showHint) {
      setShowHint(true)
      setHintsUsed(prev => prev + 1)
    }
  }
  
  const handleSkip = () => {
    if (currentProverbIndex < PROVERBS.length - 1) {
      setCurrentProverbIndex(prev => prev + 1)
      setUserInput('')
      setIsCorrect(null)
      setShowHint(false)
    }
  }
  
  const handleReset = () => {
    setCurrentProverbIndex(0)
    setUserInput('')
    setIsCorrect(null)
    setShowHint(false)
    setScore(0)
    setHintsUsed(0)
    setCompleted([])
  }
  
  const handleMinimize = () => {
    minimizeGame({
      id: 'crossword',
      name: 'Proverbs Crossword',
      nameAr: 'كلمات الأمثال',
      icon: '📝',
      state: { currentProverbIndex, score, completed }
    })
    onMinimize?.()
  }
  
  const isGameComplete = completed.length === PROVERBS.length
  
  // Handle keyboard input for Arabic
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value)
    setIsCorrect(null)
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 bg-background flex flex-col"
    >
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
        
        <h2 className={cn('text-lg font-bold', isRTL ? 'font-arabic' : '')}>
          {isRTL ? 'كلمات الأمثال' : 'Sudanese Proverbs'}
        </h2>
        
        <Button variant="ghost" size="icon" onClick={handleMinimize}>
          <Minimize2 className="w-5 h-5" />
        </Button>
      </header>
      
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-6">
        {/* Progress and Score */}
        <div className="flex items-center gap-4 w-full max-w-md justify-between">
          <div className={cn('text-sm text-muted-foreground', isRTL ? 'font-arabic' : '')}>
            {currentProverbIndex + 1} / {PROVERBS.length}
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="font-bold">{score}</span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full max-w-md h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${(completed.length / PROVERBS.length) * 100}%` }}
          />
        </div>
        
        {isGameComplete ? (
          // Completion screen
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Trophy className="w-10 h-10 text-amber-500" />
            </div>
            <h3 className={cn('text-2xl font-bold', isRTL ? 'font-arabic' : '')}>
              {isRTL ? 'مبروك!' : 'Congratulations!'}
            </h3>
            <p className={cn('text-muted-foreground', isRTL ? 'font-arabic' : '')}>
              {isRTL
                ? `سجلت ${score} نقطة مع ${hintsUsed} تلميح`
                : `You scored ${score} points with ${hintsUsed} hints`
              }
            </p>
            <Button onClick={handleReset} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              {isRTL ? 'العب مرة أخرى' : 'Play Again'}
            </Button>
          </motion.div>
        ) : (
          <>
            {/* Proverb display */}
            <div className="w-full max-w-md space-y-4">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                <p className="text-xl font-arabic text-center leading-relaxed text-foreground">
                  {currentProverb.arabic.split('___').map((part, i) => (
                    <React.Fragment key={i}>
                      {part}
                      {i < currentProverb.arabic.split('___').length - 1 && (
                        <span className="inline-block mx-2 px-4 py-1 border-b-2 border-primary min-w-[60px]">
                          {isCorrect && userInput}
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </p>
              </div>
              
              {/* Translation */}
              <p className="text-sm text-muted-foreground text-center">
                {currentProverb.translation}
              </p>
              
              {/* Hint */}
              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20"
                  >
                    <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <p className={cn('text-sm', isRTL ? 'font-arabic' : '')}>
                      {isRTL ? currentProverb.hintAr : currentProverb.hint}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Input */}
            <div className="w-full max-w-md space-y-3">
              <input
                type="text"
                value={userInput}
                onChange={handleInputChange}
                placeholder={isRTL ? 'اكتب الكلمة الناقصة...' : 'Type the missing word...'}
                className={cn(
                  'w-full h-14 px-4 text-xl text-center rounded-xl',
                  'bg-muted border-2 transition-colors',
                  'font-arabic',
                  isCorrect === true && 'border-green-500 bg-green-500/10',
                  isCorrect === false && 'border-red-500 bg-red-500/10',
                  isCorrect === null && 'border-border focus:border-primary'
                )}
                dir="rtl"
                disabled={isCorrect === true}
              />
              
              <div className="flex gap-2">
                <Button
                  onClick={handleSubmit}
                  disabled={!userInput.trim() || isCorrect === true}
                  className="flex-1 gap-2"
                >
                  <Check className="w-4 h-4" />
                  {isRTL ? 'تأكيد' : 'Check'}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleHint}
                  disabled={showHint}
                  className="gap-2"
                >
                  <HelpCircle className="w-4 h-4" />
                  {isRTL ? 'تلميح' : 'Hint'}
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                >
                  {isRTL ? 'تخطي' : 'Skip'}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}
