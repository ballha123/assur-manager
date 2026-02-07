import db from "@/src/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { error: "Corps de la requête invalide." },
        { status: 400 },
      );
    }

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe obligatoires." },
        { status: 400 },
      );
    }

    const { rows } = await db.execute({
      sql: "SELECT * FROM User WHERE email = ?",
      args: [email],
    });

    if (rows && rows.length > 0) {
      return NextResponse.json(
        { error: "Cet email existe déjà." },
        { status: 409 },
      );
    }

    // Hachage et Insertion
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute({
      sql: "INSERT INTO User (email, password) VALUES (?, ?)",
      args: [email, hashedPassword],
    });

    return NextResponse.json(
      {
        success: true,
        message: "Compte créé avec succès !",
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Erreur Register détaillée:", error.message || error);

    return NextResponse.json(
      {
        error: "Erreur serveur lors de l'inscription.",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
