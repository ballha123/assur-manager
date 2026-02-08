import { createClient } from "@libsql/client/web";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

// 1. DIAGNOSTIC : On logue l'état (utile pour les logs Vercel)
const isProd = process.env.NODE_ENV === "production";
console.log(`[DB] Mode: ${process.env.NODE_ENV}`);
console.log(`[DB] URL définie ? ${url ? "OUI" : "NON"}`);

// 2. CONFIGURATION INTELLIGENTE
// Si l'URL manque (même en prod), on ne crashe pas. On utilise un placeholder.
// Cela permet à "npm run build" de finir sans erreur même si les envs sont mal chargées.
const finalUrl = url ? url.replace("libsql://", "https://") : "file:local.db";
const finalToken = authToken || "token-placeholder";

if (!url) {
  console.error("🚨 ERREUR : Variable TURSO_DATABASE_URL manquante.");
  console.warn("⚠️ Utilisation du mode 'offline' pour permettre le build.");
}

// 3. CRÉATION DU CLIENT
const db = createClient({
  url: finalUrl,
  authToken: finalToken,
});

export default db;
