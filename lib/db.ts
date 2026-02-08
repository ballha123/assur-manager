import { createClient } from "@libsql/client/http"; // 👈 SOLUTION ULTIME : On force le mode HTTP

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

// Protection pour le build et conversion automatique en HTTPS
// Le client HTTP exige https://, on remplace libsql:// si présent
const finalUrl = url
  ? url.replace("libsql://", "https://")
  : "https://placeholder-db.turso.io";

const finalToken = authToken || "token-placeholder";

if (!url) {
  console.warn(
    "⚠️ ATTENTION : Variable TURSO_DATABASE_URL manquante (Normal au build)",
  );
}

const db = createClient({
  url: finalUrl,
  authToken: finalToken,
});

export default db;
