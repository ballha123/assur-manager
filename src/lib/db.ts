import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  throw new Error(
    "🚨 ERREUR CRITIQUE : La variable d'environnement 'TURSO_DATABASE_URL' est manquante. Vérifiez votre fichier .env.local ou les réglages Vercel.",
  );
}

const db = createClient({
  url,
  authToken,
});

export default db;
