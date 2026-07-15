import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const rootDir = process.cwd();

const premiumDir = path.join(
  rootDir,
  "src",
  "data",
  "premium",
  "ctas"
);

const expectedFiles = [
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

const allowedPurposes = new Set([
  "engagement",
  "education",
  "sales",
  "lead-generation",
  "traffic",
  "community",
]);

const allowedPlacements = new Set([
  "caption-end",
  "video-end",
  "mid-content",
  "pinned-comment",
  "bio",
]);

const allowedDifficulties = new Set([
  "easy",
  "medium",
  "advanced",
]);

const allowedStatuses = new Set([
  "draft",
  "reviewed",
  "published",
]);

const errors = [];
const warnings = [];
const allItems = [];
const ids = new Set();

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

function normalizeText(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function validateItem(item, fileName, index) {
  const location =
    fileName + "[" + index + "]";

  if (
    !item ||
    typeof item !== "object" ||
    Array.isArray(item)
  ) {
    addError(location + ": item must be an object");
    return;
  }

  const requiredTextFields = [
    "id",
    "title",
    "category",
    "industry",
    "goal",
    "audience",
    "tone",
    "cta",
    "context",
    "version",
  ];

  for (const field of requiredTextFields) {
    if (!isNonEmptyString(item[field])) {
      addError(
        location +
          ": missing or empty field " +
          field
      );
    }
  }

  if (item.tier !== "premium") {
    addError(
      location +
        ": tier must be premium"
    );
  }

  if (!allowedPurposes.has(item.purpose)) {
    addError(
      location +
        ": invalid purpose " +
        String(item.purpose)
    );
  }

  if (!allowedPlacements.has(item.placement)) {
    addError(
      location +
        ": invalid placement " +
        String(item.placement)
    );
  }

  if (!allowedDifficulties.has(item.difficulty)) {
    addError(
      location +
        ": invalid difficulty " +
        String(item.difficulty)
    );
  }

  if (!allowedStatuses.has(item.status)) {
    addError(
      location +
        ": invalid status " +
        String(item.status)
    );
  }

  if (item.status !== "reviewed") {
    addWarning(
      location +
        ": status is not reviewed"
    );
  }

  if (
    !Number.isFinite(item.score) ||
    item.score < 0 ||
    item.score > 100
  ) {
    addError(
      location +
        ": score must be between 0 and 100"
    );
  }

  if (!isNonEmptyStringArray(item.platform)) {
    addError(
      location +
        ": platform must be a non-empty string array"
    );
  }

  if (!isNonEmptyStringArray(item.notes)) {
    addError(
      location +
        ": notes must be a non-empty string array"
    );
  }

  if (!isNonEmptyStringArray(item.keywords)) {
    addError(
      location +
        ": keywords must be a non-empty string array"
    );
  }

  if (
    !item.abTest ||
    typeof item.abTest !== "object" ||
    !isNonEmptyString(item.abTest.a) ||
    !isNonEmptyString(item.abTest.b)
  ) {
    addError(
      location +
        ": abTest must contain non-empty a and b"
    );
  } else if (
    normalizeText(item.abTest.a) ===
    normalizeText(item.abTest.b)
  ) {
    addWarning(
      location +
        ": A/B test versions are identical"
    );
  }

  if (
    isNonEmptyString(item.cta) &&
    item.cta.trim().length < 12
  ) {
    addWarning(
      location +
        ": CTA may be too short"
    );
  }

  if (
    isNonEmptyString(item.context) &&
    item.context.trim().length < 20
  ) {
    addWarning(
      location +
        ": context may be too short"
    );
  }

  if (
    isNonEmptyString(item.id) &&
    ids.has(item.id)
  ) {
    addError(
      location +
        ": duplicate id " +
        item.id
    );
  }

  if (isNonEmptyString(item.id)) {
    ids.add(item.id);
  }

  allItems.push({
    ...item,
    sourceFile: fileName,
    sourceIndex: index,
  });
}

if (!fs.existsSync(premiumDir)) {
  addError(
    "Premium CTA directory not found: " +
      premiumDir
  );
} else {
  for (const fileName of expectedFiles) {
    const filePath = path.join(
      premiumDir,
      fileName
    );

    if (!fs.existsSync(filePath)) {
      addError(
        "Missing premium CTA file: " +
          fileName
      );
      continue;
    }

    let parsed;

    try {
      parsed = JSON.parse(
        fs.readFileSync(filePath, "utf8")
      );
    } catch (error) {
      addError(
        fileName +
          ": invalid JSON - " +
          error.message
      );
      continue;
    }

    if (!Array.isArray(parsed)) {
      addError(
        fileName +
          ": root value must be an array"
      );
      continue;
    }

    console.log(
      fileName + ": " + parsed.length
    );

    if (parsed.length !== 20) {
      addError(
        fileName +
          ": expected 20 items, found " +
          parsed.length
      );
    }

    parsed.forEach((item, index) => {
      validateItem(item, fileName, index);
    });
  }
}

const duplicateCtas = new Map();

for (const item of allItems) {
  if (!isNonEmptyString(item.cta)) {
    continue;
  }

  const normalized = normalizeText(item.cta);

  if (!duplicateCtas.has(normalized)) {
    duplicateCtas.set(normalized, []);
  }

  duplicateCtas.get(normalized).push(
    item.id || "unknown"
  );
}

for (const [text, itemIds] of duplicateCtas) {
  if (itemIds.length > 1) {
    addWarning(
      "Duplicate CTA text: " +
        itemIds.join(", ") +
        " / " +
        text
    );
  }
}

console.log("");
console.log(
  "Premium CTA files: " +
    expectedFiles.length
);

console.log(
  "Premium CTA assets: " +
    allItems.length
);

console.log(
  "Errors: " + errors.length
);

console.log(
  "Warnings: " + warnings.length
);

if (errors.length > 0) {
  console.log("");
  console.log("ERRORS");

  for (const error of errors) {
    console.log("- " + error);
  }
}

if (warnings.length > 0) {
  console.log("");
  console.log("WARNINGS");

  for (const warning of warnings) {
    console.log("- " + warning);
  }
}

console.log("");

if (errors.length === 0) {
  console.log("Result: PASS");
  process.exitCode = 0;
} else {
  console.log("Result: FAIL");
  process.exitCode = 1;
}