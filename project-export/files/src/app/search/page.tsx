import fs from "fs";
import path from "path";
import SearchClient, { type SearchItem } from "./SearchClient";
import { contentLibraries } from "../../data/content/contentLibraries";
import { hookCategoryList } from "../../data/hooks/hookCategories";
import {
  auditHookQuality,
  type RawHookItem,
} from "../../lib/content/auditHookQuality";

type HookItem = RawHookItem;

function getOptionalString(value: unknown): string | undefined {
  if (typeof value === "string") {
    const trimmedValue = value.trim();

    return trimmedValue || undefined;
  }

  if (Array.isArray(value)) {
    const text = value
      .filter(
        (item): item is string =>
          typeof item === "string" && item.trim().length > 0
      )
      .map((item) => item.trim())
      .join(", ");

    return text || undefined;
  }

  return undefined;
}

function getHookText(item: HookItem): string {
  return item.text || item.hook || item.title || "";
}

function loadHookItems(): SearchItem[] {
  const items: SearchItem[] = [];

  hookCategoryList.forEach((hookCategory) => {
    const category = hookCategory.slug;

    const filePath = path.join(
      process.cwd(),
      "src",
      "data",
      "hooks",
      category + ".json"
    );

    if (!fs.existsSync(filePath)) {
      return;
    }

    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const parsedData: unknown = JSON.parse(fileContent);

      if (!Array.isArray(parsedData)) {
        console.error(
          "ข้ามไฟล์ " +
            category +
            ".json เพราะข้อมูลไม่ได้อยู่ในรูปแบบ Array"
        );

        return;
      }

      const hooks = parsedData as HookItem[];

      hooks.forEach((item, index) => {
        const text = getHookText(item).trim();

        if (!text) {
          return;
        }

        const audit = auditHookQuality(item, index + 1);

        items.push({
          id:
            "hook-" +
            category +
            "-" +
            String(item.id ?? index),
          source: "hooks",
          category: hookCategory.label,
          text,
          title: hookCategory.title,
          description: hookCategory.description,
          type: getOptionalString(item.type),
          emotion: getOptionalString(item.emotion),
          platform: getOptionalString(item.platform),
          language: getOptionalString(item.language),
          level: audit.level,
          score: audit.score,
          href: hookCategory.href,
        });
      });
    } catch (error) {
      console.error(
        "ไม่สามารถโหลดไฟล์ " + category + ".json ได้",
        error
      );
    }
  });

  return items;
}

function loadContentLibraryItems(): SearchItem[] {
  const items: SearchItem[] = [];

  Object.entries(contentLibraries).forEach(
    ([libraryKey, library]) => {
      library.sections.forEach((section, sectionIndex) => {
        section.examples.forEach((example, exampleIndex) => {
          const text =
            typeof example.text === "string"
              ? example.text.trim()
              : "";

          if (!text) {
            return;
          }

          items.push({
            id:
              libraryKey +
              "-" +
              String(sectionIndex) +
              "-" +
              String(exampleIndex),
            source: libraryKey,
            category: section.title,
            title: library.label,
            description: section.description,
            text,
            href: "/" + libraryKey,
          });
        });
      });
    }
  );

  return items;
}

export default function SearchPage() {
  const items: SearchItem[] = [
    ...loadHookItems(),
    ...loadContentLibraryItems(),
  ];

  return <SearchClient items={items} />;
}