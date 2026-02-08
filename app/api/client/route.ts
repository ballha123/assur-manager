import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nom, email, telephone } = body;

    if (!nom || !email) {
      return NextResponse.json(
        { error: "Le nom et l'email sont obligatoires." },
        { status: 400 },
      );
    }

    const result = await db.execute({
      sql: "INSERT INTO Client (nom, email, telephone) VALUES (?, ?, ?)",
      args: [nom, email, telephone],
    });

    return NextResponse.json({
      success: true,
      clientId: result.lastInsertRowid?.toString(),
    });
  } catch (error: any) {
    console.error(error);

    if (
      error?.code === "SQLITE_CONSTRAINT_UNIQUE" ||
      error?.message?.includes("UNIQUE constraint failed")
    ) {
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
