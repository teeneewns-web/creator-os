import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { premiumHooks } from "../../data/premium/hooks";
import { premiumScripts } from "../../data/premium/scripts";
import { premiumCaptions } from "../../data/premium/captions";
import { isValidPremiumSession } from "../../lib/premium-access";
import PremiumLibraryClient from "./PremiumLibraryClient";

const PREMIUM_COOKIE_NAME = "creator_os_premium";

export default async function PremiumLibraryPage() {
  const cookieStore = await cookies();
  const sessionValue =
    cookieStore.get(PREMIUM_COOKIE_NAME)?.value;

  if (!isValidPremiumSession(sessionValue)) {
    redirect("/premium-access");
  }

  return (
    <PremiumLibraryClient
      hooks={premiumHooks}
      scripts={premiumScripts}
      captions={premiumCaptions}
    />
  );
}