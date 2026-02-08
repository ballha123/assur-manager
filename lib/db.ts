import { createClient } from "@libsql/client/web";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

// 1. DIAGNOSTIC : On affiche (en cachant les secrets) ce qu'on a reçu
const isProd = process.env.NODE_ENV === "production";
console.log(`[DB] Mode: ${process.env.NODE_ENV}`);
console.log(`[DB] URL définie ? ${url ? "OUI" : "NON"}`);

// 2. SECURITÉ : On arrête tout si pas de clé en PROD
if (!url) {
  // En dev/build, on met une fausse valeur pour pas que "npm run build" plante
  // Mais une valeur qui ne déclenche pas de requête réseau (pas de http://...)
  if (!isProd) {
    console.warn("⚠️ [DEV] Pas d'URL Turso. Utilisation mock pour le build.");
  } else {
    // En PROD, on crashe volontairement pour voir l'erreur dans les logs Vercel
    throw new Error(
      "🚨 ERREUR FATALE : La variable TURSO_DATABASE_URL est vide sur Vercel !",
    );
  }
}

// 3. CRÉATION DU CLIENT
// On force HTTPS pour le web
const finalUrl = url ? url.replace("libsql://", "https://") : "file:local.db";

const db = createClient({
  url: finalUrl,
  authToken: authToken,
});

export default db;
