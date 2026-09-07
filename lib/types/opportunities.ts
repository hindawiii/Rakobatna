export type OpportunityCategory = 
  | 'job'           // وظيفة
  | 'scholarship'   // منحة دراسية
  | 'training'      // تدريب
  | 'volunteer'     // تطوع
  | 'internship'    // تدريب عملي
  | 'competition'   // مسابقة
  | 'grant'         // منحة مالية
  | 'fellowship'    // زمالة

export type ApplicationType = 'in-app' | 'external'

export type OpportunityStatus = 'open' | 'closing-soon' | 'closed' | 'featured'

export interface Opportunity {
  id: string
  title: string
  titleAr: string
  organization: string
  organizationAr: string
  organizationLogo?: string
  category: OpportunityCategory
  description: string
  descriptionAr: string
  
  // Location
  location: string
  locationAr: string
  isRemote: boolean
  
  // Dates
  deadline: Date
  startDate?: Date
  postedAt: Date
  
  // Application
  applicationType: ApplicationType
  applicationUrl?: string // for external applications
  
  // Verification
  isVerified: boolean
  sourceUrl?: string
  sourceName?: string
  sourceNameAr?: string
  
  // Visuals
  coverImage?: string
  isFeatured: boolean
  
  // Requirements
  requirements?: string[]
  requirementsAr?: string[]
  
  // Benefits
  benefits?: string[]
  benefitsAr?: string[]
  
  // Stats
  applicants?: number
  views: number
}

// Demo opportunities data
export const DEMO_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'Software Engineer - Remote',
    titleAr: 'مهندس برمجيات - عن بعد',
    organization: 'TechSudan',
    organizationAr: 'تك سودان',
    organizationLogo: '/logos/techsudan.png',
    category: 'job',
    description: 'Join our growing team of engineers building the future of Sudanese tech.',
    descriptionAr: 'انضم إلى فريقنا المتنامي من المهندسين الذين يبنون مستقبل التكنولوجيا السودانية.',
    location: 'Khartoum',
    locationAr: 'الخرطوم',
    isRemote: true,
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14), // 2 weeks
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    applicationType: 'in-app',
    isVerified: true,
    sourceUrl: 'https://techsudan.com/careers',
    sourceName: 'TechSudan Careers',
    sourceNameAr: 'وظائف تك سودان',
    isFeatured: true,
    requirements: ['3+ years experience', 'React/Next.js', 'Node.js'],
    requirementsAr: ['خبرة 3 سنوات أو أكثر', 'React/Next.js', 'Node.js'],
    benefits: ['Competitive salary', 'Remote work', 'Health insurance'],
    benefitsAr: ['راتب تنافسي', 'عمل عن بعد', 'تأمين صحي'],
    applicants: 45,
    views: 1234,
  },
  {
    id: 'opp-2',
    title: 'DAAD Scholarship 2026',
    titleAr: 'منحة DAAD 2026',
    organization: 'German Academic Exchange',
    organizationAr: 'الهيئة الألمانية للتبادل الأكاديمي',
    category: 'scholarship',
    description: 'Full scholarship for Master\'s and PhD programs in Germany.',
    descriptionAr: 'منحة كاملة لبرامج الماجستير والدكتوراه في ألمانيا.',
    location: 'Germany',
    locationAr: 'ألمانيا',
    isRemote: false,
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 1 month
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    applicationType: 'external',
    applicationUrl: 'https://www.daad.de/en/',
    isVerified: true,
    sourceUrl: 'https://www.daad.de/en/',
    sourceName: 'DAAD Official',
    sourceNameAr: 'الموقع الرسمي DAAD',
    isFeatured: true,
    requirements: ['Bachelor\'s degree', 'IELTS 6.5+', 'Strong academic record'],
    requirementsAr: ['درجة البكالوريوس', 'IELTS 6.5+', 'سجل أكاديمي قوي'],
    benefits: ['Full tuition', 'Monthly stipend', 'Health insurance', 'Travel allowance'],
    benefitsAr: ['رسوم دراسية كاملة', 'راتب شهري', 'تأمين صحي', 'بدل سفر'],
    applicants: 234,
    views: 5678,
  },
  {
    id: 'opp-3',
    title: 'Youth Leadership Program',
    titleAr: 'برنامج القيادة الشبابية',
    organization: 'Sudan Youth Network',
    organizationAr: 'شبكة الشباب السوداني',
    category: 'training',
    description: 'Intensive 6-week leadership training for young Sudanese professionals.',
    descriptionAr: 'تدريب قيادي مكثف لمدة 6 أسابيع للمهنيين السودانيين الشباب.',
    location: 'Khartoum',
    locationAr: 'الخرطوم',
    isRemote: false,
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 1 week
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    applicationType: 'in-app',
    isVerified: true,
    isFeatured: true,
    requirements: ['Age 18-30', 'Sudanese national', 'Commitment to attend'],
    requirementsAr: ['العمر 18-30', 'سوداني الجنسية', 'الالتزام بالحضور'],
    benefits: ['Certificate', 'Networking', 'Mentorship'],
    benefitsAr: ['شهادة', 'بناء علاقات', 'إرشاد'],
    applicants: 89,
    views: 2345,
  },
  {
    id: 'opp-4',
    title: 'Volunteer Medical Mission',
    titleAr: 'مهمة طبية تطوعية',
    organization: 'Sudanese Doctors Union',
    organizationAr: 'اتحاد الأطباء السودانيين',
    category: 'volunteer',
    description: 'Join our medical team providing free healthcare in rural Sudan.',
    descriptionAr: 'انضم إلى فريقنا الطبي الذي يقدم رعاية صحية مجانية في ريف السودان.',
    location: 'Darfur',
    locationAr: 'دارفور',
    isRemote: false,
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21), // 3 weeks
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    applicationType: 'external',
    applicationUrl: 'https://sdu.org/volunteer',
    isVerified: true,
    isFeatured: false,
    requirements: ['Medical background', 'Available for 2 weeks', 'Physical fitness'],
    requirementsAr: ['خلفية طبية', 'متاح لمدة أسبوعين', 'لياقة بدنية'],
    applicants: 12,
    views: 567,
  },
  {
    id: 'opp-5',
    title: 'Startup Pitch Competition',
    titleAr: 'مسابقة عروض الشركات الناشئة',
    organization: 'Khartoum Innovation Hub',
    organizationAr: 'مركز الخرطوم للابتكار',
    category: 'competition',
    description: 'Win up to $10,000 in funding for your startup idea!',
    descriptionAr: 'اربح ما يصل إلى 10,000 دولار لتمويل فكرة شركتك الناشئة!',
    location: 'Khartoum',
    locationAr: 'الخرطوم',
    isRemote: true,
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10), // 10 days
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
    applicationType: 'in-app',
    isVerified: true,
    isFeatured: true,
    requirements: ['Sudanese founders', 'Early-stage startup', 'Innovative solution'],
    requirementsAr: ['مؤسسون سودانيون', 'شركة ناشئة في مرحلة مبكرة', 'حل مبتكر'],
    benefits: ['Funding up to $10k', 'Mentorship', 'Office space'],
    benefitsAr: ['تمويل حتى 10 آلاف دولار', 'إرشاد', 'مساحة مكتبية'],
    applicants: 67,
    views: 3456,
  },
]

// Helper functions
export function getCategoryLabel(category: OpportunityCategory, isArabic: boolean): string {
  const labels: Record<OpportunityCategory, { en: string; ar: string }> = {
    job: { en: 'Job', ar: 'وظيفة' },
    scholarship: { en: 'Scholarship', ar: 'منحة دراسية' },
    training: { en: 'Training', ar: 'تدريب' },
    volunteer: { en: 'Volunteer', ar: 'تطوع' },
    internship: { en: 'Internship', ar: 'تدريب عملي' },
    competition: { en: 'Competition', ar: 'مسابقة' },
    grant: { en: 'Grant', ar: 'منحة مالية' },
    fellowship: { en: 'Fellowship', ar: 'زمالة' },
  }
  return isArabic ? labels[category].ar : labels[category].en
}

export function getCategoryIcon(category: OpportunityCategory): string {
  const icons: Record<OpportunityCategory, string> = {
    job: '💼',
    scholarship: '🎓',
    training: '📚',
    volunteer: '🤝',
    internship: '👔',
    competition: '🏆',
    grant: '💰',
    fellowship: '🌟',
  }
  return icons[category]
}

export function getDeadlineStatus(deadline: Date): OpportunityStatus {
  const now = new Date()
  const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  if (daysLeft < 0) return 'closed'
  if (daysLeft <= 7) return 'closing-soon'
  return 'open'
}

export function formatDeadline(deadline: Date, isArabic: boolean): string {
  const daysLeft = Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  
  if (daysLeft < 0) {
    return isArabic ? 'انتهى التقديم' : 'Deadline passed'
  }
  if (daysLeft === 0) {
    return isArabic ? 'اليوم آخر يوم!' : 'Last day!'
  }
  if (daysLeft === 1) {
    return isArabic ? 'غداً آخر يوم' : 'Tomorrow'
  }
  if (daysLeft <= 7) {
    return isArabic ? `${daysLeft} أيام متبقية` : `${daysLeft} days left`
  }
  
  return deadline.toLocaleDateString(isArabic ? 'ar-SD' : 'en-US', {
    month: 'short',
    day: 'numeric',
  })
}
