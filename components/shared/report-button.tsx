'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flag, AlertTriangle, MessageSquareWarning, Ban, HelpCircle, X, CheckCircle2 } from 'lucide-react'
import { useReportStore, type ReportReason, type ReportableType } from '@/lib/stores/report-store'
import { useUserStore } from '@/lib/stores/user-store'
import { useLanguage } from '@/components/providers/language-provider'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface ReportButtonProps {
  itemId: string
  itemType: ReportableType
  className?: string
  variant?: 'icon' | 'menu-item' | 'text'
  size?: 'sm' | 'md' | 'lg'
}

interface ReportOption {
  reason: ReportReason
  icon: React.ReactNode
  label: string
  labelAr: string
  description: string
  descriptionAr: string
}

const reportOptions: ReportOption[] = [
  {
    reason: 'spam',
    icon: <Ban className="w-5 h-5" />,
    label: 'Spam',
    labelAr: 'سبام / إعلان مزعج',
    description: 'Unwanted advertising or repetitive content',
    descriptionAr: 'إعلانات غير مرغوبة أو محتوى متكرر',
  },
  {
    reason: 'harassment',
    icon: <MessageSquareWarning className="w-5 h-5" />,
    label: 'Harassment',
    labelAr: 'تحرش / إساءة',
    description: 'Bullying, threats, or personal attacks',
    descriptionAr: 'تنمر أو تهديدات أو هجمات شخصية',
  },
  {
    reason: 'misinformation',
    icon: <AlertTriangle className="w-5 h-5" />,
    label: 'Misinformation',
    labelAr: 'معلومات مضللة',
    description: 'False or misleading information',
    descriptionAr: 'معلومات كاذبة أو مضللة',
  },
  {
    reason: 'inappropriate',
    icon: <Flag className="w-5 h-5" />,
    label: 'Inappropriate',
    labelAr: 'محتوى غير لائق',
    description: 'Adult content, violence, or offensive material',
    descriptionAr: 'محتوى للبالغين أو عنف أو مواد مسيئة',
  },
  {
    reason: 'other',
    icon: <HelpCircle className="w-5 h-5" />,
    label: 'Other',
    labelAr: 'سبب آخر',
    description: 'Something else not listed above',
    descriptionAr: 'شيء آخر غير مذكور أعلاه',
  },
]

export function ReportButton({
  itemId,
  itemType,
  className,
  variant = 'icon',
  size = 'md',
}: ReportButtonProps) {
  const { openReportSheet, isReported } = useReportStore()
  const { t, isRTL } = useLanguage()
  
  const alreadyReported = isReported(itemId, itemType)
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!alreadyReported) {
      openReportSheet(itemId, itemType)
    }
  }
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }
  
  if (variant === 'menu-item') {
    return (
      <button
        onClick={handleClick}
        disabled={alreadyReported}
        className={cn(
          'flex items-center gap-3 w-full px-4 py-3 text-start transition-colors',
          alreadyReported
            ? 'text-muted-foreground cursor-not-allowed'
            : 'text-destructive hover:bg-destructive/10',
          className
        )}
      >
        <Flag className={sizeClasses[size]} />
        <span className={isRTL ? 'font-arabic' : ''}>
          {alreadyReported
            ? (isRTL ? 'تم الإبلاغ' : 'Reported')
            : (isRTL ? 'إبلاغ' : 'Report')
          }
        </span>
      </button>
    )
  }
  
  if (variant === 'text') {
    return (
      <button
        onClick={handleClick}
        disabled={alreadyReported}
        className={cn(
          'flex items-center gap-2 text-sm transition-colors',
          alreadyReported
            ? 'text-muted-foreground cursor-not-allowed'
            : 'text-destructive hover:text-destructive/80',
          isRTL ? 'font-arabic' : '',
          className
        )}
      >
        <Flag className={sizeClasses[size]} />
        <span>
          {alreadyReported
            ? (isRTL ? 'تم الإبلاغ' : 'Reported')
            : (isRTL ? 'إبلاغ' : 'Report')
          }
        </span>
      </button>
    )
  }
  
  // Icon variant (default)
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={alreadyReported}
      className={cn(
        'transition-colors',
        alreadyReported
          ? 'text-muted-foreground'
          : 'text-muted-foreground hover:text-destructive hover:bg-destructive/10',
        className
      )}
    >
      <Flag className={sizeClasses[size]} />
      <span className="sr-only">{isRTL ? 'إبلاغ' : 'Report'}</span>
    </Button>
  )
}

export function ReportSheet() {
  const {
    activeReportSheet,
    closeReportSheet,
    submitReport,
    isReported,
  } = useReportStore()
  const { currentUser } = useUserStore()
  const { isRTL } = useLanguage()
  
  const [selectedReason, setSelectedReason] = React.useState<ReportReason | null>(null)
  const [additionalInfo, setAdditionalInfo] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [showSuccess, setShowSuccess] = React.useState(false)
  
  const { isOpen, itemId, itemType } = activeReportSheet
  
  const handleSubmit = async () => {
    if (!selectedReason || !itemId || !itemType || !currentUser) return
    
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))
    
    submitReport({
      itemId,
      itemType,
      reason: selectedReason,
      additionalInfo: additionalInfo.trim() || undefined,
      reporterId: currentUser.id,
    })
    
    setIsSubmitting(false)
    setShowSuccess(true)
    
    // Reset and close after showing success
    setTimeout(() => {
      setShowSuccess(false)
      setSelectedReason(null)
      setAdditionalInfo('')
      closeReportSheet()
      
      toast.success(
        isRTL ? 'تم إرسال البلاغ بنجاح' : 'Report submitted successfully',
        {
          description: isRTL
            ? 'سنراجع البلاغ في أقرب وقت'
            : 'We will review your report shortly',
        }
      )
    }, 1500)
  }
  
  const handleClose = () => {
    if (!isSubmitting && !showSuccess) {
      setSelectedReason(null)
      setAdditionalInfo('')
      closeReportSheet()
    }
  }
  
  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent
        side="bottom"
        className={cn(
          'rounded-t-3xl max-h-[85vh] overflow-hidden',
          isRTL ? 'font-arabic' : ''
        )}
      >
        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4"
              >
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </motion.div>
              <h3 className="text-xl font-semibold text-foreground">
                {isRTL ? 'شكراً لك!' : 'Thank You!'}
              </h3>
              <p className="text-muted-foreground mt-2 text-center">
                {isRTL
                  ? 'تم استلام بلاغك وسنراجعه قريباً'
                  : 'Your report has been received and will be reviewed soon'
                }
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SheetHeader className="pb-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-lg">
                    {isRTL ? 'إبلاغ عن محتوى' : 'Report Content'}
                  </SheetTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClose}
                    className="rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {isRTL
                    ? 'لماذا تريد الإبلاغ عن هذا المحتوى؟'
                    : 'Why are you reporting this content?'
                  }
                </p>
              </SheetHeader>
              
              <div className="py-4 space-y-2 max-h-[50vh] overflow-y-auto">
                {reportOptions.map((option) => (
                  <motion.button
                    key={option.reason}
                    onClick={() => setSelectedReason(option.reason)}
                    className={cn(
                      'w-full flex items-start gap-4 p-4 rounded-xl transition-all text-start',
                      selectedReason === option.reason
                        ? 'bg-primary/10 ring-2 ring-primary'
                        : 'bg-muted/50 hover:bg-muted'
                    )}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      className={cn(
                        'p-2 rounded-lg',
                        selectedReason === option.reason
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-background text-muted-foreground'
                      )}
                    >
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">
                        {isRTL ? option.labelAr : option.label}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {isRTL ? option.descriptionAr : option.description}
                      </p>
                    </div>
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                        selectedReason === option.reason
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground/30'
                      )}
                    >
                      {selectedReason === option.reason && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 rounded-full bg-primary-foreground"
                        />
                      )}
                    </div>
                  </motion.button>
                ))}
                
                {/* Additional info textarea - show when reason is selected */}
                <AnimatePresence>
                  {selectedReason && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4">
                        <label className="text-sm font-medium text-foreground block mb-2">
                          {isRTL ? 'تفاصيل إضافية (اختياري)' : 'Additional details (optional)'}
                        </label>
                        <Textarea
                          value={additionalInfo}
                          onChange={(e) => setAdditionalInfo(e.target.value)}
                          placeholder={
                            isRTL
                              ? 'أضف أي تفاصيل إضافية قد تساعدنا...'
                              : 'Add any additional details that might help us...'
                          }
                          className="min-h-[80px] resize-none"
                          dir={isRTL ? 'rtl' : 'ltr'}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="pt-4 border-t border-border">
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedReason || isSubmitting}
                  className="w-full h-12 text-base font-medium"
                >
                  {isSubmitting ? (
                    <motion.div
                      className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  ) : (
                    isRTL ? 'إرسال البلاغ' : 'Submit Report'
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
