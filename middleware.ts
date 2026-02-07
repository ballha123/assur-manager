import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = "hedibensaad123456";
const encodedKey = new TextEncoder().encode(SECRET_KEY);

const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/api/auth/login",
  "/api/auth/register",
  "/signUp",
  "/signIn",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log(`🔒 Vérification Middleware : ${pathname}`);

  if (
    PUBLIC_ROUTES.some((route) => pathname.startsWith(route)) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("session_token")?.value;

  if (!token) {
    console.log("⛔ Accès refusé : Pas de token -> Redirection Login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    await jwtVerify(token, encodedKey);
    return NextResponse.next();
  } catch (error) {
    console.log("❌ Token invalide -> Redirection Login");
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("session_token");
    return response;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
