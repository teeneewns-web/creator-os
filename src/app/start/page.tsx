"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  ContentCapability,
  ContentDirection,
  ContentGoal,
  ContentPlatform,
  DailyTime,
  PlanRequest,
  PlanType,
  SupportNeed,
} from "../../types/plan-request";
import {
  AUDIENCE_STAGE_LABELS,
  AUDIENCE_STAGE_OPTIONS,
  AUDIENCE_VALUE_LABELS,
  DESIRED_ACTION_LABELS,
  SUPPORT_NEED_LABELS,
  TONE_LABELS,
  TONE_OPTIONS,
  getAudienceValueOptions,
  getDesiredActionOptions,
  getSupportNeedOptions,
} from "../../data/plan-intent-options";

type FormErrors = Partial<Record<keyof PlanRequest, string>>;

const DRAFT_STORAGE_KEY = "creator-os-start-draft-v1";
const REQUEST_STORAGE_KEY = "creator-os-plan-request-v1";

const PLAN_TYPE_OPTIONS: Array<{
  value: PlanType;
  title: string;
  description: string;
}> = [
  {
    value: "product",
    title: "ขายสินค้า / Affiliate",
    description:
      "สำหรับเจ้าของสินค้า ร้านค้าออนไลน์ ตัวแทนจำหน่าย และ TikTok Affiliate",
  },
  {
    value: "service",
    title: "ขายบริการ / โปรโมตร้าน",
    description:
      "สำหรับร้านค้า ธุรกิจท้องถิ่น ฟรีแลนซ์ ช่าง และผู้ให้บริการ",
  },
  {
    value: "creator",
    title: "สร้างเพจ / เป็นครีเอเตอร์",
    description:
      "สำหรับเพจให้ความรู้ รีวิว เล่าเรื่อง บันเทิง หรือสร้างตัวตน โดยไม่จำเป็นต้องมีสินค้า",
  },
];

type ContentDirectionOption = {
  value: ContentDirection;
  title: string;
  description: string;
};

const CONTENT_DIRECTION_OPTIONS: Record<
  PlanType,
  ContentDirectionOption[]
> = {
  product: [
    {
      value: "product-demo",
      title: "สาธิตและใช้งานจริง",
      description:
        "เน้นให้เห็นสินค้า วิธีใช้ รายละเอียด และผลจากการใช้งานจริง",
    },
    {
      value: "product-review",
      title: "รีวิวและเปรียบเทียบ",
      description:
        "ช่วยให้ผู้ชมเปรียบเทียบข้อดี ข้อจำกัด และเลือกให้เหมาะกับตนเอง",
    },
    {
      value: "product-lifestyle",
      title: "ไลฟ์สไตล์ / UGC",
      description:
        "นำสินค้าเข้าไปอยู่ในชีวิตประจำวัน ให้ดูเป็นธรรมชาติและเห็นบริบทจริง",
    },
    {
      value: "product-problem-solution",
      title: "แก้ปัญหาและตอบข้อสงสัย",
      description:
        "เริ่มจากปัญหาของลูกค้า แล้วอธิบายว่าสินค้าช่วยตรงไหนอย่างไม่กล่าวอ้างเกินจริง",
    },
    {
      value: "product-offer",
      title: "โปรโมชั่นและปิดการขาย",
      description:
        "เน้นราคา โปรโมชั่น ความคุ้มค่า วิธีสั่งซื้อ และคำชวนที่ชัดเจน",
    },
    {
      value: "product-brand-story",
      title: "เรื่องราวแบรนด์และเบื้องหลัง",
      description:
        "เล่าที่มา วิธีเลือกสินค้า กระบวนการทำ และเหตุผลที่แบรนด์แตกต่าง",
    },
  ],
  service: [
    {
      value: "service-results",
      title: "ผลงานและผลลัพธ์ที่ตรวจสอบได้",
      description:
        "แสดงตัวอย่างงาน ก่อน–หลัง หรือผลงานจริงโดยไม่รับประกันผลลัพธ์เกินจริง",
    },
    {
      value: "service-process",
      title: "ขั้นตอนและเบื้องหลังบริการ",
      description:
        "ทำให้ลูกค้าเห็นลำดับงาน มาตรฐาน และสิ่งที่จะได้รับก่อนตัดสินใจ",
    },
    {
      value: "service-expert",
      title: "ให้ความรู้และสร้างความเชื่อใจ",
      description:
        "ตอบคำถาม ให้คำแนะนำ และแสดงความเชี่ยวชาญในขอบเขตที่ยืนยันได้",
    },
    {
      value: "service-case-study",
      title: "รีวิวลูกค้าและกรณีศึกษา",
      description:
        "เล่าโจทย์ วิธีทำ และสิ่งที่เกิดขึ้นจากเคสจริง โดยปกป้องข้อมูลส่วนตัว",
    },
    {
      value: "service-local",
      title: "โปรโมตร้านและพื้นที่ให้บริการ",
      description:
        "เน้นบรรยากาศ ทำเล เวลาเปิดบริการ และเหตุผลที่คนในพื้นที่ควรรู้จัก",
    },
    {
      value: "service-booking",
      title: "ข้อเสนอและเพิ่มการจอง",
      description:
        "เน้นแพ็กเกจ ราคา ช่องทางติดต่อ คิวว่าง และคำชวนให้จองอย่างชัดเจน",
    },
  ],
  creator: [
    {
      value: "creator-short-film",
      title: "หนังสั้น / ละครสั้น",
      description:
        "ระบบจะสร้างเนื้อเรื่อง บทแบ่งฉาก บทพูด ลำดับภาพ และตอนจบพร้อมถ่าย",
    },
    {
      value: "creator-comedy",
      title: "ตลก / สเก็ตช์ / มุกสถานการณ์",
      description:
        "สร้างบทตลกสั้น จังหวะมุก ตัวละคร และตอนจบที่เข้าใจง่าย",
    },
    {
      value: "creator-education",
      title: "ให้ความรู้ / สอน / อธิบาย",
      description:
        "สร้างคอนเทนต์ที่ช่วยให้ผู้ชมเข้าใจ ทำตาม และแก้ปัญหาได้",
    },
    {
      value: "creator-review",
      title: "รีวิว / วิเคราะห์ / แสดงความคิดเห็น",
      description:
        "วางเกณฑ์รีวิว เปรียบเทียบ ข้อดี ข้อจำกัด และมุมมองที่มีเหตุผล",
    },
    {
      value: "creator-story",
      title: "เล่าเรื่อง / ประสบการณ์ / สร้างตัวตน",
      description:
        "เล่าเรื่องส่วนตัว เส้นทาง บทเรียน หรือมุมมองเพื่อให้ผู้ชมรู้จักผู้สร้าง",
    },
    {
      value: "creator-gaming",
      title: "เกม / ไฮไลต์ / ชาเลนจ์ / ไลฟ์",
      description:
        "วางคลิปเกม ภารกิจ ไฮไลต์ บทพากย์ และจังหวะชวนผู้ชมมีส่วนร่วม",
    },
    {
      value: "creator-art",
      title: "ศิลปะ / เพลง / การแสดง / ผลงานสร้างสรรค์",
      description:
        "เน้นตัวผลงาน กระบวนการ เบื้องหลัง การแสดง และการเปิดตัวผลงาน",
    },
    {
      value: "creator-lifestyle",
      title: "ไลฟ์สไตล์ / ชุมชน / ชีวิตประจำวัน",
      description:
        "สร้างเรื่องจากชีวิตจริง กิจวัตร ความสนใจ และการพูดคุยกับชุมชนผู้ติดตาม",
    },
  ],
};

function getContentDirectionOptions(
  planType: PlanRequest["planType"]
) {
  if (
    planType === "product" ||
    planType === "service" ||
    planType === "creator"
  ) {
    return CONTENT_DIRECTION_OPTIONS[planType];
  }

  return [];
}

function getContentDirectionLabel(
  direction: PlanRequest["contentDirection"]
) {
  if (!direction) return "-";

  const allOptions = Object.values(
    CONTENT_DIRECTION_OPTIONS
  ).flat();

  return (
    allOptions.find(
      (option) => option.value === direction
    )?.title || direction
  );
}

const STEP_ONE_COPY: Record<
  PlanType,
  {
    itemLabel: string;
    itemPlaceholder: string;
    audienceLabel: string;
    audiencePlaceholder: string;
    highlightsLabel: string;
    highlightsPlaceholder: string;
    concernsLabel: string;
    concernsPlaceholder: string;
    detailsLabel: string;
    detailsPlaceholder: string;
    prohibitedLabel: string;
    prohibitedPlaceholder: string;
  }
> = {
  product: {
    itemLabel: "คุณขายสินค้าอะไร?",
    itemPlaceholder:
      "ตัวอย่าง: กระเป๋าใบใหญ่สำหรับใส่ของประจำวัน",
    audienceLabel: "กลุ่มลูกค้าหลักคือใคร?",
    audiencePlaceholder:
      "ตัวอย่าง: คนทำงาน นักศึกษา และคนที่ต้องพกของหลายชิ้น",
    highlightsLabel: "จุดเด่นของสินค้า",
    highlightsPlaceholder:
      "ตัวอย่าง:\nใส่ของได้หลายชิ้น\nหูหิ้วเสริมความแข็งแรง\nเหมาะกับการใช้งานประจำวัน",
    concernsLabel:
      "ลูกค้ามักสงสัยหรือลังเลเรื่องอะไร?",
    concernsPlaceholder:
      "ตัวอย่าง:\nขนาดจริงใหญ่แค่ไหน\nใส่ของได้มากเพียงใด\nแข็งแรงหรือไม่",
    detailsLabel:
      "ราคา โปรโมชั่น และวิธีสั่งซื้อ",
    detailsPlaceholder:
      "ตัวอย่าง: ราคา 199 บาท สั่งซื้อผ่านตะกร้า TikTok",
    prohibitedLabel:
      "สิ่งที่ห้ามพูดหรือห้ามกล่าวอ้าง",
    prohibitedPlaceholder:
      "ตัวอย่าง: ห้ามระบุน้ำหนักสูงสุด เพราะยังไม่มีผลทดสอบ",
  },

  service: {
    itemLabel: "คุณให้บริการอะไร?",
    itemPlaceholder:
      "ตัวอย่าง: บริการตัดผมชายและออกแบบทรงผม",
    audienceLabel:
      "ลูกค้าหลักของบริการคือใคร?",
    audiencePlaceholder:
      "ตัวอย่าง: ผู้ชายวัยทำงานในเชียงใหม่",
    highlightsLabel:
      "จุดเด่น ขั้นตอน หรือความแตกต่างของบริการ",
    highlightsPlaceholder:
      "ตัวอย่าง:\nให้คำแนะนำก่อนตัด\nจองคิวได้\nดูแลโดยช่างที่มีประสบการณ์",
    concernsLabel:
      "ลูกค้ามักกังวลหรือถามเรื่องอะไร?",
    concernsPlaceholder:
      "ตัวอย่าง:\nใช้เวลานานไหม\nราคาเท่าไร\nต้องจองล่วงหน้าหรือไม่",
    detailsLabel:
      "ราคา พื้นที่บริการ และช่องทางจอง",
    detailsPlaceholder:
      "ตัวอย่าง: เริ่มต้น 250 บาท ให้บริการในเชียงใหม่ จองผ่าน LINE",
    prohibitedLabel:
      "ข้อมูลที่ห้ามพูดหรือไม่ต้องการเปิดเผย",
    prohibitedPlaceholder:
      "ตัวอย่าง: ห้ามเปิดเผยข้อมูลส่วนตัวของลูกค้า",
  },

  creator: {
    itemLabel:
      "เพจหรือผลงานของคุณเกี่ยวกับเรื่องอะไร?",
    itemPlaceholder:
      "ตัวอย่าง: เพจหนังสั้นแนวหักมุมที่ถ่ายด้วยโทรศัพท์",
    audienceLabel:
      "ต้องการทำผลงานให้ใครดู?",
    audiencePlaceholder:
      "ตัวอย่าง: คนอายุ 18–35 ปีที่ชอบหนังสั้นจบไวและมีจุดหักมุม",
    highlightsLabel:
      "แนวทาง ทรัพยากร หรือรูปแบบที่คุณมี",
    highlightsPlaceholder:
      "ตัวอย่าง:\nแนวดราม่าหักมุม\nมีนักแสดง 1–2 คน\nถ่ายได้ในห้องและบริเวณบ้าน\nใช้โทรศัพท์ถ่าย",
    concernsLabel:
      "ผู้ชมของคุณชอบ คาดหวัง หรืออยากดูอะไร?",
    concernsPlaceholder:
      "ตัวอย่าง:\nเรื่องเข้าใจง่ายโดยไม่ต้องเดา\nตอนจบหักมุม\nคลิปยาวไม่เกิน 1 นาที",
    detailsLabel:
      "สิ่งที่ต้องการโปรโมตหรือชวนผู้ชมทำต่อ",
    detailsPlaceholder:
      "ตัวอย่าง: ชวนติดตามเพื่อดูตอนต่อไป หรือเสนอแนวเรื่องที่อยากดู",
    prohibitedLabel:
      "เรื่องที่ไม่ต้องการเปิดเผยหรือไม่ต้องการใส่ในผลงาน",
    prohibitedPlaceholder:
      "ตัวอย่าง: ไม่เปิดเผยสถานที่พัก ไม่มีฉากรุนแรง และไม่ใช้คำหยาบ",
  },
};

const GOAL_OPTIONS: Array<{
  value: ContentGoal;
  title: string;
  description: string;
}> = [
  {
    value: "sell",
    title: "ขายสินค้า",
    description:
      "สร้างคอนเทนต์ที่ช่วยให้คนเข้าใจสินค้า ลดความลังเล และดูรายละเอียดต่อ",
  },
  {
    value: "grow",
    title: "เพิ่มผู้ติดตาม",
    description:
      "สร้างคอนเทนต์ที่มีประโยชน์และทำให้คนอยากติดตามผลงานต่อ",
  },
  {
    value: "engagement",
    title: "เรียกความคิดเห็นและการมีส่วนร่วม",
    description:
      "ชวนให้ผู้ชมตอบคำถาม แสดงความคิดเห็น บันทึก หรือแชร์",
  },
  {
    value: "trust",
    title: "สร้างความน่าเชื่อถือ",
    description:
      "แสดงข้อมูล ประสบการณ์ หลักฐาน และความโปร่งใสของธุรกิจ",
  },
  {
    value: "promote",
    title: "โปรโมตร้านหรือบริการ",
    description:
      "ทำให้คนรู้จักร้าน บริการ โปรโมชั่น หรือกิจกรรมที่กำลังจัด",
  },
];

const PLATFORM_OPTIONS: Array<{
  value: ContentPlatform;
  title: string;
  description: string;
}> = [
  {
    value: "facebook",
    title: "Facebook",
    description:
      "เหมาะกับโพสต์ภาพ ข้อความ คำถาม Reels และการสนทนาในความคิดเห็น",
  },
  {
    value: "tiktok",
    title: "TikTok",
    description:
      "เหมาะกับคลิปสั้น ประโยคเปิดที่ดึงดูด บทพูด และลำดับการถ่าย",
  },
  {
    value: "facebook-and-tiktok",
    title: "Facebook และ TikTok",
    description:
      "ระบบจะปรับงานหลักให้สามารถนำไปใช้กับทั้งสองแพลตฟอร์ม",
  },
];

const TIME_OPTIONS: Array<{
  value: DailyTime;
  title: string;
  description: string;
}> = [
  {
    value: "10-20",
    title: "10–20 นาทีต่อวัน",
    description:
      "แผนเบา เน้นงานที่ทำได้เร็ว ใช้ภาพหรือข้อความมากขึ้น",
  },
  {
    value: "30-45",
    title: "30–45 นาทีต่อวัน",
    description:
      "แผนมาตรฐาน ผสมคลิป ภาพ และโพสต์ข้อความอย่างเหมาะสม",
  },
  {
    value: "60-90",
    title: "60–90 นาทีต่อวัน",
    description:
      "แผนเต็ม มีคลิปมากขึ้น พร้อมงานเสริมและการติดตามผล",
  },
  {
    value: "90-plus",
    title: "มากกว่า 90 นาทีต่อวัน",
    description:
      "เหมาะกับผู้ที่มีทีม หรือสามารถผลิตคอนเทนต์ได้หลายรูปแบบ",
  },
];

const CAPABILITY_OPTIONS: Array<{
  value: ContentCapability;
  title: string;
}> = [
  {
    value: "film-product",
    title: "ถ่ายสินค้าได้",
  },
  {
    value: "face-camera",
    title: "พูดหน้ากล้องได้",
  },
  {
    value: "voice-over",
    title: "พากย์เสียงได้",
  },
  {
    value: "image-only",
    title: "ใช้ภาพสินค้าอย่างเดียว",
  },
  {
    value: "no-face",
    title: "ไม่ต้องการออกหน้ากล้อง",
  },
  {
    value: "no-media",
    title: "ยังไม่มีภาพหรือวิดีโอ",
  },
];

function getGoalOptions(
  planType: PlanRequest["planType"]
): Array<{
  value: ContentGoal;
  title: string;
  description: string;
}> {
  if (planType === "creator") {
    return GOAL_OPTIONS.filter(
      (option) => option.value !== "sell"
    ).map((option) =>
      option.value === "promote"
        ? {
            ...option,
            title: "โปรโมตผลงานหรือกิจกรรม",
            description:
              "ทำให้คนรู้จักผลงาน กิจกรรม ช่องทาง หรือสิ่งที่ต้องการผลักดัน",
          }
        : option
    );
  }

  if (planType === "service") {
    return GOAL_OPTIONS.map((option) => {
      if (option.value === "sell") {
        return {
          ...option,
          title: "เพิ่มลูกค้าหรือการจอง",
          description:
            "ช่วยให้คนเข้าใจบริการ ลดความลังเล และติดต่อหรือจองคิว",
        };
      }

      if (option.value === "promote") {
        return {
          ...option,
          title: "โปรโมตร้านหรือบริการ",
          description:
            "ทำให้คนรู้จักร้าน บริการ โปรโมชั่น หรือกิจกรรมที่กำลังจัด",
        };
      }

      return option;
    });
  }

  return GOAL_OPTIONS.map((option) =>
    option.value === "promote"
      ? {
          ...option,
          title: "โปรโมตสินค้า หรือแคมเปญ",
          description:
            "ทำให้คนรู้จักสินค้า โปรโมชั่น หรือแคมเปญที่กำลังจัด",
        }
      : option
  );
}

function getCapabilityOptions(
  planType: PlanRequest["planType"]
): Array<{
  value: ContentCapability;
  title: string;
}> {
  return CAPABILITY_OPTIONS.map((option) => {
    if (option.value === "film-product") {
      if (planType === "service") {
        return {
          ...option,
          title: "ถ่ายร้าน ผลงาน หรือขั้นตอนบริการได้",
        };
      }

      if (planType === "creator") {
        return {
          ...option,
          title: "ถ่ายวิดีโอประกอบเนื้อหาได้",
        };
      }
    }

    if (option.value === "image-only") {
      if (planType === "service") {
        return {
          ...option,
          title: "ใช้ภาพร้านหรือภาพผลงานเป็นหลัก",
        };
      }

      if (planType === "creator") {
        return {
          ...option,
          title: "ใช้ภาพหรือกราฟิกเป็นหลัก",
        };
      }
    }

    return option;
  });
}


function getInitialForm(): PlanRequest {
  return {
    planType: "",
    contentDirection: "",
    productOrService: "",
    productHighlights: "",
    audience: "",
    customerConcerns: "",
    creatorChallenge: "",
    promotionDetails: "",
    prohibitedClaims: "",

    audienceStage: "",
    audienceValue: "",
    desiredAction: "",
    supportNeeds: [],
    tone: "",

    goal: "",
    platform: "",
    dailyTime: "",
    capabilities: [],

    createdAt: "",
  };
}

function readDraft(): PlanRequest {
  if (typeof window === "undefined") {
    return getInitialForm();
  }

  const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);

  if (!raw) {
    return getInitialForm();
  }

  try {
    return {
      ...getInitialForm(),
      ...(JSON.parse(raw) as PlanRequest),
      createdAt: "",
    };
  } catch {
    return getInitialForm();
  }
}

function validateStep(
  step: number,
  form: PlanRequest
): FormErrors {
  const errors: FormErrors = {};

  if (step === 1) {
    if (!form.planType) {
      errors.planType =
        "กรุณาเลือกประเภทแผนที่ต้องการ";
    }

    if (!form.contentDirection) {
      errors.contentDirection =
        "กรุณาเลือกทิศทางคอนเทนต์หลัก";
    }

    if (!form.productOrService.trim()) {
      errors.productOrService =
        "กรุณาระบุว่าคุณขาย ทำบริการ หรือสร้างเนื้อหาเกี่ยวกับอะไร";
    }

    if (!form.productHighlights.trim()) {
      errors.productHighlights =
        "กรุณาระบุจุดเด่นหรือแนวทางหลักอย่างน้อย 1 ข้อ";
    }

    if (!form.audience.trim()) {
      errors.audience =
        "กรุณาระบุกลุ่มผู้ชมหลัก";
    }

    if (!form.audienceStage) {
      errors.audienceStage =
        "กรุณาเลือกระดับความคุ้นเคยของผู้ชม";
    }

    if (!form.audienceValue) {
      errors.audienceValue =
        "กรุณาเลือกสิ่งหลักที่ผู้ชมควรได้รับ";
    }

    if (form.supportNeeds.length === 0) {
      errors.supportNeeds =
        "กรุณาเลือกสิ่งที่ต้องการให้ Creator OS ช่วยอย่างน้อย 1 ข้อ";
    }

    if (!form.tone) {
      errors.tone =
        "กรุณาเลือกน้ำเสียงหลักของคอนเทนต์";
    }
  }

  if (step === 2) {
    if (!form.goal) {
      errors.goal =
        "กรุณาเลือกเป้าหมายหลัก";
    }

    if (!form.desiredAction) {
      errors.desiredAction =
        "กรุณาเลือกสิ่งที่อยากให้ผู้ชมทำต่อ";
    }

    if (!form.platform) {
      errors.platform =
        "กรุณาเลือกแพลตฟอร์ม";
    }

    if (!form.dailyTime) {
      errors.dailyTime =
        "กรุณาเลือกเวลาที่มีในแต่ละวัน";
    }

    if (form.capabilities.length === 0) {
      errors.capabilities =
        "กรุณาเลือกสิ่งที่คุณสามารถทำได้อย่างน้อย 1 ข้อ";
    }
  }

  return errors;
}

function hasErrors(errors: FormErrors) {
  return Object.keys(errors).length > 0;
}

export default function StartPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [form, setForm] =
    useState<PlanRequest>(getInitialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [hydrated, setHydrated] = useState(false);

  const selectedPlanType: PlanType | null =
    form.planType === "product" ||
    form.planType === "service" ||
    form.planType === "creator"
      ? form.planType
      : null;

  const stepOneCopy = selectedPlanType
    ? STEP_ONE_COPY[selectedPlanType]
    : null;

  const availableDirectionOptions =
    getContentDirectionOptions(form.planType);

  const availableGoalOptions = getGoalOptions(
    form.planType
  );

  const availableCapabilityOptions =
    getCapabilityOptions(form.planType);

  const availableAudienceValueOptions =
    getAudienceValueOptions(
      form.planType,
      form.contentDirection
    );

  const availableDesiredActionOptions =
    getDesiredActionOptions(
      form.planType,
      form.goal
    );

  const availableSupportNeedOptions =
    getSupportNeedOptions(
      form.planType,
      form.contentDirection
    );

  useEffect(() => {
    setForm(readDraft());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    window.localStorage.setItem(
      DRAFT_STORAGE_KEY,
      JSON.stringify(form)
    );
  }, [form, hydrated]);

  const completedPercent = useMemo(() => {
    return Math.round((step / 3) * 100);
  }, [step]);

  function updateField<K extends keyof PlanRequest>(
    field: K,
    value: PlanRequest[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  }

  function selectPlanType(planType: PlanType) {
    setForm((current) => ({
      ...current,
      planType,
      contentDirection: "",
      creatorChallenge: "",
      audienceValue: "",
      desiredAction: "",
      supportNeeds: [],
      tone: "",
      goal: "",
    }));

    setErrors((current) => ({
      ...current,
      planType: undefined,
      contentDirection: undefined,
      creatorChallenge: undefined,
      audienceValue: undefined,
      desiredAction: undefined,
      supportNeeds: undefined,
      tone: undefined,
      goal: undefined,
    }));
  }

  function toggleCapability(
    capability: ContentCapability
  ) {
    const selected =
      form.capabilities.includes(capability);

    updateField(
      "capabilities",
      selected
        ? form.capabilities.filter(
            (item) => item !== capability
          )
        : [...form.capabilities, capability]
    );
  }

  function selectContentDirection(
    direction: ContentDirection
  ) {
    setForm((current) => ({
      ...current,
      contentDirection: direction,
      audienceValue: "",
      supportNeeds: [],
    }));

    setErrors((current) => ({
      ...current,
      contentDirection: undefined,
      audienceValue: undefined,
      supportNeeds: undefined,
    }));
  }

  function selectGoal(goal: ContentGoal) {
    setForm((current) => ({
      ...current,
      goal,
      desiredAction: "",
    }));

    setErrors((current) => ({
      ...current,
      goal: undefined,
      desiredAction: undefined,
    }));
  }

  function toggleSupportNeed(
    need: SupportNeed
  ) {
    const selected =
      form.supportNeeds.includes(need);

    if (!selected && form.supportNeeds.length >= 3) {
      setErrors((current) => ({
        ...current,
        supportNeeds:
          "เลือกได้ไม่เกิน 3 ข้อ เพื่อให้ระบบรู้ว่าสิ่งใดสำคัญที่สุด",
      }));
      return;
    }

    updateField(
      "supportNeeds",
      selected
        ? form.supportNeeds.filter(
            (item) => item !== need
          )
        : [...form.supportNeeds, need]
    );
  }

  function goNext() {
    const nextErrors = validateStep(step, form);

    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    setErrors({});
    setStep((current) => Math.min(current + 1, 3));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function goBack() {
    setErrors({});
    setStep((current) => Math.max(current - 1, 1));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function createPlan() {
    const stepOneErrors = validateStep(1, form);
    const stepTwoErrors = validateStep(2, form);

    const allErrors = {
      ...stepOneErrors,
      ...stepTwoErrors,
    };

    if (hasErrors(allErrors)) {
      setErrors(allErrors);

      if (
        stepOneErrors.planType ||
        stepOneErrors.contentDirection ||
        stepOneErrors.productOrService ||
        stepOneErrors.productHighlights ||
        stepOneErrors.audience ||
        stepOneErrors.audienceStage ||
        stepOneErrors.audienceValue ||
        stepOneErrors.supportNeeds ||
        stepOneErrors.tone
      ) {
        setStep(1);
      } else {
        setStep(2);
      }

      return;
    }

    const request: PlanRequest = {
      ...form,
      productOrService:
        form.productOrService.trim(),
      productHighlights:
        form.productHighlights.trim(),
      audience: form.audience.trim(),
      customerConcerns:
        form.customerConcerns.trim(),
      creatorChallenge:
        form.creatorChallenge.trim(),
      promotionDetails:
        form.promotionDetails.trim(),
      prohibitedClaims:
        form.prohibitedClaims.trim(),
      createdAt: new Date().toISOString(),
    };

    window.localStorage.setItem(
      REQUEST_STORAGE_KEY,
      JSON.stringify(request)
    );

    router.push("/checkout");
  }

  function resetForm() {
    const confirmed = window.confirm(
      "ต้องการล้างข้อมูลที่กรอกไว้ทั้งหมดหรือไม่?"
    );

    if (!confirmed) return;

    const emptyForm = getInitialForm();

    setForm(emptyForm);
    setErrors({});
    setStep(1);

    window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    window.localStorage.removeItem(REQUEST_STORAGE_KEY);
  }

  return (
    <main style={pageStyle}>
      <section style={heroStyle}>
        <p style={heroLabelStyle}>
          สร้างแผนคอนเทนต์พร้อมทำ
        </p>

        <h1 style={heroTitleStyle}>
          บอกข้อมูลของคุณ แล้วให้ระบบจัดแผน 7 วัน
        </h1>

        <p style={heroSubtitleStyle}>
          ไม่ต้องเขียน Prompt ไม่ต้องเลือก Hook
          หรือประกอบสคริปต์เอง
          ตอบคำถามสั้น ๆ เพียง 3 ขั้นตอน
        </p>

        <div style={progressHeaderStyle}>
          <span>ขั้นที่ {step} จาก 3</span>
          <strong>{completedPercent}%</strong>
        </div>

        <div style={progressOuterStyle}>
          <div
            style={{
              ...progressInnerStyle,
              width: `${completedPercent}%`,
            }}
          />
        </div>
      </section>

      <section style={stepNavigationStyle}>
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            style={
              item === step
                ? activeStepItemStyle
                : item < step
                  ? completedStepItemStyle
                  : stepItemStyle
            }
          >
            <span style={stepNumberStyle}>{item}</span>

            <span>
              {item === 1 && "ประเภทและข้อมูล"}
              {item === 2 && "เป้าหมายและความพร้อม"}
              {item === 3 && "ตรวจข้อมูล"}
            </span>
          </div>
        ))}
      </section>

      {step === 1 ? (
        <section style={formSectionStyle}>
          <div style={sectionHeadingStyle}>
            <p style={sectionLabelStyle}>ขั้นที่ 1</p>

            <h2 style={sectionTitleStyle}>
              เลือกประเภทแผน แล้วบอกข้อมูลของคุณ
            </h2>

            <p style={sectionDescriptionStyle}>
              คำถามจะเปลี่ยนให้เหมาะกับสินค้า
              บริการ หรือครีเอเตอร์ที่คุณเลือก
            </p>
          </div>

          <ChoiceSection
            title="คุณต้องการสร้างแผนแบบไหน?"
            error={errors.planType}
          >
            {PLAN_TYPE_OPTIONS.map((option) => (
              <ChoiceCard
                key={option.value}
                selected={form.planType === option.value}
                title={option.title}
                description={option.description}
                onClick={() =>
                  selectPlanType(option.value)
                }
              />
            ))}
          </ChoiceSection>

          {availableDirectionOptions.length > 0 ? (
            <>
              <ChoiceSection
                title="ทิศทางคอนเทนต์หลักของคุณ"
                error={errors.contentDirection}
              >
                {availableDirectionOptions.map((option) => (
                  <ChoiceCard
                    key={option.value}
                    selected={
                      form.contentDirection === option.value
                    }
                    title={option.title}
                    description={option.description}
                    onClick={() =>
                      selectContentDirection(
                        option.value
                      )
                    }
                  />
                ))}
              </ChoiceSection>

              <article style={largeSummaryCardStyle}>
                <p style={summaryLabelStyle}>
                  ไม่พบแนวทางที่ต้องการ?
                </p>

                <p style={preserveTextStyle}>
                  อย่าฝืนเลือกแนวที่ไม่ตรง เพราะระบบจะใช้ตัวเลือกนี้ควบคุมแผนทั้งหมด คุณสามารถแจ้งขอเพิ่มแนวทางใหม่ผ่าน LINE @857xezqh แล้วทีมจะตรวจว่าควรเพิ่มเป็นประเภทมาตรฐานหรือรับเป็นงานเฉพาะ
                </p>

                <a
                  href="https://line.me/R/ti/p/@857xezqh"
                  target="_blank"
                  rel="noreferrer"
                  style={requestDirectionButtonStyle}
                >
                  แจ้งขอเพิ่มแนวทาง
                </a>
              </article>
            </>
          ) : null}

          {stepOneCopy ? (
            <>
              <div style={fieldGridStyle}>
                <Field
                  label={stepOneCopy.itemLabel}
                  required
                  error={errors.productOrService}
                >
                  <input
                    value={form.productOrService}
                    onChange={(event) =>
                      updateField(
                        "productOrService",
                        event.target.value
                      )
                    }
                    placeholder={stepOneCopy.itemPlaceholder}
                    style={inputStyle}
                  />
                </Field>

                <Field
                  label={stepOneCopy.audienceLabel}
                  required
                  error={errors.audience}
                >
                  <input
                    value={form.audience}
                    onChange={(event) =>
                      updateField(
                        "audience",
                        event.target.value
                      )
                    }
                    placeholder={
                      stepOneCopy.audiencePlaceholder
                    }
                    style={inputStyle}
                  />
                </Field>
              </div>

              <ChoiceSection
                title="ผู้ชมส่วนใหญ่รู้จักคุณในระดับไหน?"
                error={errors.audienceStage}
              >
                {AUDIENCE_STAGE_OPTIONS.map((option) => (
                  <ChoiceCard
                    key={option.value}
                    selected={
                      form.audienceStage === option.value
                    }
                    title={option.title}
                    description={option.description}
                    onClick={() =>
                      updateField(
                        "audienceStage",
                        option.value
                      )
                    }
                  />
                ))}
              </ChoiceSection>

              <ChoiceSection
                title="สิ่งหลักที่ผู้ชมควรได้รับจากคอนเทนต์นี้"
                error={errors.audienceValue}
              >
                {availableAudienceValueOptions.map(
                  (option) => (
                    <ChoiceCard
                      key={option.value}
                      selected={
                        form.audienceValue ===
                        option.value
                      }
                      title={option.title}
                      description={option.description}
                      onClick={() =>
                        updateField(
                          "audienceValue",
                          option.value
                        )
                      }
                    />
                  )
                )}
              </ChoiceSection>

              <Field
                label={stepOneCopy.highlightsLabel}
                required
                error={errors.productHighlights}
                helpText="เขียนแยกบรรทัดได้ ระบบจะใช้ข้อมูลนี้เป็นพื้นฐานของแผน"
              >
                <textarea
                  value={form.productHighlights}
                  onChange={(event) =>
                    updateField(
                      "productHighlights",
                      event.target.value
                    )
                  }
                  placeholder={
                    stepOneCopy.highlightsPlaceholder
                  }
                  style={textareaStyle}
                />
              </Field>

              <ChoiceSection
                title="ส่วนไหนที่ต้องการให้ Creator OS ช่วยมากที่สุด? (เลือกได้ไม่เกิน 3 ข้อ)"
                error={errors.supportNeeds}
              >
                {availableSupportNeedOptions.map(
                  (option) => (
                    <ChoiceCard
                      key={option.value}
                      selected={form.supportNeeds.includes(
                        option.value
                      )}
                      title={option.title}
                      description={option.description}
                      onClick={() =>
                        toggleSupportNeed(option.value)
                      }
                    />
                  )
                )}
              </ChoiceSection>

              <ChoiceSection
                title="น้ำเสียงหลักของคอนเทนต์"
                error={errors.tone}
              >
                {TONE_OPTIONS.map((option) => (
                  <ChoiceCard
                    key={option.value}
                    selected={form.tone === option.value}
                    title={option.title}
                    description={option.description}
                    onClick={() =>
                      updateField("tone", option.value)
                    }
                  />
                ))}
              </ChoiceSection>

              <Field
                label={stepOneCopy.concernsLabel}
                helpText="เว้นว่างได้ แต่ข้อมูลนี้ช่วยให้แผนตรงกับผู้ชมมากขึ้น"
              >
                <textarea
                  value={form.customerConcerns}
                  onChange={(event) =>
                    updateField(
                      "customerConcerns",
                      event.target.value
                    )
                  }
                  placeholder={
                    stepOneCopy.concernsPlaceholder
                  }
                  style={textareaStyle}
                />
              </Field>

              {form.planType === "creator" ? (
                <Field
                  label="รายละเอียดปัญหาหรือข้อจำกัดเพิ่มเติม"
                  helpText="เว้นว่างได้ เพราะทิศทางหลักถูกกำหนดจากตัวเลือกแล้ว ใช้ช่องนี้เฉพาะข้อมูลเฉพาะตัวที่ตัวเลือกยังบอกไม่ครบ"
                >
                  <textarea
                    value={form.creatorChallenge}
                    onChange={(event) =>
                      updateField(
                        "creatorChallenge",
                        event.target.value
                      )
                    }
                    placeholder="ตัวอย่าง: คิดเนื้อเรื่องและบทพูดไม่ออก ต้องการบทหนังพร้อมแบ่งฉาก ลำดับภาพ และตอนจบที่ถ่ายได้จริง"
                    style={textareaStyle}
                  />
                </Field>
              ) : null}

              <div style={fieldGridStyle}>
                <Field
                  label={stepOneCopy.detailsLabel}
                  helpText="เว้นว่างได้"
                >
                  <textarea
                    value={form.promotionDetails}
                    onChange={(event) =>
                      updateField(
                        "promotionDetails",
                        event.target.value
                      )
                    }
                    placeholder={
                      stepOneCopy.detailsPlaceholder
                    }
                    style={smallTextareaStyle}
                  />
                </Field>

                <Field
                  label={stepOneCopy.prohibitedLabel}
                  helpText="ช่วยป้องกันข้อมูลเกินจริงหรือข้อมูลที่ไม่ควรเปิดเผย"
                >
                  <textarea
                    value={form.prohibitedClaims}
                    onChange={(event) =>
                      updateField(
                        "prohibitedClaims",
                        event.target.value
                      )
                    }
                    placeholder={
                      stepOneCopy.prohibitedPlaceholder
                    }
                    style={smallTextareaStyle}
                  />
                </Field>
              </div>
            </>
          ) : null}
        </section>
      ) : null}

      {step === 2 ? (
        <section style={formSectionStyle}>
          <div style={sectionHeadingStyle}>
            <p style={sectionLabelStyle}>ขั้นที่ 2</p>

            <h2 style={sectionTitleStyle}>
              เลือกเป้าหมาย แพลตฟอร์ม และเวลาที่มี
            </h2>

            <p style={sectionDescriptionStyle}>
              ระบบจะปรับจำนวนงานและรูปแบบคอนเทนต์
              ให้ตรงกับความพร้อมของคุณ
            </p>
          </div>

          <ChoiceSection
            title="เป้าหมายหลักของคุณ"
            error={errors.goal}
          >
            {availableGoalOptions.map((option) => (
              <ChoiceCard
                key={option.value}
                selected={form.goal === option.value}
                title={option.title}
                description={option.description}
                onClick={() =>
                  selectGoal(option.value)
                }
              />
            ))}
          </ChoiceSection>

          <ChoiceSection
            title="หลังดูคอนเทนต์แล้ว อยากให้ผู้ชมทำอะไรต่อเป็นหลัก?"
            error={errors.desiredAction}
          >
            {availableDesiredActionOptions.map((option) => (
              <ChoiceCard
                key={option.value}
                selected={
                  form.desiredAction === option.value
                }
                title={option.title}
                description={option.description}
                onClick={() =>
                  updateField(
                    "desiredAction",
                    option.value
                  )
                }
              />
            ))}
          </ChoiceSection>

          <ChoiceSection
            title="คุณจะโพสต์ที่แพลตฟอร์มไหน?"
            error={errors.platform}
          >
            {PLATFORM_OPTIONS.map((option) => (
              <ChoiceCard
                key={option.value}
                selected={form.platform === option.value}
                title={option.title}
                description={option.description}
                onClick={() =>
                  updateField("platform", option.value)
                }
              />
            ))}
          </ChoiceSection>

          <ChoiceSection
            title="คุณมีเวลาทำคอนเทนต์วันละประมาณเท่าไร?"
            error={errors.dailyTime}
          >
            {TIME_OPTIONS.map((option) => (
              <ChoiceCard
                key={option.value}
                selected={form.dailyTime === option.value}
                title={option.title}
                description={option.description}
                onClick={() =>
                  updateField("dailyTime", option.value)
                }
              />
            ))}
          </ChoiceSection>

          <section style={choiceSectionStyle}>
            <h3 style={choiceSectionTitleStyle}>
              คุณสามารถทำอะไรได้บ้าง?
            </h3>

            <p style={choiceHelpTextStyle}>
              เลือกได้มากกว่า 1 ข้อ
              ระบบจะไม่สร้างงานที่เกินความสามารถของคุณ
            </p>

            {errors.capabilities ? (
              <p style={errorTextStyle}>
                {errors.capabilities}
              </p>
            ) : null}

            <div style={capabilityGridStyle}>
              {availableCapabilityOptions.map((option) => {
                const selected =
                  form.capabilities.includes(option.value);

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      toggleCapability(option.value)
                    }
                    style={
                      selected
                        ? selectedCapabilityStyle
                        : capabilityStyle
                    }
                  >
                    <span style={checkboxStyle}>
                      {selected ? "✓" : ""}
                    </span>

                    <span>{option.title}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </section>
      ) : null}

      {step === 3 ? (
        <section style={formSectionStyle}>
          <div style={sectionHeadingStyle}>
            <p style={sectionLabelStyle}>ขั้นที่ 3</p>

            <h2 style={sectionTitleStyle}>
              ตรวจข้อมูลก่อนสร้างแผน
            </h2>

            <p style={sectionDescriptionStyle}>
              แผนรุ่นนี้จะสร้างคอนเทนต์พร้อมทำ 7 วัน
              โดยใช้ข้อมูลด้านล่างเป็นหลัก
            </p>
          </div>

          <div style={summaryGridStyle}>
            <SummaryCard
              label="ประเภทแผน"
              value={
                PLAN_TYPE_OPTIONS.find(
                  (option) =>
                    option.value === form.planType
                )?.title || "-"
              }
            />

            <SummaryCard
              label="ทิศทางคอนเทนต์หลัก"
              value={getContentDirectionLabel(
                form.contentDirection
              )}
            />

            <SummaryCard
              label={
                stepOneCopy?.itemLabel.replace(
                  /\?$/,
                  ""
                ) || "หัวข้อหลัก"
              }
              value={form.productOrService}
            />

            <SummaryCard
              label={
                stepOneCopy?.audienceLabel.replace(
                  /\?$/,
                  ""
                ) || "กลุ่มเป้าหมาย"
              }
              value={form.audience}
            />

            <SummaryCard
              label="ผู้ชมรู้จักคุณในระดับ"
              value={
                form.audienceStage
                  ? AUDIENCE_STAGE_LABELS[
                      form.audienceStage
                    ]
                  : "-"
              }
            />

            <SummaryCard
              label="สิ่งหลักที่ผู้ชมควรได้รับ"
              value={
                form.audienceValue
                  ? AUDIENCE_VALUE_LABELS[
                      form.audienceValue
                    ]
                  : "-"
              }
            />

            <SummaryCard
              label="สิ่งที่ต้องการให้ระบบช่วย"
              value={
                form.supportNeeds
                  .map(
                    (need) =>
                      SUPPORT_NEED_LABELS[need]
                  )
                  .join(", ") || "-"
              }
            />

            <SummaryCard
              label="น้ำเสียงหลัก"
              value={
                form.tone
                  ? TONE_LABELS[form.tone]
                  : "-"
              }
            />

            <SummaryCard
              label="เป้าหมาย"
              value={
                availableGoalOptions.find(
                  (option) =>
                    option.value === form.goal
                )?.title || "-"
              }
            />

            <SummaryCard
              label="สิ่งที่อยากให้ผู้ชมทำต่อ"
              value={
                form.desiredAction
                  ? DESIRED_ACTION_LABELS[
                      form.desiredAction
                    ]
                  : "-"
              }
            />

            <SummaryCard
              label="แพลตฟอร์ม"
              value={
                PLATFORM_OPTIONS.find(
                  (option) =>
                    option.value === form.platform
                )?.title || "-"
              }
            />

            <SummaryCard
              label="เวลาที่มี"
              value={
                TIME_OPTIONS.find(
                  (option) =>
                    option.value === form.dailyTime
                )?.title || "-"
              }
            />

            <SummaryCard
              label="สิ่งที่สามารถทำได้"
              value={
                form.capabilities
                  .map(
                    (capability) =>
                      availableCapabilityOptions.find(
                        (option) =>
                          option.value === capability
                      )?.title
                  )
                  .filter(Boolean)
                  .join(", ") || "-"
              }
            />
          </div>

          <article style={largeSummaryCardStyle}>
            <p style={summaryLabelStyle}>
              {stepOneCopy?.highlightsLabel ||
                "จุดเด่นหรือแนวทางหลัก"}
            </p>

            <p style={preserveTextStyle}>
              {form.productHighlights || "-"}
            </p>
          </article>

          <article style={largeSummaryCardStyle}>
            <p style={summaryLabelStyle}>
              {stepOneCopy?.concernsLabel ||
                "ข้อกังวลหรือความสนใจของกลุ่มเป้าหมาย"}
            </p>

            <p style={preserveTextStyle}>
              {form.customerConcerns ||
                "ยังไม่ได้ระบุ ระบบจะใช้แนวคำถามทั่วไปโดยไม่แต่งข้อมูลเพิ่มเติม"}
            </p>
          </article>

          {form.planType === "creator" ? (
            <article style={largeSummaryCardStyle}>
              <p style={summaryLabelStyle}>
                รายละเอียดปัญหาหรือข้อจำกัดเพิ่มเติม
              </p>

              <p style={preserveTextStyle}>
                {form.creatorChallenge || "ไม่ได้ระบุ"}
              </p>
            </article>
          ) : null}

          <article style={largeSummaryCardStyle}>
            <p style={summaryLabelStyle}>
              {stepOneCopy?.detailsLabel ||
                "รายละเอียดเพิ่มเติม"}
            </p>

            <p style={preserveTextStyle}>
              {form.promotionDetails || "ไม่ได้ระบุ"}
            </p>
          </article>

          <article style={largeSummaryCardStyle}>
            <p style={summaryLabelStyle}>
              {stepOneCopy?.prohibitedLabel ||
                "สิ่งที่ห้ามกล่าวหรือเปิดเผย"}
            </p>

            <p style={preserveTextStyle}>
              {form.prohibitedClaims || "ไม่ได้ระบุ"}
            </p>
          </article>

          <article style={resultPreviewStyle}>
            <p style={resultPreviewLabelStyle}>
              สิ่งที่คุณจะได้รับ
            </p>

            <h3 style={resultPreviewTitleStyle}>
              แผนคอนเทนต์พร้อมทำครบ 7 วัน
            </h3>

            <div style={resultFeatureGridStyle}>
              {[
                "เป้าหมายและหลักการของแต่ละวัน",
                "หัวข้อและประโยคเปิด",
                "บทพูดหรือเนื้อหาพร้อมใช้",
                "ลำดับการถ่ายและข้อความบนจอ",
                "แคปชัน คำปิด และแฮชแท็ก",
                "เวลาโพสต์แบบเริ่มต้นทดลอง",
                "แผนสำรองเมื่อทำคลิปไม่ได้",
                "งานหลังโพสต์และตัวอย่างตอบความคิดเห็น",
                "ตัวชี้วัดที่ควรบันทึก",
              ].map((item) => (
                <div
                  key={item}
                  style={resultFeatureStyle}
                >
                  ✓ {item}
                </div>
              ))}
            </div>
          </article>
        </section>
      ) : null}

      <section style={actionBarStyle}>
        <div>
          {step > 1 ? (
            <button
              type="button"
              onClick={goBack}
              style={backButtonStyle}
            >
              ย้อนกลับ
            </button>
          ) : (
            <button
              type="button"
              onClick={resetForm}
              style={resetButtonStyle}
            >
              ล้างข้อมูล
            </button>
          )}
        </div>

        <div>
          {step < 3 ? (
            <button
              type="button"
              onClick={goNext}
              style={nextButtonStyle}
            >
              ขั้นตอนถัดไป
            </button>
          ) : (
            <button
              type="button"
              onClick={createPlan}
              style={createButtonStyle}
            >
              ไปตรวจข้อมูลและชำระเงิน
            </button>
          )}
        </div>
      </section>
    </main>
  );
}

type FieldProps = {
  label: string;
  required?: boolean;
  helpText?: string;
  error?: string;
  children: React.ReactNode;
};

function Field({
  label,
  required,
  helpText,
  error,
  children,
}: FieldProps) {
  return (
    <label style={fieldStyle}>
      <span style={fieldLabelStyle}>
        {label}

        {required ? (
          <span style={requiredStyle}> *</span>
        ) : null}
      </span>

      {helpText ? (
        <span style={helpTextStyle}>{helpText}</span>
      ) : null}

      {children}

      {error ? (
        <span style={errorTextStyle}>{error}</span>
      ) : null}
    </label>
  );
}

type ChoiceSectionProps = {
  title: string;
  error?: string;
  children: React.ReactNode;
};

function ChoiceSection({
  title,
  error,
  children,
}: ChoiceSectionProps) {
  return (
    <section style={choiceSectionStyle}>
      <h3 style={choiceSectionTitleStyle}>{title}</h3>

      {error ? (
        <p style={errorTextStyle}>{error}</p>
      ) : null}

      <div style={choiceGridStyle}>{children}</div>
    </section>
  );
}

type ChoiceCardProps = {
  selected: boolean;
  title: string;
  description: string;
  onClick: () => void;
};

function ChoiceCard({
  selected,
  title,
  description,
  onClick,
}: ChoiceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={
        selected
          ? selectedChoiceCardStyle
          : choiceCardStyle
      }
    >
      <div style={choiceTopRowStyle}>
        <strong>{title}</strong>

        <span style={radioStyle}>
          {selected ? "●" : ""}
        </span>
      </div>

      <p style={choiceDescriptionStyle}>
        {description}
      </p>
    </button>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <article style={summaryCardStyle}>
      <p style={summaryLabelStyle}>{label}</p>
      <p style={summaryValueStyle}>{value}</p>
    </article>
  );
}

const pageStyle: CSSProperties = {
  maxWidth: "1050px",
  margin: "0 auto",
  padding: "24px",
};

const heroStyle: CSSProperties = {
  padding: "36px 24px",
  borderRadius: "28px",
  background:
    "linear-gradient(135deg, #111827 0%, #312e81 55%, #4f46e5 100%)",
  color: "white",
};

const heroLabelStyle: CSSProperties = {
  margin: 0,
  color: "#c7d2fe",
  fontWeight: 800,
};

const heroTitleStyle: CSSProperties = {
  margin: "12px 0",
  maxWidth: "800px",
  fontSize: "clamp(32px, 6vw, 48px)",
  lineHeight: 1.15,
};

const heroSubtitleStyle: CSSProperties = {
  margin: 0,
  maxWidth: "760px",
  color: "#e0e7ff",
  fontSize: "18px",
  lineHeight: 1.8,
};

const progressHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  marginTop: "24px",
  color: "#e0e7ff",
};

const progressOuterStyle: CSSProperties = {
  height: "10px",
  marginTop: "9px",
  overflow: "hidden",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.2)",
};

const progressInnerStyle: CSSProperties = {
  height: "100%",
  borderRadius: "999px",
  background: "white",
  transition: "width 0.2s ease",
};

const stepNavigationStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "10px",
  marginTop: "20px",
};

const stepItemStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "9px",
  padding: "14px",
  borderRadius: "16px",
  border: "1px solid #e5e7eb",
  background: "#f8fafc",
  color: "#64748b",
  fontWeight: 700,
};

const activeStepItemStyle: CSSProperties = {
  ...stepItemStyle,
  border: "2px solid #4f46e5",
  background: "#eef2ff",
  color: "#312e81",
};

const completedStepItemStyle: CSSProperties = {
  ...stepItemStyle,
  border: "1px solid #a7f3d0",
  background: "#ecfdf5",
  color: "#047857",
};

const stepNumberStyle: CSSProperties = {
  display: "inline-flex",
  width: "28px",
  height: "28px",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "999px",
  background: "white",
  border: "1px solid currentColor",
};

const formSectionStyle: CSSProperties = {
  marginTop: "20px",
  padding: "24px",
  borderRadius: "24px",
  border: "1px solid #e5e7eb",
  background: "white",
};

const sectionHeadingStyle: CSSProperties = {
  marginBottom: "22px",
};

const sectionLabelStyle: CSSProperties = {
  margin: 0,
  color: "#4f46e5",
  fontWeight: 800,
};

const sectionTitleStyle: CSSProperties = {
  margin: "7px 0",
  fontSize: "30px",
};

const sectionDescriptionStyle: CSSProperties = {
  margin: 0,
  color: "#475569",
  lineHeight: 1.7,
};

const fieldGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "16px",
};

const fieldStyle: CSSProperties = {
  display: "block",
  marginBottom: "18px",
};

const fieldLabelStyle: CSSProperties = {
  display: "block",
  marginBottom: "7px",
  color: "#111827",
  fontWeight: 800,
};

const requiredStyle: CSSProperties = {
  color: "#dc2626",
};

const helpTextStyle: CSSProperties = {
  display: "block",
  margin: "-2px 0 8px",
  color: "#64748b",
  fontSize: "14px",
  lineHeight: 1.5,
};

const inputStyle: CSSProperties = {
  width: "100%",
  minHeight: "46px",
  boxSizing: "border-box",
  padding: "11px 13px",
  borderRadius: "13px",
  border: "1px solid #cbd5e1",
  background: "white",
  fontSize: "16px",
};

const textareaStyle: CSSProperties = {
  width: "100%",
  minHeight: "130px",
  boxSizing: "border-box",
  padding: "12px 14px",
  borderRadius: "13px",
  border: "1px solid #cbd5e1",
  background: "white",
  fontSize: "16px",
  lineHeight: 1.7,
  resize: "vertical",
};

const smallTextareaStyle: CSSProperties = {
  ...textareaStyle,
  minHeight: "105px",
};

const errorTextStyle: CSSProperties = {
  display: "block",
  margin: "7px 0 0",
  color: "#dc2626",
  fontSize: "14px",
  fontWeight: 700,
};

const choiceSectionStyle: CSSProperties = {
  marginTop: "26px",
};

const choiceSectionTitleStyle: CSSProperties = {
  margin: "0 0 10px",
};

const choiceHelpTextStyle: CSSProperties = {
  margin: "-3px 0 12px",
  color: "#64748b",
};

const choiceGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "12px",
};

const choiceCardStyle: CSSProperties = {
  padding: "17px",
  textAlign: "left",
  borderRadius: "17px",
  border: "1px solid #e5e7eb",
  background: "#f8fafc",
  cursor: "pointer",
};

const selectedChoiceCardStyle: CSSProperties = {
  ...choiceCardStyle,
  border: "2px solid #4f46e5",
  background: "#eef2ff",
};

const choiceTopRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "10px",
};

const radioStyle: CSSProperties = {
  display: "inline-flex",
  width: "21px",
  height: "21px",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "999px",
  border: "1px solid #4f46e5",
  color: "#4f46e5",
};

const choiceDescriptionStyle: CSSProperties = {
  margin: "9px 0 0",
  color: "#475569",
  lineHeight: 1.6,
};

const capabilityGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "10px",
};

const capabilityStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "14px",
  textAlign: "left",
  borderRadius: "15px",
  border: "1px solid #e5e7eb",
  background: "#f8fafc",
  cursor: "pointer",
  fontWeight: 700,
};

const selectedCapabilityStyle: CSSProperties = {
  ...capabilityStyle,
  border: "2px solid #4f46e5",
  background: "#eef2ff",
  color: "#312e81",
};

const checkboxStyle: CSSProperties = {
  display: "inline-flex",
  width: "22px",
  height: "22px",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "6px",
  border: "1px solid #4f46e5",
  background: "white",
  color: "#4f46e5",
};

const summaryGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(230px, 1fr))",
  gap: "12px",
};

const summaryCardStyle: CSSProperties = {
  padding: "17px",
  borderRadius: "17px",
  border: "1px solid #e5e7eb",
  background: "#f8fafc",
};

const largeSummaryCardStyle: CSSProperties = {
  marginTop: "14px",
  padding: "18px",
  borderRadius: "18px",
  border: "1px solid #e5e7eb",
  background: "#f8fafc",
};

const summaryLabelStyle: CSSProperties = {
  margin: "0 0 7px",
  color: "#4f46e5",
  fontWeight: 800,
};

const summaryValueStyle: CSSProperties = {
  margin: 0,
  color: "#111827",
  lineHeight: 1.7,
};

const preserveTextStyle: CSSProperties = {
  margin: 0,
  color: "#334155",
  lineHeight: 1.7,
  whiteSpace: "pre-line",
};

const resultPreviewStyle: CSSProperties = {
  marginTop: "20px",
  padding: "22px",
  borderRadius: "22px",
  border: "1px solid #bbf7d0",
  background: "#f0fdf4",
};

const resultPreviewLabelStyle: CSSProperties = {
  margin: 0,
  color: "#15803d",
  fontWeight: 800,
};

const resultPreviewTitleStyle: CSSProperties = {
  margin: "8px 0 14px",
  color: "#14532d",
};

const resultFeatureGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "9px",
};

const resultFeatureStyle: CSSProperties = {
  padding: "10px 12px",
  borderRadius: "12px",
  background: "white",
  color: "#166534",
  lineHeight: 1.5,
};

const actionBarStyle: CSSProperties = {
  position: "sticky",
  bottom: "12px",
  zIndex: 10,
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  marginTop: "20px",
  padding: "14px",
  borderRadius: "18px",
  border: "1px solid #e5e7eb",
  background: "rgba(255,255,255,0.96)",
  boxShadow: "0 12px 30px rgba(15,23,42,0.12)",
};

const nextButtonStyle: CSSProperties = {
  padding: "12px 18px",
  borderRadius: "13px",
  border: "1px solid #4f46e5",
  background: "#4f46e5",
  color: "white",
  cursor: "pointer",
  fontWeight: 800,
};

const createButtonStyle: CSSProperties = {
  ...nextButtonStyle,
  background: "#047857",
  border: "1px solid #047857",
};

const backButtonStyle: CSSProperties = {
  padding: "12px 18px",
  borderRadius: "13px",
  border: "1px solid #cbd5e1",
  background: "white",
  color: "#111827",
  cursor: "pointer",
  fontWeight: 800,
};

const requestDirectionButtonStyle: CSSProperties = {
  ...backButtonStyle,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "fit-content",
  maxWidth: "100%",
  marginTop: "14px",
  textDecoration: "none",
  textAlign: "center",
  lineHeight: 1.35,
  boxSizing: "border-box",
  whiteSpace: "normal",
};

const resetButtonStyle: CSSProperties = {
  ...backButtonStyle,
  color: "#b91c1c",
};

