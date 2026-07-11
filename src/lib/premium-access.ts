import "server-only";

import { createHmac, timingSafeEqual } from "crypto";

const SESSION_MESSAGE = "creator-os-premium-access-v1";

function getSessionSecret(): string {
  const secret = process.env.PREMIUM_SESSION_SECRET;

  if (!secret) {
    throw new Error(
      "Missing PREMIUM_SESSION_SECRET in .env.local"
    );
  }

  return secret;
}

export function createPremiumSessionToken(): string {
  return createHmac("sha256", getSessionSecret())
    .update(SESSION_MESSAGE)
    .digest("hex");
}

export function isValidPremiumSession(
  receivedToken?: string
): boolean {
  if (!receivedToken) {
    return false;
  }

  const expectedToken = createPremiumSessionToken();
  const receivedBuffer = Buffer.from(receivedToken);
  const expectedBuffer = Buffer.from(expectedToken);

  if (receivedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(receivedBuffer, expectedBuffer);
}