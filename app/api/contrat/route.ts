import db from "@/src/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { police, type, tarif, clientId } = body;

    // 1. Validation des champs
    if (!police || !type || !tarif || !clientId) {
      return NextResponse.json(
        { error: "Tous les champs sont obligatoires." },
        { status: 400 },
      );
    }

    // 2. Insertion dans la BDD
    const stmt = db.prepare(
      "INSERT INTO Contrat (police, type, tarif, clientId) VALUES (?, ?, ?, ?)",
    );

    stmt.run(police, type, tarif, clientId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erreur API Contrat:", error);

    // Gestion spécifique si le numéro de police existe déjà (UNIQUE constraint)
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return NextResponse.json(
        { error: "Ce numéro de police existe déjà." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Erreur serveur lors de l'ajout du contrat." },
      { status: 500 },
    );
  }
}
