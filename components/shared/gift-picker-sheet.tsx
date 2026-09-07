'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gift, X, Sparkles, Lock, ChevronRight } from 'lucide-react'
import {
  RAKOBA_GIFTS,
  type GiftCategory,
  type RakobaGift,
  getCategoryLabel,
  getGiftsByCategory,
  getRarityColor,
  getRarityBgColor,
} from '@/lib/data/rakoba-gifts'
import { useLanguage } from '@/components/providers/language-provider'
import { useUserStore } from '@/lib/stores/user-store'
import { useAppStore } from '@/lib/stores/app-store'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface GiftPickerSheetProps {
  isOpen: boolean
  onClose: () => void
  onGiftSelect: (gift: RakobaGift) => void
  recipientName?: string
  recipientNameAr?: string
}

const categories: GiftCategory[] = [
  'heritage',
  'animated',
  'flowers',
  'luxury',
  'animals',
  'ranks',
  'food',
  'celebration',
]

export function GiftPickerSheet({
  isOpen,
  onClose,
  onGiftSelect,
  recipientName,
  recipientNameAr,
}: GiftPickerSheetProps) {
  const { isRTL } = useLanguage()
  const { currentUser, addZoolPoints } = useUserStore()
  const { triggerGift } = useAppStore()
  
  const [selectedCategory, setSelectedCategory] = React.useState<GiftCategory>('heritage')
  const [selectedGift, setSelectedGift] = React.useState<RakobaGift | null>(null)
  const [isSending, setIsSending] = React.useState(false)
  
  const userPoints = currentUser?.zoolPoints ?? 0
  const categoryGifts = getGiftsByCategory(selectedCategory)
  
  const handleGiftSelect = (gift: RakobaGift) => {
    setSelectedGift(gift)
  }
  
  const handleSendGift = async () => {
    if (!selectedGift || !currentUser) return
    
    // Check if user has enough points
    if (userPoints < selectedGift.price) {
      toast.error(
        isRTL ? 'نقاط زول غير كافية!' : 'Not enough Zool Points!',
        {
          description: isRTL
            ? `تحتاج ${selectedGift.price} نقطة زول`
            : `You need ${selectedGift.price} Zool Points`,
        }
      )
      return
    }
    
    setIsSending(true)
    
    // Simulate sending gift
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    // Deduct points
    addZoolPoints(-selectedGift.price)
    
    // Trigger gift animation
    triggerGift(
      selectedGift.id as any,
      isRTL ? recipientNameAr || recipientName || 'صديقك' : recipientName || 'your friend'
    )
    
    // Notify parent
    onGiftSelect(selectedGift)
    
    setIsSending(false)
    setSelectedGift(null)
    onClose()
    
    toast.success(
      isRTL ? 'تم إرسال الهدية!' : 'Gift sent!',
      {
        description: isRTL
          ? `أرسلت ${selectedGift.nameAr} إلى ${recipientNameAr || recipientName || 'صديقك'}`
          : `You sent ${selectedGift.name} to ${recipientName || 'your friend'}`,
      }
    )
  }
  
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="h-[85vh] rounded-t-3xl flex flex-col p-0"
      >
        <SheetHeader className="px-6 pt-4 pb-2">
          <div className="flex items-center justify-between">
            <SheetTitle className={cn('text-lg', isRTL ? 'font-arabic' : '')}>
              {isRTL ? 'أرسل هدية' : 'Send a Gift'}
            </SheetTitle>
            <div className="flex items-center gap-2">
              {/* Zool Points balance */}
              <div className="flex items-center gap-1.5 bg-accent/10 text-accent px-3 py-1.5 rounded-full">
                <Sparkles className="w-4 h-4" />
                <span className="font-semibold text-sm">{userPoints}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
          {recipientName && (
            <p className={cn('text-sm text-muted-foreground', isRTL ? 'font-arabic' : '')}>
              {isRTL ? `إلى ${recipientNameAr || recipientName}` : `To ${recipientName}`}
            </p>
          )}
        </SheetHeader>
        
        {/* Category tabs */}
        <div className="px-4 py-2 border-b border-border">
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                    selectedCategory === cat
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80',
                    isRTL ? 'font-arabic' : ''
                  )}
                >
                  {getCategoryLabel(cat, isRTL)}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
        
        {/* Gifts grid */}
        <ScrollArea className="flex-1 px-4 py-4">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {categoryGifts.map((gift) => {
              const canAfford = userPoints >= gift.price
              const isSelected = selectedGift?.id === gift.id
              
              return (
                <motion.button
                  key={gift.id}
                  onClick={() => canAfford && handleGiftSelect(gift)}
                  disabled={!canAfford}
                  className={cn(
                    'relative flex flex-col items-center p-3 rounded-2xl transition-all',
                    getRarityBgColor(gift.rarity),
                    isSelected
                      ? 'ring-2 ring-primary ring-offset-2'
                      : canAfford
                        ? 'hover:scale-105'
                        : 'opacity-50 cursor-not-allowed'
                  )}
                  whileTap={canAfford ? { scale: 0.95 } : undefined}
                >
                  {/* Lock icon for unaffordable */}
                  {!canAfford && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-2xl">
                      <Lock className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  
                  {/* Gift emoji */}
                  <span className="text-3xl mb-1">{gift.emoji}</span>
                  
                  {/* Gift name */}
                  <span className={cn(
                    'text-xs font-medium text-center line-clamp-1',
                    isRTL ? 'font-arabic' : ''
                  )}>
                    {isRTL ? gift.nameAr : gift.name}
                  </span>
                  
                  {/* Price */}
                  <div className={cn(
                    'flex items-center gap-1 mt-1 text-xs',
                    getRarityColor(gift.rarity)
                  )}>
                    <Sparkles className="w-3 h-3" />
                    <span>{gift.price}</span>
                  </div>
                  
                  {/* Animated badge */}
                  {gift.isAnimated && (
                    <div className="absolute top-1 end-1 w-2 h-2 rounded-full bg-primary animate-pulse" />
                  )}
                </motion.button>
              )
            })}
          </div>
        </ScrollArea>
        
        {/* Selected gift preview & send button */}
        <AnimatePresence>
          {selectedGift && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="border-t border-border p-4 bg-card"
            >
              <div className="flex items-center gap-4">
                {/* Gift preview */}
                <div className={cn(
                  'flex items-center gap-3 flex-1 p-3 rounded-xl',
                  getRarityBgColor(selectedGift.rarity)
                )}>
                  <span className="text-4xl">{selectedGift.emoji}</span>
                  <div className={cn('flex-1', isRTL ? 'font-arabic' : '')}>
                    <p className="font-medium">
                      {isRTL ? selectedGift.nameAr : selectedGift.name}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {isRTL ? selectedGift.descriptionAr : selectedGift.description}
                    </p>
                  </div>
                  <div className={cn(
                    'flex items-center gap-1 font-semibold',
                    getRarityColor(selectedGift.rarity)
                  )}>
                    <Sparkles className="w-4 h-4" />
                    <span>{selectedGift.price}</span>
                  </div>
                </div>
                
                {/* Send button */}
                <Button
                  onClick={handleSendGift}
                  disabled={isSending || userPoints < selectedGift.price}
                  className="h-14 px-6 rounded-xl"
                >
                  {isSending ? (
                    <motion.div
                      className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  ) : (
                    <>
                      <Gift className="w-5 h-5 me-2" />
                      {isRTL ? 'أرسل' : 'Send'}
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  )
}
