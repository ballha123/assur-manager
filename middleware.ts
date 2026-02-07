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

  // 1. Autoriser explicitement les routes publiques et fichiers statiques
  if (
    PUBLIC_ROUTES.some((route) => pathname.startsWith(route)) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("session_token")?.value;

  // 2. Redirection si pas de token
  if (!token) {
    console.log(`⛔ Accès refusé [${pathname}] : Redirection Login`);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    await jwtVerify(token, encodedKey);
    return NextResponse.next();
  } catch (error) {
    console.log("❌ Token invalide -> Suppression et Redirection");
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("session_token");
    return response;
  }
}

// MISE À JOUR : On exclut api/auth du matcher pour éviter le bug "resp.body?.cancel"
export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
