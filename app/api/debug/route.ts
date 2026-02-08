import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const dbUrl = process.env.TURSO_DATABASE_URL;

  try {
    // 1. On vérifie quelle URL est vue par le code (on cache la fin pour la sécurité)
    const urlVisible = dbUrl
      ? dbUrl.substring(0, 20) + "..."
      : "NON DÉFINIE (Undefined)";

    // 2. On demande la liste des tables à la base connectée
    const tables = await db.execute(
      "SELECT name FROM sqlite_schema WHERE type='table'",
    );

    // 3. On essaie de lire la table User
    let userCount = "Erreur lecture";
    try {
      const res = await db.execute("SELECT count(*) as total FROM User");
      userCount = String(res.rows[0].total);
    } catch (e: any) {
      userCount = "Erreur SQL : " + e.message;
    }

    return NextResponse.json({
      etat_connexion: {
        url_utilisee: urlVisible,
        token_present: !!process.env.TURSO_AUTH_TOKEN,
      },
      tables_trouvees: tables.rows,
      nombre_users: userCount,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
        cause: "Impossible de contacter la base. Vérifie les clés.",
      },
      { status: 500 },
    );
  }
}
