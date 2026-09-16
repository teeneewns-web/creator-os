import fs from "fs";
import path from "path";

const projectRoot = process.cwd();

const scriptsDirectory = path.join(
  projectRoot,
  "src",
  "data",
  "premium",
  "scripts"
);

const scriptFiles = [
  "beauty.json",
  "education.json",
  "finance.json",
  "food.json",
  "health.json",
  "real-estate.json",
  "shopping.json",
  "technology.json",
  "tiktok.json",
  "youtube.json",
];

const validDifficulties = [
  "easy",
  "medium",
  "advanced",
];

const validFormats = [
  "short-form",
  "long-form",
  "carousel",
  "live",
];

const validStatuses = [
  "draft",
  "reviewed",
  "published",
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

const allIds = new Map();
const allTitles = new Map();
const allHooks = new Map();

const countByFile = new Map();

function addError(fileName, itemIndex, message) {
  errors.push(
    fileName +
      " รายการที่ " +
      String(itemIndex + 1) +
      ": " +
      message
  );
}

function addWarning(fileName, itemIndex, message) {
  warnings.push(
    fileName +
      " รายการที่ " +
      String(itemIndex + 1) +
      ": " +
      message
  );
}

function isNonEmptyString(value) {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
}

function isStringArray(value) {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (item) =>
        typeof item === "string" &&
        item.trim().length > 0
    )
  );
}

function normalizeText(value) {
  return value
    .trim()
    .toLocaleLowerCase("th-TH")
    .replace(/\s+/g, " ");
}

function getExpectedIndustry(fileName) {
  return fileName.replace(".json", "");
}

function validateSections(
  sections,
  fileName,
  itemIndex
) {
  if (!Array.isArray(sections)) {
    addError(
      fileName,
      itemIndex,
      "sections ต้องเป็น Array"
    );

    return;
  }

  if (sections.length === 0) {
    addError(
      fileName,
      itemIndex,
      "sections ต้องมีอย่างน้อย 1 ส่วน"
    );

    return;
  }

  sections.forEach((section, sectionIndex) => {
    if (
      typeof section !== "object" ||
      section === null ||
      Array.isArray(section)
    ) {
      addError(
        fileName,
        itemIndex,
        "sections ลำดับที่ " +
          String(sectionIndex + 1) +
          " ต้องเป็น Object"
      );

      return;
    }

    if (!isNonEmptyString(section.label)) {
      addError(
        fileName,
        itemIndex,
        "sections ลำดับที่ " +
          String(sectionIndex + 1) +
          " ไม่มี label"
      );
    }

    if (!isNonEmptyString(section.text)) {
      addError(
        fileName,
        itemIndex,
        "sections ลำดับที่ " +
          String(sectionIndex + 1) +
          " ไม่มี text"
      );
    }

    if (
      section.visual !== undefined &&
      typeof section.visual !== "string"
    ) {
      addError(
        fileName,
        itemIndex,
        "visual ใน sections ลำดับที่ " +
          String(sectionIndex + 1) +
          " ต้องเป็นข้อความ"
      );
    }
  });
}

function validateABTest(
  abTest,
  fileName,
  itemIndex
) {
  if (
    typeof abTest !== "object" ||
    abTest === null ||
    Array.isArray(abTest)
  ) {
    addError(
      fileName,
      itemIndex,
      "abTest ต้องเป็น Object"
    );

    return;
  }

  if (!isNonEmptyString(abTest.a)) {
    addError(
      fileName,
      itemIndex,
      "abTest.a ห้ามว่าง"
    );
  }

  if (!isNonEmptyString(abTest.b)) {
    addError(
      fileName,
      itemIndex,
      "abTest.b ห้ามว่าง"
    );
  }

  if (
    isNonEmptyString(abTest.a) &&
    isNonEmptyString(abTest.b) &&
    normalizeText(abTest.a) ===
      normalizeText(abTest.b)
  ) {
    addWarning(
      fileName,
      itemIndex,
      "abTest.a และ abTest.b เหมือนกัน"
    );
  }
}

function collectClaimText(item) {
  const sectionText = Array.isArray(item.sections)
    ? item.sections
        .flatMap((section) => {
          if (
            typeof section !== "object" ||
            section === null
          ) {
            return [];
          }

          return [
            section.label,
            section.text,
            section.visual,
          ];
        })
        .filter(
          (value) => typeof value === "string"
        )
    : [];

  const noteText = Array.isArray(item.notes)
    ? item.notes.filter(
        (value) => typeof value === "string"
      )
    : [];

  return [
    item.title,
    item.goal,
    item.hook,
    item.cta,
    ...sectionText,
    ...noteText,
    item.abTest?.a,
    item.abTest?.b,
  ]
    .filter(
      (value) => typeof value === "string"
    )
    .join(" ");
}

function checkRiskyClaims(
  item,
  fileName,
  itemIndex
) {
  const claimText = collectClaimText(item);

  const claimTextForRiskCheck = claimText
    .replace(
      /(?:ไม่ได้|มิได้|ไม่)\s*(?:รับประกัน|การันตี)/g,
      ""
    )
    .replace(
      /ไม่มี\s*การ\s*(?:รับประกัน|การันตี)/g,
      ""
    );

  riskyRules.forEach((rule) => {
    if (rule.pattern.test(claimTextForRiskCheck)) {
      addWarning(
        fileName,
        itemIndex,
        rule.name
      );
    }
  });
}

function registerDuplicate(
  map,
  value,
  fileName,
  itemIndex,
  label
) {
  if (!isNonEmptyString(value)) {
    return;
  }

  const normalizedValue = normalizeText(value);
  const currentLocation =
    fileName +
    " รายการที่ " +
    String(itemIndex + 1);

  if (map.has(normalizedValue)) {
    addError(
      fileName,
      itemIndex,
      label +
        " ซ้ำกับ " +
        map.get(normalizedValue)
    );

    return;
  }

  map.set(normalizedValue, currentLocation);
}

function validateScript(
  item,
  fileName,
  itemIndex
) {
  if (
    typeof item !== "object" ||
    item === null ||
    Array.isArray(item)
  ) {
    addError(
      fileName,
      itemIndex,
      "ข้อมูลต้องเป็น Object"
    );

    return;
  }

  const expectedIndustry =
    getExpectedIndustry(fileName);

  if (!isNonEmptyString(item.id)) {
    addError(
      fileName,
      itemIndex,
      "ไม่มี id"
    );
  } else {
    registerDuplicate(
      allIds,
      item.id,
      fileName,
      itemIndex,
      "id"
    );

    if (
      !item.id.startsWith(
        expectedIndustry + "-"
      )
    ) {
      addWarning(
        fileName,
        itemIndex,
        "id ควรขึ้นต้นด้วย " +
          expectedIndustry +
          "-"
      );
    }
  }

  if (!isNonEmptyString(item.title)) {
    addError(
      fileName,
      itemIndex,
      "ไม่มี title"
    );
  } else {
    registerDuplicate(
      allTitles,
      item.title,
      fileName,
      itemIndex,
      "title"
    );
  }

  if (!isNonEmptyString(item.category)) {
    addError(
      fileName,
      itemIndex,
      "ไม่มี category"
    );
  }

  if (!isNonEmptyString(item.industry)) {
    addError(
      fileName,
      itemIndex,
      "ไม่มี industry"
    );
  } else if (
    normalizeText(item.industry) !==
    normalizeText(expectedIndustry)
  ) {
    addError(
      fileName,
      itemIndex,
      "industry ต้องเป็น " +
        expectedIndustry
    );
  }

  if (item.tier !== "premium") {
    addError(
      fileName,
      itemIndex,
      'tier ต้องเป็น "premium"'
    );
  }

  if (
    typeof item.score !== "number" ||
    !Number.isFinite(item.score)
  ) {
    addError(
      fileName,
      itemIndex,
      "score ต้องเป็นตัวเลข"
    );
  } else if (
    item.score < 0 ||
    item.score > 100
  ) {
    addError(
      fileName,
      itemIndex,
      "score ต้องอยู่ระหว่าง 0 ถึง 100"
    );
  }

  if (!isStringArray(item.platform)) {
    addError(
      fileName,
      itemIndex,
      "platform ต้องเป็น Array ที่มีข้อความ"
    );
  }

  if (!isNonEmptyString(item.goal)) {
    addError(
      fileName,
      itemIndex,
      "ไม่มี goal"
    );
  }

  if (!isNonEmptyString(item.audience)) {
    addError(
      fileName,
      itemIndex,
      "ไม่มี audience"
    );
  }

  if (!isNonEmptyString(item.tone)) {
    addError(
      fileName,
      itemIndex,
      "ไม่มี tone"
    );
  }

  if (!validFormats.includes(item.format)) {
    addError(
      fileName,
      itemIndex,
      "format ต้องเป็น short-form, long-form, carousel หรือ live"
    );
  }

  if (!isNonEmptyString(item.duration)) {
    addError(
      fileName,
      itemIndex,
      "ไม่มี duration"
    );
  }

  if (
    !validDifficulties.includes(
      item.difficulty
    )
  ) {
    addError(
      fileName,
      itemIndex,
      "difficulty ต้องเป็น easy, medium หรือ advanced"
    );
  }

  if (!isNonEmptyString(item.hook)) {
    addError(
      fileName,
      itemIndex,
      "ไม่มี hook"
    );
  } else {
    registerDuplicate(
      allHooks,
      item.hook,
      fileName,
      itemIndex,
      "hook"
    );
  }

  validateSections(
    item.sections,
    fileName,
    itemIndex
  );

  if (!isNonEmptyString(item.cta)) {
    addError(
      fileName,
      itemIndex,
      "ไม่มี cta"
    );
  }

  if (!isStringArray(item.notes)) {
    addError(
      fileName,
      itemIndex,
      "notes ต้องเป็น Array ที่มีข้อความ"
    );
  }

  if (!isStringArray(item.keywords)) {
    addError(
      fileName,
      itemIndex,
      "keywords ต้องเป็น Array ที่มีข้อความ"
    );
  }

  validateABTest(
    item.abTest,
    fileName,
    itemIndex
  );

  if (!validStatuses.includes(item.status)) {
    addError(
      fileName,
      itemIndex,
      "status ต้องเป็น draft, reviewed หรือ published"
    );
  }

  if (!isNonEmptyString(item.version)) {
    addError(
      fileName,
      itemIndex,
      "ไม่มี version"
    );
  }

  checkRiskyClaims(
    item,
    fileName,
    itemIndex
  );
}

scriptFiles.forEach((fileName) => {
  const filePath = path.join(
    scriptsDirectory,
    fileName
  );

  if (!fs.existsSync(filePath)) {
    errors.push(
      fileName + ": ไม่พบไฟล์"
    );

    countByFile.set(fileName, 0);

    return;
  }

  try {
    const fileContent = fs.readFileSync(
      filePath,
      "utf8"
    );

    const parsedData = JSON.parse(fileContent);

    if (!Array.isArray(parsedData)) {
      errors.push(
        fileName +
          ": ข้อมูลหลักต้องเป็น Array"
      );

      countByFile.set(fileName, 0);

      return;
    }

    countByFile.set(
      fileName,
      parsedData.length
    );

    parsedData.forEach((item, itemIndex) => {
      validateScript(
        item,
        fileName,
        itemIndex
      );
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : String(error);

    errors.push(
      fileName +
        ": อ่านหรือแปลง JSON ไม่สำเร็จ — " +
        message
    );

    countByFile.set(fileName, 0);
  }
});

const totalAssets = Array.from(
  countByFile.values()
).reduce(
  (total, count) => total + count,
  0
);

console.log("");
console.log("Premium Scripts Audit");
console.log("=====================");
console.log("");

scriptFiles.forEach((fileName) => {
  console.log(
    fileName +
      ": " +
      String(countByFile.get(fileName) ?? 0)
  );
});

console.log("");
console.log(
  "Premium script assets: " +
    String(totalAssets)
);
console.log(
  "Errors: " + String(errors.length)
);
console.log(
  "Warnings: " + String(warnings.length)
);
console.log("");

if (errors.length > 0) {
  console.log("ERRORS");
  console.log("------");

  errors.forEach((error) => {
    console.log("- " + error);
  });

  console.log("");
}

if (warnings.length > 0) {
  console.log("WARNINGS");
  console.log("--------");

  warnings.forEach((warning) => {
    console.log("- " + warning);
  });

  console.log("");
}

if (errors.length === 0) {
  console.log("Result: PASS");
} else {
  console.log("Result: FAIL");
  process.exitCode = 1;
}