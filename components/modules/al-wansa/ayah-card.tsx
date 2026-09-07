'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, Share2, Volume2, VolumeX, Copy, Check } from 'lucide-react'
import { useAudioPlayerStore } from '@/lib/stores/audio-player-store'
import { useLanguage } from '@/components/providers/language-provider'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function AyahOfTheDayCard() {
  const { ayahOfTheDay, setTrack, playlist } = useAudioPlayerStore()
  const { isRTL } = useLanguage()
  const [isFlipped, setIsFlipped] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  
  if (!ayahOfTheDay) return null
  
  const handleCopy = async () => {
    const text = `${ayahOfTheDay.arabicText}\n\n"${ayahOfTheDay.translation}"\n\n- ${ayahOfTheDay.surahName} (${ayahOfTheDay.surahNumber}:${ayahOfTheDay.ayahNumber})`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success(isRTL ? 'تم النسخ' : 'Copied!')
  }
  
  const handleShare = () => {
    const text = isRTL
      ? `آية اليوم من راكوبتنا:\n${ayahOfTheDay.arabicText}\n- سورة ${ayahOfTheDay.surahNameAr}`
      : `Ayah of the Day from Rakobatna:\n${ayahOfTheDay.arabicText}\n- Surah ${ayahOfTheDay.surahName}`
    
    if (navigator.share) {
      navigator.share({ text })
    } else {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
      window.open(whatsappUrl, '_blank')
    }
  }
  
  const handlePlaySurah = () => {
    const track = playlist.find(t => t.surahNumber === ayahOfTheDay.surahNumber)
    if (track) {
      setTrack(track)
      toast.success(
        isRTL ? `جاري تشغيل سورة ${track.surahNameAr}` : `Now playing Surah ${track.surahName}`
      )
    }
  }
  
  return (
    <div className="perspective-1000">
      <motion.div
        className="relative w-full h-48 cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 150 }}
      >
        {/* Front - Arabic Ayah */}
        <div
          className={cn(
            'absolute inset-0 rounded-2xl p-5 flex flex-col justify-between',
            'bg-gradient-to-br from-primary/20 via-primary/10 to-accent/10',
            'border border-primary/20 shadow-lg',
            isFlipped ? 'invisible' : 'visible'
          )}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex items-center justify-between">
            <span className={cn(
              'text-xs font-medium text-muted-foreground',
              isRTL ? 'font-arabic' : ''
            )}>
              {isRTL ? 'آية اليوم' : 'Ayah of the Day'}
            </span>
            <span className={cn(
              'text-xs text-muted-foreground px-2 py-1 rounded-full bg-primary/10',
              isRTL ? 'font-arabic' : ''
            )}>
              {isRTL
                ? `${ayahOfTheDay.surahNameAr} (${ayahOfTheDay.ayahNumber})`
                : `${ayahOfTheDay.surahName} (${ayahOfTheDay.ayahNumber})`
              }
            </span>
          </div>
          
          <p className="text-xl leading-loose text-foreground font-arabic text-center px-2">
            {ayahOfTheDay.arabicText}
          </p>
          
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <RotateCcw className="w-3 h-3" />
            <span className={isRTL ? 'font-arabic' : ''}>
              {isRTL ? 'اضغط للترجمة' : 'Tap to flip'}
            </span>
          </div>
        </div>
        
        {/* Back - Translation */}
        <div
          className={cn(
            'absolute inset-0 rounded-2xl p-5 flex flex-col justify-between',
            'bg-gradient-to-br from-accent/20 via-accent/10 to-primary/10',
            'border border-accent/20 shadow-lg',
            !isFlipped ? 'invisible' : 'visible'
          )}
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="flex items-center justify-between">
            <span className={cn(
              'text-xs font-medium text-muted-foreground',
              isRTL ? 'font-arabic' : ''
            )}>
              {isRTL ? 'الترجمة' : 'Translation'}
            </span>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full"
                onClick={(e) => {
                  e.stopPropagation()
                  handleCopy()
                }}
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-primary" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full"
                onClick={(e) => {
                  e.stopPropagation()
                  handleShare()
                }}
              >
                <Share2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
          
          <p className="text-base leading-relaxed text-foreground text-center px-2">
            &ldquo;{ayahOfTheDay.translation}&rdquo;
          </p>
          
          <Button
            variant="outline"
            size="sm"
            className="mx-auto gap-2"
            onClick={(e) => {
              e.stopPropagation()
              handlePlaySurah()
            }}
          >
            <Volume2 className="w-4 h-4" />
            <span className={isRTL ? 'font-arabic' : ''}>
              {isRTL ? 'استمع للسورة' : 'Listen to Surah'}
            </span>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export function HadithCard() {
  const { dailyHadith } = useAudioPlayerStore()
  const { isRTL } = useLanguage()
  const [isFlipped, setIsFlipped] = React.useState(false)
  
  if (!dailyHadith) return null
  
  return (
    <div className="perspective-1000">
      <motion.div
        className="relative w-full h-44 cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 150 }}
      >
        {/* Front - Arabic Hadith */}
        <div
          className={cn(
            'absolute inset-0 rounded-2xl p-5 flex flex-col justify-between',
            'bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-orange-500/10',
            'border border-amber-500/20 shadow-lg',
            isFlipped ? 'invisible' : 'visible'
          )}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex items-center justify-between">
            <span className={cn(
              'text-xs font-medium text-muted-foreground',
              isRTL ? 'font-arabic' : ''
            )}>
              {isRTL ? 'حديث اليوم' : 'Hadith of the Day'}
            </span>
            <span className={cn(
              'text-xs text-muted-foreground px-2 py-1 rounded-full bg-amber-500/10',
              isRTL ? 'font-arabic' : ''
            )}>
              {isRTL ? dailyHadith.sourceAr : dailyHadith.source}
            </span>
          </div>
          
          <p className="text-base leading-loose text-foreground font-arabic text-center px-2 line-clamp-3">
            {dailyHadith.arabicText}
          </p>
          
          <div className="flex items-center justify-between">
            <span className={cn(
              'text-xs text-muted-foreground',
              isRTL ? 'font-arabic' : ''
            )}>
              {isRTL ? dailyHadith.narratorAr : dailyHadith.narrator}
            </span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <RotateCcw className="w-3 h-3" />
              <span className={isRTL ? 'font-arabic' : ''}>
                {isRTL ? 'للترجمة' : 'Flip'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Back - Translation */}
        <div
          className={cn(
            'absolute inset-0 rounded-2xl p-5 flex flex-col justify-between',
            'bg-gradient-to-br from-orange-500/20 via-orange-500/10 to-amber-500/10',
            'border border-orange-500/20 shadow-lg',
            !isFlipped ? 'invisible' : 'visible'
          )}
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="flex items-center justify-between">
            <span className={cn(
              'text-xs font-medium text-muted-foreground',
              isRTL ? 'font-arabic' : ''
            )}>
              {isRTL ? 'الترجمة' : 'Translation'}
            </span>
          </div>
          
          <p className="text-sm leading-relaxed text-foreground text-center px-2">
            &ldquo;{dailyHadith.translation}&rdquo;
          </p>
          
          <span className={cn(
            'text-xs text-muted-foreground text-center',
            isRTL ? 'font-arabic' : ''
          )}>
            {isRTL ? dailyHadith.narratorAr : dailyHadith.narrator}
          </span>
        </div>
      </motion.div>
    </div>
  )
}

export function DhikrCounter() {
  const { dhikrCount, dhikrTarget, incrementDhikr, resetDhikr, setDhikrTarget } = useAudioPlayerStore()
  const { isRTL } = useLanguage()
  const [isAnimating, setIsAnimating] = React.useState(false)
  
  const progress = (dhikrCount / dhikrTarget) * 100
  const isComplete = dhikrCount >= dhikrTarget
  
  const handleTap = () => {
    if (isComplete) return
    setIsAnimating(true)
    incrementDhikr()
    setTimeout(() => setIsAnimating(false), 200)
    
    // Vibrate on mobile
    if (navigator.vibrate) {
      navigator.vibrate(10)
    }
  }
  
  const targets = [33, 99, 100]
  
  return (
    <div className="space-y-4">
      {/* Target selector */}
      <div className="flex items-center justify-center gap-2">
        {targets.map((t) => (
          <button
            key={t}
            onClick={() => {
              setDhikrTarget(t)
              resetDhikr()
            }}
            className={cn(
              'px-3 py-1 rounded-full text-sm transition-colors',
              dhikrTarget === t
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {t}
          </button>
        ))}
      </div>
      
      {/* Counter */}
      <motion.button
        onClick={handleTap}
        disabled={isComplete}
        className={cn(
          'relative mx-auto w-40 h-40 rounded-full flex items-center justify-center',
          'bg-gradient-to-br from-primary/20 to-accent/20',
          'border-4 border-primary/30',
          'shadow-lg transition-all',
          isComplete && 'border-green-500/50 from-green-500/20 to-green-500/10'
        )}
        animate={isAnimating ? { scale: 0.95 } : { scale: 1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Progress ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-primary/20"
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            className={isComplete ? 'text-green-500' : 'text-primary'}
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
          />
        </svg>
        
        <div className="text-center z-10">
          <motion.span
            className="block text-4xl font-bold text-foreground"
            key={dhikrCount}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {dhikrCount}
          </motion.span>
          <span className="text-sm text-muted-foreground">/ {dhikrTarget}</span>
        </div>
      </motion.button>
      
      {/* Reset button */}
      {dhikrCount > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={resetDhikr}
          className="mx-auto flex gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span className={isRTL ? 'font-arabic' : ''}>
            {isRTL ? 'إعادة' : 'Reset'}
          </span>
        </Button>
      )}
      
      {isComplete && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'text-center text-sm text-green-600 font-medium',
            isRTL ? 'font-arabic' : ''
          )}
        >
          {isRTL ? 'تقبل الله' : 'May Allah accept it'}
        </motion.p>
      )}
    </div>
  )
}
