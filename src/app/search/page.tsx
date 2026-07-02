import fs from "fs";
import path from "path";
import SearchClient from "./SearchClient";
import { contentLibraries } from "../../data/content/contentLibraries";

type HookItem = {
  id: number | string;
  text?: string;
  hook?: string;
  title?: string;
  type?: string;
  emotion?: string;
  platform?: string;
  language?: string;
};

type SearchItem = {
  id: string;
  source: string;
  category: string;
  text: string;
  title?: string;
  description?: string;
  type?: string;
  emotion?: string;
  platform?: string;
  language?: string;
  href: string;
};

const hookCategories = ["beauty", "finance", "gaming"];

function getHookText(item: HookItem) {
  return item.text || item.hook || item.title || "";
}

function loadHookItems() {
  const items: SearchItem[] = [];

  hookCategories.forEach((category) => {
    const filePath = path.join(
      process.cwd(),
      "src",
      "data",
      "hooks",
      category + ".json"
    );

    if (!fs.existsSync(filePath)) return;

    const fileContent = fs.readFileSync(filePath, "utf8");
    const hooks: HookItem[] = JSON.parse(fileContent);

    hooks.forEach((item, index) => {
      const text = getHookText(item);

      if (!text) return;

      items.push({
        id: "hook-" + category + "-" + String(item.id || index),
        source: "hooks",
        category,
        text,
        title: "Hook - " + category,
        type: item.type,
        emotion: item.emotion,
        platform: item.platform,
        language: item.language,
        href: "/hooks/" + category,
      });
    });
  });

  return items;
}

function loadContentLibraryItems() {
  const items: SearchItem[] = [];

  Object.entries(contentLibraries).forEach(([libraryKey, library]) => {
    library.sections.forEach((section, sectionIndex) => {
      section.examples.forEach((example, exampleIndex) => {
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
          text: example.text,
          href: "/" + libraryKey,
        });
      });
    });
  });

  return items;
}

export default function SearchPage() {
  const items = [...loadHookItems(), ...loadContentLibraryItems()];

  return <SearchClient items={items} />;
}