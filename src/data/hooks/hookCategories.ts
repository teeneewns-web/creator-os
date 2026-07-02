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
} satisfies Record<string, HookCategory>;

export const hookCategoryList = Object.values(hookCategories);