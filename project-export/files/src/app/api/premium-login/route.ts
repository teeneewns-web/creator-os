import { NextResponse } from "next/server";
import { createPremiumSessionToken } from "../../../lib/premium-access";

const PREMIUM_COOKIE_NAME = "creator_os_premium";

export async function POST(request: Request) {
  const formData = await request.formData();

  const submittedCode = String(
    formData.get("accessCode") || ""
  ).trim();

  const correctCode = process.env.PREMIUM_ACCESS_CODE;

  if (!correctCode || submittedCode !== correctCode) {
    return NextResponse.redirect(
      new URL("/premium-access?error=invalid", request.url),
      303
    );
  }

  const response = NextResponse.redirect(
    new URL("/premium-library", request.url),
    303
  );

  response.cookies.set({
    name: PREMIUM_COOKIE_NAME,
    value: createPremiumSessionToken(),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}