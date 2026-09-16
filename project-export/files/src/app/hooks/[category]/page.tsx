import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import HookCategoryClient, {
  type HookDisplayItem,
} from "../../../components/hooks/HookCategoryClient";
import {
  hookCategories,
  hookCategoryList,
} from "../../../data/hooks/hookCategories";
import {
  auditHookQuality,
  getQualityLevelLabel,
  type RawHookItem,
} from "../../../lib/content/auditHookQuality";

type HookCategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

export function generateStaticParams() {
  return hookCategoryList.map((category) => {
    return {
      category: category.slug,
    };
  });
}

function getHookText(item: RawHookItem) {
  return item.text || item.hook || item.title || "";
}

function loadHooks(category: string) {
  const filePath = path.join(
    process.cwd(),
    "src",
    "data",
    "hooks",
    category + ".json"
  );

  if (!fs.existsSync(filePath)) {
    return [];
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const hooks: RawHookItem[] = JSON.parse(fileContent);

  return hooks;
}

export default async function HookCategoryPage({
  params,
}: HookCategoryPageProps) {
  const resolvedParams = await params;
  const category = resolvedParams.category;

  const categoryData = hookCategories[category as keyof typeof hookCategories];

  if (!categoryData) {
    notFound();
  }

  const hooks = loadHooks(category);

  const displayHooks: HookDisplayItem[] = hooks.map((item, index) => {
    const audit = auditHookQuality(item, index + 1);

    return {
      id: String(item.id || index),
      text: getHookText(item),
      type: item.type,
      emotion: item.emotion,
      platform: item.platform,
      language: item.language,
      level: audit.level,
      score: audit.score,
      levelLabel: getQualityLevelLabel(audit.level),
      rewriteText: audit.rewriteText,
    };
  });

  return <HookCategoryClient categoryData={categoryData} hooks={displayHooks} />;
}
