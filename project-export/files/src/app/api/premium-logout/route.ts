import { NextResponse } from "next/server";

const PREMIUM_COOKIE_NAME = "creator_os_premium";

export async function POST(request: Request) {
  const response = NextResponse.redirect(
    new URL("/premium-access", request.url),
    303
  );

  response.cookies.set({
    name: PREMIUM_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
}