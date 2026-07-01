import fs from "fs";
import path from "path";
import SearchClient from "./SearchClient";

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
  category: string;
  text: string;
  type?: string;
  emotion?: string;
  platform?: string;
  language?: string;
};

const categories = ["beauty", "finance", "gaming"];

function getHookText(item: HookItem) {
  return item.text || item.hook || item.title || "";
}

function loadHooks() {
  const allItems: SearchItem[] = [];

  categories.forEach((category) => {
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

      allItems.push({
        id: category + "-" + String(item.id || index),
        category,
        text,
        type: item.type,
        emotion: item.emotion,
        platform: item.platform,
        language: item.language,
      });
    });
  });

  return allItems;
}

export default function SearchPage() {
  const items = loadHooks();

  return <SearchClient items={items} />;
}