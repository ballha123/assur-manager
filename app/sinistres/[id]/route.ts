import db from "@/src/lib/db";
import { NextResponse } from "next/server";

// PATCH = Modification partielle
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { statut } = body; // On attend "Validé" ou "Rejeté"

    // Mise à jour SQL
    const stmt = db.prepare("UPDATE Sinistre SET statut = ? WHERE id = ?");
    stmt.run(statut, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
