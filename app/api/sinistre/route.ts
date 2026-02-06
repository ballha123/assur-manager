import db from "@/src/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // On met 'En cours' par défaut si le statut n'est pas envoyé
    const {
      description,
      dateDeclaration,
      contratId,
      statut = "En cours",
    } = body;

    // Validation des champs obligatoires
    if (!description || !dateDeclaration || !contratId) {
      return NextResponse.json(
        { error: "Tous les champs (description, date, contrat) sont requis." },
        { status: 400 },
      );
    }

    // Préparation de la requête SQL
    const stmt = db.prepare(
      "INSERT INTO Sinistre (description, dateDeclaration, statut, contratId) VALUES (?, ?, ?, ?)",
    );

    // Exécution
    stmt.run(description, dateDeclaration, statut, contratId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur API Sinistre:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'ajout du sinistre." },
      { status: 500 },
    );
  }
}
