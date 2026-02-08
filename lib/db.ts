import { createClient } from "@libsql/client"; // ✅ CORRECTION : On utilise le client standard (pas /web)

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

// Protection pour le build
const finalUrl = url || "https://placeholder-db.turso.io";
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
