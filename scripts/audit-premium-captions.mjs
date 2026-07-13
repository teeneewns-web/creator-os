import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);
const projectRoot = path.resolve(
  currentDirectory,
  ".."
);

const captionsDirectory = path.join(
  projectRoot,
  "src",
  "data",
  "premium",
  "captions"
);

const expectedFiles = [
  {
    file: "beauty.json",
    industry: "beauty",
  },
  {
    file: "education.json",
    industry: "education",
  },
  {
    file: "finance.json",
    industry: "finance",
  },
  {
    file: "food.json",
    industry: "food",
  },
  {
    file: "health.json",
    industry: "health",
  },
  {
    file: "real-estate.json",
    industry: "real-estate",
  },
  {
    file: "shopping.json",
    industry: "shopping",
  },
  {
    file: "technology.json",
    industry: "technology",
  },
  {
    file: "tiktok.json",
    industry: "tiktok",
  },
  {
    file: "youtube.json",
    industry: "youtube",
  },
];

const validDifficulties = new Set([
  "easy",
  "medium",
  "advanced",
]);

const validLengths = new Set([
  "short",
  "medium",
  "long",
]);

const validPurposes = new Set([
  "engagement",
  "education",
  "sales",
  "storytelling",
  "community",
]);

const validStatuses = new Set([
  "draft",
  "reviewed",
  "published",
]);

const requiredStringFields = [
  "id",
  "title",
  "category",
  "industry",
  "goal",
  "audience",
  "tone",
  "purpose",
  "length",
  "difficulty",
  "opening",
  "caption",
  "cta",
  "status",
  "version",
];

const requiredStringArrayFields = [
  "platform",
  "hashtags",
  "keywords",
  "notes",
];

const riskyRules = [
  {
    name: "พบตัวเลขเปอร์เซ็นต์",
    pattern: /\d+\s*%/,
  },
  {
    name: "พบคำรับประกันผลลัพธ์",
    pattern:
      /รับประกัน|การันตี|ได้ผลแน่นอน|เห็นผลแน่นอน/,
  },
  {
    name: "พบคำกล่าวอ้างสุขภาพที่เสี่ยง",
    pattern:
      /รักษาหาย|หายขาด|วินิจฉัยโรค/,
  },
  {
    name: "พบคำกล่าวอ้างการเงินที่เสี่ยง",
    pattern:
      /กำไรแน่นอน|ไม่มีทางขาดทุน|รวยเร็ว/,
  },
];

const errors = [];
const warnings = [];

const seenIds = new Map();
const seenTitles = new Map();
const seenOpenings = new Map();
const seenCaptions = new Map();

let totalAssets = 0;

function addError(message) {
  errors.push(message);
}

function addWarning(message) {
  warnings.push(message);
}

function isNonEmptyString(value) {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
}

function isNonEmptyStringArray(value) {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(isNonEmptyString)
  );
}

function registerUniqueValue(
  map,
  value,
  label,
  source
) {
  const normalized = value
    .trim()
    .toLocaleLowerCase("th-TH");

  if (!normalized) {
    return;
  }

  if (map.has(normalized)) {
    addError(
      label +
        " ซ้ำระหว่าง " +
        map.get(normalized) +
        " และ " +
        source
    );

    return;
  }

  map.set(normalized, source);
}

function validateABTest(value, source) {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    addError(
      source +
        ": abTest ต้องเป็น object"
    );

    return;
  }

  if (!isNonEmptyString(value.a)) {
    addError(
      source +
        ": abTest.a ต้องเป็นข้อความ"
    );
  }

  if (!isNonEmptyString(value.b)) {
    addError(
      source +
        ": abTest.b ต้องเป็นข้อความ"
    );
  }
}

function checkRiskyClaims(item, source) {
  const claimText = [
    item.title,
    item.goal,
    item.opening,
    item.caption,
    item.cta,
    item.abTest?.a,
    item.abTest?.b,
    ...(Array.isArray(item.notes)
      ? item.notes
      : []),
  ]
    .filter(
      (value) => typeof value === "string"
    )
    .join(" ");

  const claimTextForRiskCheck = claimText
    .replace(
      /(?:ไม่ได้|มิได้|ไม่)\s*(?:รับประกัน|การันตี)/g,
      ""
    )
    .replace(
      /ไม่มี\s*การ\s*(?:รับประกัน|การันตี)/g,
      ""
    );

  for (const rule of riskyRules) {
    if (
      rule.pattern.test(claimTextForRiskCheck)
    ) {
      addWarning(
        source + ": " + rule.name
      );
    }
  }
}

function validateCaption(
  item,
  expectedIndustry,
  source
) {
  if (
    typeof item !== "object" ||
    item === null ||
    Array.isArray(item)
  ) {
    addError(
      source +
        ": รายการต้องเป็น object"
    );

    return;
  }

  for (const field of requiredStringFields) {
    if (!isNonEmptyString(item[field])) {
      addError(
        source +
          ": field " +
          field +
          " ต้องเป็นข้อความ"
      );
    }
  }

  for (
    const field of requiredStringArrayFields
  ) {
    if (!isNonEmptyStringArray(item[field])) {
      addError(
        source +
          ": field " +
          field +
          " ต้องเป็น array ที่มีข้อความ"
      );
    }
  }

  if (item.industry !== expectedIndustry) {
    addError(
      source +
        ": industry ต้องเป็น " +
        expectedIndustry
    );
  }

  if (item.tier !== "premium") {
    addError(
      source +
        ": tier ต้องเป็น premium"
    );
  }

  if (
    typeof item.score !== "number" ||
    !Number.isFinite(item.score) ||
    item.score < 0 ||
    item.score > 100
  ) {
    addError(
      source +
        ": score ต้องอยู่ระหว่าง 0 ถึง 100"
    );
  }

  if (
    !validDifficulties.has(
      item.difficulty
    )
  ) {
    addError(
      source +
        ": difficulty ไม่ถูกต้อง"
    );
  }

  if (!validLengths.has(item.length)) {
    addError(
      source +
        ": length ไม่ถูกต้อง"
    );
  }

  if (
    !validPurposes.has(item.purpose)
  ) {
    addError(
      source +
        ": purpose ไม่ถูกต้อง"
    );
  }

  if (!validStatuses.has(item.status)) {
    addError(
      source +
        ": status ไม่ถูกต้อง"
    );
  }

  validateABTest(item.abTest, source);

  if (isNonEmptyString(item.id)) {
    registerUniqueValue(
      seenIds,
      item.id,
      "ID",
      source
    );
  }

  if (isNonEmptyString(item.title)) {
    registerUniqueValue(
      seenTitles,
      item.title,
      "Title",
      source
    );
  }

  if (isNonEmptyString(item.opening)) {
    registerUniqueValue(
      seenOpenings,
      item.opening,
      "Opening",
      source
    );
  }

  if (isNonEmptyString(item.caption)) {
    registerUniqueValue(
      seenCaptions,
      item.caption,
      "Caption",
      source
    );
  }

  checkRiskyClaims(item, source);
}

if (!fs.existsSync(captionsDirectory)) {
  addError(
    "ไม่พบโฟลเดอร์ Premium Captions: " +
      captionsDirectory
  );
} else {
  for (const expected of expectedFiles) {
    const filePath = path.join(
      captionsDirectory,
      expected.file
    );

    if (!fs.existsSync(filePath)) {
      addError(
        "ไม่พบไฟล์ " + expected.file
      );

      continue;
    }

    let parsedData;

    try {
      const rawContent = fs.readFileSync(
        filePath,
        "utf8"
      );

      parsedData = JSON.parse(
        rawContent.replace(/^\uFEFF/, "")
      );
    } catch (error) {
      addError(
        expected.file +
          ": อ่าน JSON ไม่สำเร็จ - " +
          error.message
      );

      continue;
    }

    if (!Array.isArray(parsedData)) {
      addError(
        expected.file +
          ": ข้อมูลต้องเป็น array"
      );

      continue;
    }

    console.log(
      expected.file +
        ": " +
        String(parsedData.length)
    );

    totalAssets += parsedData.length;

    parsedData.forEach((item, index) => {
      validateCaption(
        item,
        expected.industry,
        expected.file +
          "[" +
          String(index) +
          "]"
      );
    });
  }
}

console.log("");
console.log(
  "Premium caption assets: " +
    String(totalAssets)
);
console.log(
  "Errors: " + String(errors.length)
);
console.log(
  "Warnings: " +
    String(warnings.length)
);

if (errors.length > 0) {
  console.log("");
  console.log("ERROR DETAILS");

  errors.forEach((message, index) => {
    console.log(
      String(index + 1) +
        ". " +
        message
    );
  });
}

if (warnings.length > 0) {
  console.log("");
  console.log("WARNING DETAILS");

  warnings.forEach((message, index) => {
    console.log(
      String(index + 1) +
        ". " +
        message
    );
  });
}

console.log("");

if (errors.length > 0) {
  console.log("Result: FAIL");
  process.exitCode = 1;
} else {
  console.log("Result: PASS");
}