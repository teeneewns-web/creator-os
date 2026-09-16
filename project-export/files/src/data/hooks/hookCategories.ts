export type HookCategory = {
  slug: string;
  icon: string;
  label: string;
  title: string;
  description: string;
  href: string;
};

export const hookCategories = {
  beauty: {
    slug: "beauty",
    icon: "💄",
    label: "Beauty",
    title: "Beauty Hooks",
    description:
      "Hook สำหรับคอนเทนต์ความงาม รีวิวสินค้า สกินแคร์ เมคอัพ และการดูแลตัวเอง",
    href: "/hooks/beauty",
  },

  finance: {
    slug: "finance",
    icon: "💰",
    label: "Finance",
    title: "Finance Hooks",
    description:
      "Hook สำหรับคอนเทนต์การเงิน การออม การลงทุน รายได้เสริม และความรู้ทางการเงิน",
    href: "/hooks/finance",
  },

  gaming: {
    slug: "gaming",
    icon: "🎮",
    label: "Gaming",
    title: "Gaming Hooks",
    description:
      "Hook สำหรับคอนเทนต์เกม แคสต์เกม รีวิวเกม เทคนิคเกม และคอนเทนต์เกมเมอร์",
    href: "/hooks/gaming",
  },

  ai: {
    slug: "ai",
    icon: "🤖",
    label: "AI",
    title: "AI Hooks",
    description:
      "Hook สำหรับคอนเทนต์ AI เครื่องมืออัตโนมัติ การทำงานด้วย AI และไอเดียคอนเทนต์ยุคใหม่",
    href: "/hooks/ai",
  },

  food: {
    slug: "food",
    icon: "🍜",
    label: "Food",
    title: "Food Hooks",
    description:
      "Hook สำหรับคอนเทนต์อาหาร รีวิวร้าน สูตรอาหาร ของกิน และคลิปกินให้น่าสนใจ",
    href: "/hooks/food",
  },

  travel: {
    slug: "travel",
    icon: "✈️",
    label: "Travel",
    title: "Travel Hooks",
    description:
      "Hook สำหรับคอนเทนต์ท่องเที่ยว รีวิวสถานที่ คาเฟ่ ที่พัก และทริปสั้น ๆ",
    href: "/hooks/travel",
  },

  fitness: {
    slug: "fitness",
    icon: "🏋️",
    label: "Fitness",
    title: "Fitness Hooks",
    description:
      "Hook สำหรับคอนเทนต์ออกกำลังกาย ลดไขมัน สุขภาพ รูปร่าง และวินัยส่วนตัว",
    href: "/hooks/fitness",
  },
} satisfies Record<string, HookCategory>;

export const hookCategoryList = Object.values(hookCategories);