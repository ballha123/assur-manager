import db from "@/src/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const stmt = db.prepare("DELETE FROM Client WHERE id = ?");
    const info = stmt.run(id);

    if (info.changes === 0) {
      return NextResponse.json(
        { error: "Client introuvable" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
