import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const ideasDirectory = path.join(
  projectRoot,
  "src",
  "data",
  "premium",
  "ideas"
);

const categoryFiles = [
  { file: "beauty.json", industry: "beauty" },
  { file: "education.json", industry: "education" },
  { file: "finance.json", industry: "finance" },
  { file: "food.json", industry: "food" },
  { file: "health.json", industry: "health" },
  { file: "real-estate.json", industry: "real-estate" },
  { file: "shopping.json", industry: "shopping" },
  { file: "technology.json", industry: "technology" },
  { file: "tiktok.json", industry: "tiktok" },
  { file: "youtube.json", industry: "youtube" },
];

const requiredStringFields = [
  "id",
  "title",
  "category",
  "industry",
  "tier",
  "goal",
  "audience",
  "tone",
  "format",
  "purpose",
  "difficulty",
  "idea",
  "angle",
  "whyItWorks",
  "contentPrompt",
  "status",
  "version",
];

const allowedDifficulties = new Set([
  "easy",
  "medium",
  "advanced",
]);

const allowedFormats = new Set([
  "short-video",
  "long-video",
  "carousel",
  "live",
  "post",
]);

const allowedPurposes = new Set([
  "awareness",
  "education",
  "engagement",
  "sales",
  "community",
  "authority",
]);

const allowedStatuses = new Set([
  "draft",
  "reviewed",
  "published",
]);

const errors = [];
const warnings = [];
const allItems = [];

function normalizeText(value) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[“”"'`]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function addError(location, message) {
  errors.push(`${location}: ${message}`);
}

function addWarning(location, message) {
  warnings.push(`${location}: ${message}`);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

for (const category of categoryFiles) {
  const filePath = path.join(ideasDirectory, category.file);

  if (!fs.existsSync(filePath)) {
    addError(category.file, "ไม่พบไฟล์");
    continue;
  }

  let items;

  try {
    const rawContent = fs.readFileSync(filePath, "utf8");
    items = JSON.parse(rawContent);
  } catch (error) {
    addError(
      category.file,
      `อ่าน JSON ไม่สำเร็จ — ${error.message}`
    );
    continue;
  }

  if (!Array.isArray(items)) {
    addError(category.file, "ข้อมูลระดับบนสุดต้องเป็น Array");
    continue;
  }

  if (items.length !== 20) {
    addError(
      category.file,
      `ต้องมี 20 รายการ แต่พบ ${items.length} รายการ`
    );
  }

  items.forEach((item, index) => {
    const itemNumber = String(index + 1).padStart(3, "0");
    const location =
      `${category.file} รายการที่ ${index + 1}`;
    const expectedId =
      `premium-idea-${category.industry}-${itemNumber}`;

    if (
      typeof item !== "object" ||
      item === null ||
      Array.isArray(item)
    ) {
      addError(location, "รายการต้องเป็น Object");
      return;
    }

    for (const field of requiredStringFields) {
      if (!isNonEmptyString(item[field])) {
        addError(location, `ฟิลด์ "${field}" ต้องเป็นข้อความและห้ามว่าง`);
      }
    }

    if (item.id !== expectedId) {
      addError(
        location,
        `ID ต้องเป็น "${expectedId}" แต่พบ "${item.id}"`
      );
    }

    if (item.industry !== category.industry) {
      addError(
        location,
        `industry ต้องเป็น "${category.industry}" แต่พบ "${item.industry}"`
      );
    }

    if (item.category !== "content-idea") {
      addError(
        location,
        `category ต้องเป็น "content-idea"`
      );
    }

    if (item.tier !== "premium") {
      addError(location, `tier ต้องเป็น "premium"`);
    }

    if (!allowedDifficulties.has(item.difficulty)) {
      addError(
        location,
        `difficulty ไม่ถูกต้อง: "${item.difficulty}"`
      );
    }

    if (!allowedFormats.has(item.format)) {
      addError(
        location,
        `format ไม่ถูกต้อง: "${item.format}"`
      );
    }

    if (!allowedPurposes.has(item.purpose)) {
      addError(
        location,
        `purpose ไม่ถูกต้อง: "${item.purpose}"`
      );
    }

    if (!allowedStatuses.has(item.status)) {
      addError(
        location,
        `status ไม่ถูกต้อง: "${item.status}"`
      );
    }

    if (
      typeof item.score !== "number" ||
      !Number.isFinite(item.score)
    ) {
      addError(location, "score ต้องเป็นตัวเลข");
    } else if (item.score < 0 || item.score > 100) {
      addError(
        location,
        `score ต้องอยู่ระหว่าง 0–100 แต่พบ ${item.score}`
      );
    } else if (item.score < 85) {
      addWarning(
        location,
        `score ต่ำกว่าเกณฑ์ Premium ที่แนะนำ: ${item.score}`
      );
    }

    if (
      !Array.isArray(item.platform) ||
      item.platform.length === 0
    ) {
      addError(
        location,
        "platform ต้องเป็น Array และมีอย่างน้อย 1 รายการ"
      );
    } else {
      item.platform.forEach((platform, platformIndex) => {
        if (!isNonEmptyString(platform)) {
          addError(
            location,
            `platform ลำดับ ${platformIndex + 1} ต้องเป็นข้อความ`
          );
        }
      });
    }

    if (
      !Array.isArray(item.executionSteps) ||
      item.executionSteps.length < 5
    ) {
      addError(
        location,
        "executionSteps ต้องมีอย่างน้อย 5 ขั้นตอน"
      );
    } else {
      item.executionSteps.forEach((step, stepIndex) => {
        if (!isNonEmptyString(step)) {
          addError(
            location,
            `executionSteps ลำดับ ${stepIndex + 1} ต้องเป็นข้อความ`
          );
        }
      });
    }

    if (
      !Array.isArray(item.notes) ||
      item.notes.length < 3
    ) {
      addError(
        location,
        "notes ต้องมีอย่างน้อย 3 รายการ"
      );
    } else {
      item.notes.forEach((note, noteIndex) => {
        if (!isNonEmptyString(note)) {
          addError(
            location,
            `notes ลำดับ ${noteIndex + 1} ต้องเป็นข้อความ`
          );
        }
      });
    }

    if (
      !Array.isArray(item.keywords) ||
      item.keywords.length < 8
    ) {
      addError(
        location,
        "keywords ต้องมีอย่างน้อย 8 คำ"
      );
    } else {
      const normalizedKeywords = item.keywords
        .filter(isNonEmptyString)
        .map(normalizeText);

      if (
        new Set(normalizedKeywords).size !==
        normalizedKeywords.length
      ) {
        addError(location, "พบ keyword ซ้ำภายในรายการเดียวกัน");
      }

      const hasThaiKeyword = item.keywords.some(
        (keyword) =>
          typeof keyword === "string" &&
          /[\u0E00-\u0E7F]/.test(keyword)
      );

      const hasEnglishKeyword = item.keywords.some(
        (keyword) =>
          typeof keyword === "string" &&
          /[A-Za-z]/.test(keyword)
      );

      if (!hasThaiKeyword) {
        addError(location, "keywords ต้องมีคำภาษาไทย");
      }

      if (!hasEnglishKeyword) {
        addError(location, "keywords ต้องมีคำภาษาอังกฤษ");
      }
    }

    if (
      typeof item.abTest !== "object" ||
      item.abTest === null ||
      Array.isArray(item.abTest)
    ) {
      addError(location, "abTest ต้องเป็น Object");
    } else {
      if (!isNonEmptyString(item.abTest.a)) {
        addError(location, `abTest.a ต้องเป็นข้อความและห้ามว่าง`);
      }

      if (!isNonEmptyString(item.abTest.b)) {
        addError(location, `abTest.b ต้องเป็นข้อความและห้ามว่าง`);
      }

      if (
        isNonEmptyString(item.abTest.a) &&
        isNonEmptyString(item.abTest.b) &&
        normalizeText(item.abTest.a) ===
          normalizeText(item.abTest.b)
      ) {
        addError(location, "abTest.a และ abTest.b ต้องแตกต่างกัน");
      }
    }

    if (
      isNonEmptyString(item.version) &&
      !/^\d+\.\d+\.\d+$/.test(item.version)
    ) {
      addError(
        location,
        `version ต้องอยู่ในรูปแบบ เช่น "1.0.0"`
      );
    }

    allItems.push({
      ...item,
      sourceFile: category.file,
      sourceIndex: index + 1,
    });
  });
}

if (allItems.length !== 200) {
  addError(
    "ข้อมูลทั้งหมด",
    `ต้องมี 200 รายการ แต่พบ ${allItems.length} รายการ`
  );
}

const seenIds = new Map();
const seenTitles = new Map();
const seenIdeas = new Map();

for (const item of allItems) {
  const location =
    `${item.sourceFile} รายการที่ ${item.sourceIndex}`;

  if (seenIds.has(item.id)) {
    addError(
      location,
      `ID ซ้ำกับ ${seenIds.get(item.id)} — "${item.id}"`
    );
  } else {
    seenIds.set(item.id, location);
  }

  if (isNonEmptyString(item.title)) {
    const normalizedTitle = normalizeText(item.title);

    if (seenTitles.has(normalizedTitle)) {
      addError(
        location,
        `ชื่อซ้ำกับ ${seenTitles.get(normalizedTitle)} — "${item.title}"`
      );
    } else {
      seenTitles.set(normalizedTitle, location);
    }
  }

  if (isNonEmptyString(item.idea)) {
    const normalizedIdea = normalizeText(item.idea);

    if (seenIdeas.has(normalizedIdea)) {
      addError(
        location,
        `แนวคิดซ้ำกับ ${seenIdeas.get(normalizedIdea)}`
      );
    } else {
      seenIdeas.set(normalizedIdea, location);
    }
  }
}

console.log("\n========================================");
console.log(" Premium Ideas Data Validation");
console.log("========================================");
console.log(`ไฟล์ที่คาดหวัง: ${categoryFiles.length}`);
console.log(`รายการที่ตรวจพบ: ${allItems.length}`);
console.log(`ID ไม่ซ้ำ: ${seenIds.size}`);
console.log(`ชื่อไม่ซ้ำ: ${seenTitles.size}`);
console.log(`แนวคิดไม่ซ้ำแบบตรงตัว: ${seenIdeas.size}`);

if (warnings.length > 0) {
  console.log(`\nคำเตือน ${warnings.length} รายการ:`);

  warnings.forEach((warning, index) => {
    console.log(`${index + 1}. ${warning}`);
  });
}

if (errors.length > 0) {
  console.error(`\nไม่ผ่าน — พบข้อผิดพลาด ${errors.length} รายการ:`);

  errors.forEach((error, index) => {
    console.error(`${index + 1}. ${error}`);
  });

  console.error("\nกรุณาแก้ข้อผิดพลาดก่อน Build");
  process.exit(1);
}

console.log("\nผ่าน — ข้อมูล Premium Ideas ครบและโครงสร้างถูกต้อง");
console.log("พร้อมเข้าสู่ขั้นตอน Build");