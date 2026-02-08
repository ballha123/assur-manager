import { createClient } from "@libsql/client/web";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

const finalUrl = url
  ? url.replace("libsql://", "https://")
  : "https://placeholder-db.turso.io";
const finalToken = authToken || "placeholder-token";

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
