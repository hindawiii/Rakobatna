import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type ReportReason = 'spam' | 'harassment' | 'misinformation' | 'inappropriate' | 'other'
export type ReportableType = 'message' | 'post' | 'listing' | 'comment' | 'user' | 'news'

export interface Report {
  id: string
  itemId: string
  itemType: ReportableType
  reason: ReportReason
  additionalInfo?: string
  reporterId: string
  reportedAt: Date
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
}

interface ReportState {
  // Reports list
  reports: Report[]
  
  // Report submission
  submitReport: (report: Omit<Report, 'id' | 'reportedAt' | 'status'>) => void
  
  // Check if item was reported
  isReported: (itemId: string, itemType: ReportableType) => boolean
  
  // Get reports by type
  getReportsByType: (itemType: ReportableType) => Report[]
  
  // Active report sheet state
  activeReportSheet: {
    isOpen: boolean
    itemId: string | null
    itemType: ReportableType | null
  }
  openReportSheet: (itemId: string, itemType: ReportableType) => void
  closeReportSheet: () => void
}

export const useReportStore = create<ReportState>()(
  persist(
    (set, get) => ({
      reports: [],
      
      submitReport: (reportData) => {
        const report: Report = {
          ...reportData,
          id: `report-${Date.now()}`,
          reportedAt: new Date(),
          status: 'pending',
        }
        
        set((state) => ({
          reports: [...state.reports, report],
          activeReportSheet: {
            isOpen: false,
            itemId: null,
            itemType: null,
          },
        }))
      },
      
      isReported: (itemId, itemType) => {
        const { reports } = get()
        return reports.some(
          (r) => r.itemId === itemId && r.itemType === itemType
        )
      },
      
      getReportsByType: (itemType) => {
        const { reports } = get()
        return reports.filter((r) => r.itemType === itemType)
      },
      
      activeReportSheet: {
        isOpen: false,
        itemId: null,
        itemType: null,
      },
      
      openReportSheet: (itemId, itemType) =>
        set({
          activeReportSheet: {
            isOpen: true,
            itemId,
            itemType,
          },
        }),
      
      closeReportSheet: () =>
        set({
          activeReportSheet: {
            isOpen: false,
            itemId: null,
            itemType: null,
          },
        }),
    }),
    {
      name: 'rakobatna-report-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        reports: state.reports,
      }),
    }
  )
)
