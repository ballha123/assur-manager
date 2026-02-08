import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

const finalUrl = url || "libsql://db-placeholder.turso.io";
const finalToken = authToken || "token-placeholder";

if (!url) {
  console.warn(
    "⚠️ ATTENTION : Variables Turso manquantes. (Ceci est normal pendant la phase de Build)",
  );
}

const db = createClient({
  url: finalUrl,
  authToken: finalToken,
});

export default db;
