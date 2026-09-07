export type GiftCategory = 
  | 'heritage'      // Heritage (تراثية): Jabana, Markoub, Tob, Angareeb
  | 'animated'      // Animated Slang (عامية متحركة): Yaaaa Salaam!, Wallahi Tamam, Keef da?!
  | 'luxury'        // Luxury (فخامة): Gold Ring, Pearl Necklace, Diamond
  | 'animals'       // Sudanese Animals: Camel, Falcon, Lion
  | 'ranks'         // Royal Ranks: Gold Crown, Silver Crown, Bronze Crown
  | 'flowers'       // Flowers & Romance: Rose, Jasmine, Bouquet
  | 'food'          // Sudanese Food: Kisra, Mulah, Asida
  | 'celebration'   // Celebration: Fireworks, Confetti, Balloon

export type GiftRarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface RakobaGift {
  id: string
  name: string
  nameAr: string
  category: GiftCategory
  emoji: string
  price: number // in Zool Points
  rarity: GiftRarity
  animation: GiftAnimation
  description: string
  descriptionAr: string
  isAnimated: boolean
  soundEffect?: string
}

export interface GiftAnimation {
  type: 'shake' | 'glow' | 'pulse' | 'bounce' | 'spin' | 'float' | 'sparkle' | 'explode'
  duration: number // in ms
  color?: string
  intensity?: 'low' | 'medium' | 'high'
}

// Complete Gift Library
export const RAKOBA_GIFTS: RakobaGift[] = [
  // === HERITAGE GIFTS (تراثية) ===
  {
    id: 'gift-jabana',
    name: 'Jabana',
    nameAr: 'جبنة',
    category: 'heritage',
    emoji: '☕',
    price: 50,
    rarity: 'common',
    animation: { type: 'shake', duration: 2000, intensity: 'medium' },
    description: 'Traditional Sudanese coffee pot - a symbol of hospitality',
    descriptionAr: 'إبريق القهوة السودانية التقليدي - رمز الكرم والضيافة',
    isAnimated: true,
    soundEffect: '/sounds/pour.mp3',
  },
  {
    id: 'gift-markoub',
    name: 'Markoub',
    nameAr: 'مركوب',
    category: 'heritage',
    emoji: '👞',
    price: 75,
    rarity: 'common',
    animation: { type: 'bounce', duration: 1500, intensity: 'low' },
    description: 'Traditional Sudanese leather sandals',
    descriptionAr: 'الصندل السوداني التقليدي من الجلد',
    isAnimated: true,
  },
  {
    id: 'gift-tob',
    name: 'Tob',
    nameAr: 'توب',
    category: 'heritage',
    emoji: '👘',
    price: 100,
    rarity: 'rare',
    animation: { type: 'float', duration: 3000, intensity: 'medium' },
    description: 'Beautiful traditional Sudanese dress wrap',
    descriptionAr: 'التوب السوداني الجميل - لباس المرأة السودانية',
    isAnimated: true,
  },
  {
    id: 'gift-angareeb',
    name: 'Angareeb',
    nameAr: 'عنقريب',
    category: 'heritage',
    emoji: '🛏️',
    price: 150,
    rarity: 'rare',
    animation: { type: 'shake', duration: 1000, intensity: 'low' },
    description: 'Traditional Sudanese rope bed',
    descriptionAr: 'السرير السوداني التقليدي المصنوع من الحبال',
    isAnimated: true,
  },
  {
    id: 'gift-sibha',
    name: 'Sibha',
    nameAr: 'سبحة',
    category: 'heritage',
    emoji: '📿',
    price: 80,
    rarity: 'common',
    animation: { type: 'glow', duration: 2000, color: '#D4AF37', intensity: 'medium' },
    description: 'Prayer beads for dhikr and remembrance',
    descriptionAr: 'سبحة للذكر والتسبيح',
    isAnimated: true,
  },

  // === ANIMATED SLANG (عامية متحركة) ===
  {
    id: 'gift-yaa-salaam',
    name: 'Yaaaa Salaam!',
    nameAr: 'ياااا سلام!',
    category: 'animated',
    emoji: '🤩',
    price: 30,
    rarity: 'common',
    animation: { type: 'explode', duration: 2500, intensity: 'high' },
    description: 'Express amazement Sudanese style!',
    descriptionAr: 'عبر عن إعجابك بالطريقة السودانية!',
    isAnimated: true,
    soundEffect: '/sounds/wow.mp3',
  },
  {
    id: 'gift-wallahi-tamam',
    name: 'Wallahi Tamam',
    nameAr: 'والله تمام',
    category: 'animated',
    emoji: '👌',
    price: 25,
    rarity: 'common',
    animation: { type: 'pulse', duration: 1500, intensity: 'medium' },
    description: 'Everything is perfect!',
    descriptionAr: 'كل شيء على ما يرام!',
    isAnimated: true,
  },
  {
    id: 'gift-keef-da',
    name: 'Keef Da?!',
    nameAr: 'كيف دا؟!',
    category: 'animated',
    emoji: '😱',
    price: 35,
    rarity: 'common',
    animation: { type: 'shake', duration: 2000, intensity: 'high' },
    description: 'Express shock and surprise!',
    descriptionAr: 'عبر عن صدمتك ودهشتك!',
    isAnimated: true,
  },
  {
    id: 'gift-ya-khoya',
    name: 'Ya Khoya!',
    nameAr: 'يا خويا!',
    category: 'animated',
    emoji: '🤝',
    price: 20,
    rarity: 'common',
    animation: { type: 'bounce', duration: 1000, intensity: 'medium' },
    description: 'A friendly brotherly greeting',
    descriptionAr: 'تحية أخوية ودودة',
    isAnimated: true,
  },
  {
    id: 'gift-inta-zahul',
    name: 'Inta Zahul!',
    nameAr: 'إنت زحل!',
    category: 'animated',
    emoji: '🔥',
    price: 40,
    rarity: 'rare',
    animation: { type: 'glow', duration: 2000, color: '#FF4500', intensity: 'high' },
    description: 'You are amazing!',
    descriptionAr: 'إنت عظيم ورائع!',
    isAnimated: true,
  },

  // === LUXURY GIFTS (فخامة) ===
  {
    id: 'gift-gold-ring',
    name: 'Gold Ring',
    nameAr: 'خاتم ذهب',
    category: 'luxury',
    emoji: '💍',
    price: 500,
    rarity: 'epic',
    animation: { type: 'sparkle', duration: 3000, color: '#FFD700', intensity: 'high' },
    description: 'A luxurious golden ring',
    descriptionAr: 'خاتم ذهبي فاخر',
    isAnimated: true,
    soundEffect: '/sounds/sparkle.mp3',
  },
  {
    id: 'gift-pearl-necklace',
    name: 'Pearl Necklace',
    nameAr: 'عقد لؤلؤ',
    category: 'luxury',
    emoji: '📿',
    price: 600,
    rarity: 'epic',
    animation: { type: 'glow', duration: 2500, color: '#FFFAFA', intensity: 'medium' },
    description: 'Elegant pearl necklace',
    descriptionAr: 'عقد لؤلؤ أنيق',
    isAnimated: true,
  },
  {
    id: 'gift-diamond',
    name: 'Diamond',
    nameAr: 'ماسة',
    category: 'luxury',
    emoji: '💎',
    price: 1000,
    rarity: 'legendary',
    animation: { type: 'sparkle', duration: 4000, color: '#B9F2FF', intensity: 'high' },
    description: 'A brilliant sparkling diamond',
    descriptionAr: 'ماسة براقة ولامعة',
    isAnimated: true,
    soundEffect: '/sounds/diamond.mp3',
  },
  {
    id: 'gift-gold-bar',
    name: 'Gold Bar',
    nameAr: 'سبيكة ذهب',
    category: 'luxury',
    emoji: '🪙',
    price: 800,
    rarity: 'legendary',
    animation: { type: 'glow', duration: 3000, color: '#FFD700', intensity: 'high' },
    description: 'A solid gold bar',
    descriptionAr: 'سبيكة ذهب خالص',
    isAnimated: true,
  },

  // === SUDANESE ANIMALS ===
  {
    id: 'gift-camel',
    name: 'Camel',
    nameAr: 'جمل',
    category: 'animals',
    emoji: '🐪',
    price: 200,
    rarity: 'rare',
    animation: { type: 'bounce', duration: 2000, intensity: 'low' },
    description: 'Ship of the desert - a Sudanese icon',
    descriptionAr: 'سفينة الصحراء - رمز سوداني أصيل',
    isAnimated: true,
  },
  {
    id: 'gift-falcon',
    name: 'Falcon',
    nameAr: 'صقر',
    category: 'animals',
    emoji: '🦅',
    price: 250,
    rarity: 'epic',
    animation: { type: 'float', duration: 2500, intensity: 'medium' },
    description: 'Noble hunting falcon',
    descriptionAr: 'الصقر النبيل للصيد',
    isAnimated: true,
  },
  {
    id: 'gift-lion',
    name: 'Lion',
    nameAr: 'أسد',
    category: 'animals',
    emoji: '🦁',
    price: 300,
    rarity: 'epic',
    animation: { type: 'shake', duration: 1500, intensity: 'high' },
    description: 'King of the savanna',
    descriptionAr: 'ملك السافانا',
    isAnimated: true,
    soundEffect: '/sounds/roar.mp3',
  },
  {
    id: 'gift-gazelle',
    name: 'Gazelle',
    nameAr: 'غزالة',
    category: 'animals',
    emoji: '🦌',
    price: 150,
    rarity: 'rare',
    animation: { type: 'bounce', duration: 1800, intensity: 'medium' },
    description: 'Graceful Sudanese gazelle',
    descriptionAr: 'الغزالة السودانية الرشيقة',
    isAnimated: true,
  },

  // === ROYAL RANKS (تيجان ملكية) ===
  {
    id: 'gift-crown-gold',
    name: 'Gold Crown',
    nameAr: 'تاج ذهبي',
    category: 'ranks',
    emoji: '👑',
    price: 1500,
    rarity: 'legendary',
    animation: { type: 'sparkle', duration: 4000, color: '#FFD700', intensity: 'high' },
    description: 'Royal gold crown for the champion',
    descriptionAr: 'التاج الذهبي الملكي للبطل',
    isAnimated: true,
    soundEffect: '/sounds/fanfare.mp3',
  },
  {
    id: 'gift-crown-silver',
    name: 'Silver Crown',
    nameAr: 'تاج فضي',
    category: 'ranks',
    emoji: '👑',
    price: 800,
    rarity: 'epic',
    animation: { type: 'sparkle', duration: 3000, color: '#C0C0C0', intensity: 'medium' },
    description: 'Silver crown for the noble',
    descriptionAr: 'التاج الفضي للنبيل',
    isAnimated: true,
  },
  {
    id: 'gift-crown-bronze',
    name: 'Bronze Crown',
    nameAr: 'تاج برونزي',
    category: 'ranks',
    emoji: '👑',
    price: 400,
    rarity: 'rare',
    animation: { type: 'glow', duration: 2000, color: '#CD7F32', intensity: 'medium' },
    description: 'Bronze crown for the warrior',
    descriptionAr: 'التاج البرونزي للمحارب',
    isAnimated: true,
  },
  {
    id: 'gift-shield-honor',
    name: 'Shield of Honor',
    nameAr: 'درع الشرف',
    category: 'ranks',
    emoji: '🛡️',
    price: 600,
    rarity: 'epic',
    animation: { type: 'pulse', duration: 2500, intensity: 'medium' },
    description: 'Shield awarded for bravery',
    descriptionAr: 'درع يمنح للشجاعة',
    isAnimated: true,
  },

  // === FLOWERS & ROMANCE ===
  {
    id: 'gift-red-rose',
    name: 'Red Rose',
    nameAr: 'وردة حمراء',
    category: 'flowers',
    emoji: '🌹',
    price: 60,
    rarity: 'common',
    animation: { type: 'pulse', duration: 1500, color: '#FF0000', intensity: 'medium' },
    description: 'Symbol of love and passion',
    descriptionAr: 'رمز الحب والعاطفة',
    isAnimated: true,
  },
  {
    id: 'gift-jasmine',
    name: 'Jasmine',
    nameAr: 'ياسمين',
    category: 'flowers',
    emoji: '🌸',
    price: 70,
    rarity: 'common',
    animation: { type: 'float', duration: 2000, intensity: 'low' },
    description: 'Fragrant jasmine flower',
    descriptionAr: 'زهرة الياسمين العطرة',
    isAnimated: true,
  },
  {
    id: 'gift-bouquet',
    name: 'Flower Bouquet',
    nameAr: 'باقة ورد',
    category: 'flowers',
    emoji: '💐',
    price: 120,
    rarity: 'rare',
    animation: { type: 'sparkle', duration: 2500, intensity: 'medium' },
    description: 'Beautiful mixed flower bouquet',
    descriptionAr: 'باقة ورد مختلطة جميلة',
    isAnimated: true,
  },
  {
    id: 'gift-heart',
    name: 'Beating Heart',
    nameAr: 'قلب نابض',
    category: 'flowers',
    emoji: '❤️',
    price: 50,
    rarity: 'common',
    animation: { type: 'pulse', duration: 1000, color: '#FF0000', intensity: 'high' },
    description: 'A heart full of love',
    descriptionAr: 'قلب مليء بالحب',
    isAnimated: true,
  },

  // === SUDANESE FOOD ===
  {
    id: 'gift-kisra',
    name: 'Kisra',
    nameAr: 'كسرة',
    category: 'food',
    emoji: '🫓',
    price: 40,
    rarity: 'common',
    animation: { type: 'bounce', duration: 1000, intensity: 'low' },
    description: 'Traditional Sudanese sorghum bread',
    descriptionAr: 'خبز الذرة السوداني التقليدي',
    isAnimated: true,
  },
  {
    id: 'gift-mulah',
    name: 'Mulah',
    nameAr: 'ملاح',
    category: 'food',
    emoji: '🍲',
    price: 55,
    rarity: 'common',
    animation: { type: 'shake', duration: 1200, intensity: 'low' },
    description: 'Delicious Sudanese stew',
    descriptionAr: 'الملاح السوداني اللذيذ',
    isAnimated: true,
  },
  {
    id: 'gift-asida',
    name: 'Asida',
    nameAr: 'عصيدة',
    category: 'food',
    emoji: '🥣',
    price: 45,
    rarity: 'common',
    animation: { type: 'glow', duration: 1500, color: '#DEB887', intensity: 'low' },
    description: 'Traditional porridge dessert',
    descriptionAr: 'حلوى العصيدة التقليدية',
    isAnimated: true,
  },

  // === CELEBRATION ===
  {
    id: 'gift-fireworks',
    name: 'Fireworks',
    nameAr: 'ألعاب نارية',
    category: 'celebration',
    emoji: '🎆',
    price: 100,
    rarity: 'rare',
    animation: { type: 'explode', duration: 3000, intensity: 'high' },
    description: 'Spectacular celebration fireworks',
    descriptionAr: 'ألعاب نارية احتفالية مذهلة',
    isAnimated: true,
    soundEffect: '/sounds/fireworks.mp3',
  },
  {
    id: 'gift-confetti',
    name: 'Confetti',
    nameAr: 'قصاصات ورق',
    category: 'celebration',
    emoji: '🎊',
    price: 60,
    rarity: 'common',
    animation: { type: 'explode', duration: 2500, intensity: 'medium' },
    description: 'Colorful confetti celebration',
    descriptionAr: 'احتفال بقصاصات الورق الملونة',
    isAnimated: true,
  },
  {
    id: 'gift-balloon',
    name: 'Balloons',
    nameAr: 'بالونات',
    category: 'celebration',
    emoji: '🎈',
    price: 35,
    rarity: 'common',
    animation: { type: 'float', duration: 3000, intensity: 'medium' },
    description: 'Festive party balloons',
    descriptionAr: 'بالونات حفلة احتفالية',
    isAnimated: true,
  },
  {
    id: 'gift-trophy',
    name: 'Trophy',
    nameAr: 'كأس',
    category: 'celebration',
    emoji: '🏆',
    price: 200,
    rarity: 'epic',
    animation: { type: 'sparkle', duration: 3000, color: '#FFD700', intensity: 'high' },
    description: 'Winner trophy for champions',
    descriptionAr: 'كأس الفائز للأبطال',
    isAnimated: true,
    soundEffect: '/sounds/victory.mp3',
  },
]

// Helper functions
export function getGiftsByCategory(category: GiftCategory): RakobaGift[] {
  return RAKOBA_GIFTS.filter((gift) => gift.category === category)
}

export function getGiftsByRarity(rarity: GiftRarity): RakobaGift[] {
  return RAKOBA_GIFTS.filter((gift) => gift.rarity === rarity)
}

export function getGiftById(id: string): RakobaGift | undefined {
  return RAKOBA_GIFTS.find((gift) => gift.id === id)
}

export function getCategoryLabel(category: GiftCategory, isArabic: boolean): string {
  const labels: Record<GiftCategory, { en: string; ar: string }> = {
    heritage: { en: 'Heritage', ar: 'تراثية' },
    animated: { en: 'Animated Slang', ar: 'عامية متحركة' },
    luxury: { en: 'Luxury', ar: 'فخامة' },
    animals: { en: 'Animals', ar: 'حيوانات' },
    ranks: { en: 'Royal Ranks', ar: 'تيجان ملكية' },
    flowers: { en: 'Flowers', ar: 'ورود' },
    food: { en: 'Sudanese Food', ar: 'أكل سوداني' },
    celebration: { en: 'Celebration', ar: 'احتفال' },
  }
  return isArabic ? labels[category].ar : labels[category].en
}

export function getRarityColor(rarity: GiftRarity): string {
  const colors: Record<GiftRarity, string> = {
    common: 'text-muted-foreground',
    rare: 'text-blue-500',
    epic: 'text-purple-500',
    legendary: 'text-amber-500',
  }
  return colors[rarity]
}

export function getRarityBgColor(rarity: GiftRarity): string {
  const colors: Record<GiftRarity, string> = {
    common: 'bg-muted',
    rare: 'bg-blue-500/10',
    epic: 'bg-purple-500/10',
    legendary: 'bg-amber-500/10',
  }
  return colors[rarity]
}
