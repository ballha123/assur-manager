import Database from "better-sqlite3";
import path from "path";

// On connecte Next.js au fichier qu'on vient de créer
const dbPath = path.join(process.cwd(), "assurance.db");
const db = new Database(dbPath);

export default db;
