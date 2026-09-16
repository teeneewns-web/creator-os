import fs from "fs";
import path from "path";

const rootDirectory = process.cwd();

const premiumDirectory = path.join(
  rootDirectory,
  "src",
  "data",
  "premium",
  "hooks"
);

const freeDirectory = path.join(
  rootDirectory,
  "src",
  "data",
  "hooks"
);

const reportDirectory = path.join(
  rootDirectory,
  "reports"
);

const reportPath = path.join(
  reportDirectory,
  "premium-qa-report.json"
);

const requiredTextFields = [
  "id",
  "title",
  "hook",
  "category",
  "industry",
  "goal",
  "emotion",
  "difficulty",
  "why",
  "script",
  "cta",
  "status",
  "version",
];

const validDifficulties = [
  "easy",
  "medium",
  "advanced",
];

const validStatuses = [
  "draft",
  "reviewed",
  "published",
];

function getJsonFiles(directory) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory, {
      withFileTypes: true,
    })
    .filter(function (entry) {
      return (
        entry.isFile() &&
        entry.name.toLowerCase().endsWith(".json")
      );
    })
    .map(function (entry) {
      return path.join(directory, entry.name);
    });
}

function readJsonArray(filePath, errors) {
  try {
    const fileContent = fs.readFileSync(
      filePath,
      "utf8"
    );

    if (!fileContent.trim()) {
      errors.push({
        file: path.relative(
          rootDirectory,
          filePath
        ),
        issue: "ไฟล์ JSON ว่างเปล่า ควรใส่ []",
      });

      return [];
    }

    const parsedData = JSON.parse(fileContent);

    if (!Array.isArray(parsedData)) {
      errors.push({
        file: path.relative(
          rootDirectory,
          filePath
        ),
        issue: "ข้อมูลระดับบนสุดต้องเป็น Array",
      });

      return [];
    }

    return parsedData;
  } catch (error) {
    errors.push({
      file: path.relative(
        rootDirectory,
        filePath
      ),
      issue: "JSON ไม่ถูกต้อง",
      detail:
        error instanceof Error
          ? error.message
          : String(error),
    });

    return [];
  }
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
    value.every(function (item) {
      return isNonEmptyString(item);
    })
  );
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(
      /[\s"'`.,!?…:;()[\]{}\-_/\\]+/g,
      ""
    )
    .trim();
}

function validatePremiumAsset(
  item,
  filePath,
  index
) {
  const errors = [];
  const warnings = [];

  const location = {
    file: path.relative(
      rootDirectory,
      filePath
    ),
    index: index,
    id:
      item &&
      typeof item === "object" &&
      typeof item.id === "string"
        ? item.id
        : "",
  };

  if (
    !item ||
    typeof item !== "object" ||
    Array.isArray(item)
  ) {
    errors.push({
      ...location,
      issue: "Asset ต้องเป็น Object",
    });

    return {
      errors: errors,
      warnings: warnings,
    };
  }

  requiredTextFields.forEach(function (field) {
    if (!isNonEmptyString(item[field])) {
      errors.push({
        ...location,
        field: field,
        issue:
          "ฟิลด์ " +
          field +
          " ต้องเป็นข้อความและห้ามว่าง",
      });
    }
  });

  if (item.tier !== "premium") {
    errors.push({
      ...location,
      field: "tier",
      issue: 'tier ต้องเป็น "premium"',
    });
  }

  if (
    typeof item.score !== "number" ||
    item.score < 0 ||
    item.score > 100
  ) {
    errors.push({
      ...location,
      field: "score",
      issue: "score ต้องเป็นตัวเลข 0 ถึง 100",
    });
  }

  if (
    !validDifficulties.includes(
      item.difficulty
    )
  ) {
    errors.push({
      ...location,
      field: "difficulty",
      issue:
        "difficulty ต้องเป็น easy, medium หรือ advanced",
    });
  }

  if (!validStatuses.includes(item.status)) {
    errors.push({
      ...location,
      field: "status",
      issue:
        "status ต้องเป็น draft, reviewed หรือ published",
    });
  }

  if (!isStringArray(item.platform)) {
    errors.push({
      ...location,
      field: "platform",
      issue:
        "platform ต้องเป็น Array และมีอย่างน้อยหนึ่งค่า",
    });
  }

  if (!isStringArray(item.keywords)) {
    errors.push({
      ...location,
      field: "keywords",
      issue:
        "keywords ต้องเป็น Array และมีอย่างน้อยหนึ่งค่า",
    });
  }

  if (
    !item.abTest ||
    typeof item.abTest !== "object" ||
    !isNonEmptyString(item.abTest.a) ||
    !isNonEmptyString(item.abTest.b)
  ) {
    errors.push({
      ...location,
      field: "abTest",
      issue:
        "abTest ต้องมีข้อความทั้ง a และ b",
    });
  }

  if (
    isNonEmptyString(item.hook) &&
    item.hook.trim().length < 25
  ) {
    warnings.push({
      ...location,
      field: "hook",
      issue: "Hook อาจสั้นเกินไป",
    });
  }

  if (
    isNonEmptyString(item.script) &&
    item.script.trim().length < 100
  ) {
    warnings.push({
      ...location,
      field: "script",
      issue: "Script อาจสั้นเกินไป",
    });
  }
const claimText = [
    item.title,
    item.hook,
    item.why,
    item.script,
    item.cta,
    item.abTest ? item.abTest.a : "",
    item.abTest ? item.abTest.b : "",
  ].join(" ");

  const claimTextForRiskCheck = claimText
    .replace(
      /(?:ไม่ได้|มิได้|ไม่)\s*(?:รับประกัน|การันตี)/g,
      ""
    )
    .replace(
      /ไม่มี\s*การ\s*(?:รับประกัน|การันตี)/g,
      ""
    );

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

  riskyRules.forEach(function (rule) {
    if (rule.pattern.test(claimTextForRiskCheck)) {
      warnings.push({
        ...location,
        issue: rule.name,
      });
    }
  });

  return {
    errors: errors,
    warnings: warnings,
  };
}

function getFreeHooks(errors) {
  const freeHooks = [];

  getJsonFiles(freeDirectory).forEach(
    function (filePath) {
      const items = readJsonArray(
        filePath,
        errors
      );

      items.forEach(function (item, index) {
        if (
          item &&
          typeof item === "object" &&
          !Array.isArray(item)
        ) {
          const text =
            item.hook ||
            item.text ||
            item.title ||
            "";

          if (isNonEmptyString(text)) {
            freeHooks.push({
              file: path.relative(
                rootDirectory,
                filePath
              ),
              index: index,
              text: text.trim(),
            });
          }
        }
      });
    }
  );

  return freeHooks;
}

function runAudit() {
  const errors = [];
  const warnings = [];
  const premiumAssets = [];

  const premiumFiles = getJsonFiles(
    premiumDirectory
  );

  premiumFiles.forEach(function (filePath) {
    const items = readJsonArray(
      filePath,
      errors
    );

    items.forEach(function (item, index) {
      const result = validatePremiumAsset(
        item,
        filePath,
        index
      );

      errors.push(...result.errors);
      warnings.push(...result.warnings);

      if (
        item &&
        typeof item === "object" &&
        !Array.isArray(item) &&
        isNonEmptyString(item.hook)
      ) {
        premiumAssets.push({
          file: path.relative(
            rootDirectory,
            filePath
          ),
          id: isNonEmptyString(item.id)
            ? item.id.trim()
            : "",
          hook: item.hook.trim(),
        });
      }
    });
  });

  const idMap = new Map();
  const hookMap = new Map();

  premiumAssets.forEach(function (asset) {
    if (asset.id) {
      if (idMap.has(asset.id)) {
        errors.push({
          issue: "พบ Premium ID ซ้ำ",
          id: asset.id,
          first: idMap.get(asset.id),
          duplicate: asset.file,
        });
      } else {
        idMap.set(asset.id, asset.file);
      }
    }

    const normalizedHook = normalizeText(
      asset.hook
    );

    if (normalizedHook) {
      if (hookMap.has(normalizedHook)) {
        errors.push({
          issue:
            "พบ Premium Hook ซ้ำแบบตรงกัน",
          hook: asset.hook,
          first: hookMap.get(normalizedHook),
          duplicate: asset.file,
        });
      } else {
        hookMap.set(
          normalizedHook,
          asset.file
        );
      }
    }
  });

  const freeErrors = [];
  const freeHooks = getFreeHooks(
    freeErrors
  );

  warnings.push(...freeErrors);

  const freeHookMap = new Map();

  freeHooks.forEach(function (item) {
    const normalized = normalizeText(
      item.text
    );

    if (
      normalized &&
      !freeHookMap.has(normalized)
    ) {
      freeHookMap.set(normalized, item);
    }
  });

  premiumAssets.forEach(function (asset) {
    const normalizedPremium =
      normalizeText(asset.hook);

    const freeMatch =
      freeHookMap.get(normalizedPremium);

    if (freeMatch) {
      errors.push({
        issue:
          "Premium Hook ซ้ำกับข้อมูล Free",
        premium: asset,
        free: freeMatch,
      });
    }
  });

  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      premiumFiles: premiumFiles.length,
      premiumAssets: premiumAssets.length,
      freeHooksCompared: freeHooks.length,
      errors: errors.length,
      warnings: warnings.length,
      passed: errors.length === 0,
    },
    errors: errors,
    warnings: warnings,
  };

  fs.mkdirSync(reportDirectory, {
    recursive: true,
  });

  fs.writeFileSync(
    reportPath,
    JSON.stringify(report, null, 2),
    "utf8"
  );

  console.log("");
  console.log("Premium QA Report");
  console.log("-----------------");
  console.log(
    "Premium files:",
    report.summary.premiumFiles
  );
  console.log(
    "Premium assets:",
    report.summary.premiumAssets
  );
  console.log(
    "Free hooks compared:",
    report.summary.freeHooksCompared
  );
  console.log(
    "Errors:",
    report.summary.errors
  );
  console.log(
    "Warnings:",
    report.summary.warnings
  );
  console.log(
    "Result:",
    report.summary.passed
      ? "PASS"
      : "FAIL"
  );
  console.log("");
  console.log(
    "Report:",
    path.relative(
      rootDirectory,
      reportPath
    )
  );

  if (errors.length > 0) {
    process.exitCode = 1;
  }
}

runAudit();