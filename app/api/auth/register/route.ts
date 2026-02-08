// Assure-toi que l'import pointe bien vers ton client LibSQL (Turso)
import db from "@/src/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // 1. Vérifier la connexion DB et la table
    const userExists = await db
      .execute({
        sql: "SELECT * FROM User WHERE email = ?",
        args: [email],
      })
      .catch((err) => {
        // Si tu vois ce log, c'est que la table "User" n'existe pas sur Turso
        console.error("Erreur d'accès à la table User:", err);
        throw new Error("La table User n'existe pas dans la base Turso.");
      });

    if (userExists.rows.length > 0) {
      return NextResponse.json(
        { error: "Cet email existe déjà." },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute({
      sql: "INSERT INTO User (email, password) VALUES (?, ?)",
      args: [email, hashedPassword],
    });

    return NextResponse.json({ success: true, message: "Compte créé !" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
