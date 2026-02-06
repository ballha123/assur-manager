import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import db from "@/src/lib/db";

interface Agent {
  id: number;
  email: string;
  password: string;
}

const SECRET_KEY = "hedibensaad123456";
const encodedKey = new TextEncoder().encode(SECRET_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const user = db
      .prepare("SELECT * FROM User WHERE email = ?")
      .get(email) as Agent;

    if (!user) {
      return NextResponse.json({ error: "Email inconnu" }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Mot de passe incorrect" },
        { status: 401 },
      );
    }

    const token = await new SignJWT({
      id: user.id,
      email: user.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(encodedKey);

    (await cookies()).set("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 2,
      path: "/",
      sameSite: "strict",
    });

    return NextResponse.json({ success: true, message: "Connecté !" });
  } catch (error) {
    console.error("Erreur Login:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
