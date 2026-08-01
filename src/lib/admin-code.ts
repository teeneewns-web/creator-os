import "server-only";

import { timingSafeEqual } from "crypto";

function getAdminCode() {
  return (
    process.env.CREATOR_OS_ADMIN_CODE ||
    process.env.PREMIUM_ACCESS_CODE ||
    ""
  );
}

export function isValidAdminCode(
  submittedCode: string
) {
  const expectedCode = getAdminCode();

  if (!submittedCode || !expectedCode) {
    return false;
  }

  const received = Buffer.from(submittedCode);
  const expected = Buffer.from(expectedCode);

  if (received.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(received, expected);
}
