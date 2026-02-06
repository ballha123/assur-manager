const Database = require("better-sqlite3");
const db = new Database("assurance.db");

console.log("🏗️  Construction de la base de données...");

db.exec(`
  -- Table CLIENT
  CREATE TABLE IF NOT EXISTS Client (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    email TEXT UNIQUE,
    telephone TEXT
  );
    -- Table User
  CREATE TABLE IF NOT EXISTS User (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT NOT NULL
  );

  -- Table CONTRAT (Liée à Client)
  CREATE TABLE IF NOT EXISTS Contrat (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    police TEXT UNIQUE, -- Numéro de dossier (ex: AUTO-101)
    type TEXT,          -- Auto, Habitation, Santé
    tarif INTEGER,      -- Prix mensuel
    clientId INTEGER,
    FOREIGN KEY(clientId) REFERENCES Client(id) ON DELETE CASCADE
  );

  -- Table SINISTRE (Liée à Contrat)
  CREATE TABLE IF NOT EXISTS Sinistre (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT,
    dateDeclaration TEXT,
    statut TEXT DEFAULT 'En cours', -- En cours, Validé, Rejeté
    contratId INTEGER,
    FOREIGN KEY(contratId) REFERENCES Contrat(id) ON DELETE CASCADE
  );
`);

db.exec("DELETE FROM Sinistre; DELETE FROM Contrat; DELETE FROM Client;");

const insertClient = db.prepare(
  "INSERT INTO Client (nom, email, telephone) VALUES (?, ?, ?)",
);
const insertContrat = db.prepare(
  "INSERT INTO Contrat (police, type, tarif, clientId) VALUES (?, ?, ?, ?)",
);
const insertSinistre = db.prepare(
  "INSERT INTO Sinistre (description, dateDeclaration, statut, contratId) VALUES (?, ?, ?, ?)",
);

const infoClient1 = insertClient.run("Hedi Dev", "hedi@test.com", "22 333 444");
const infoClient2 = insertClient.run(
  "Sami Garagiste",
  "sami@test.com",
  "99 888 777",
);

insertContrat.run("AUTO-001", "Automobile", 120, infoClient1.lastInsertRowid);
insertContrat.run("HAB-002", "Habitation", 50, infoClient1.lastInsertRowid);

const contratSami = insertContrat.run(
  "PRO-999",
  "Professionnel",
  300,
  infoClient2.lastInsertRowid,
);

insertSinistre.run(
  "Dégât des eaux au garage",
  "2024-02-04",
  "En cours",
  contratSami.lastInsertRowid,
);

console.log(" 'assurance.db' prête avec succès !");
