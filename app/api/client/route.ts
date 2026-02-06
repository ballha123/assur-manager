import db from "@/src/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nom, email, telephone } = body;

    // Validation basique
    if (!nom || !email) {
      return NextResponse.json(
        { error: "Le nom et l'email sont obligatoires." },
        { status: 400 },
      );
    }

    // Insertion dans la BDD
    const stmt = db.prepare(
      "INSERT INTO Client (nom, email, telephone) VALUES (?, ?, ?)",
    );

    const info = stmt.run(nom, email, telephone);

    return NextResponse.json({
      success: true,
      clientId: info.lastInsertRowid,
    });
  } catch (error: any) {
    console.error(error);
    // Gestion de l'erreur "Email unique"
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return NextResponse.json(
        { error: "Cet email existe déjà." },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Erreur serveur lors de la création du client." },
      { status: 500 },
    );
  }
}
