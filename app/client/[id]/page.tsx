import Link from "next/link";
import AddContractButton from "@/components/AddContractButton";
import AddSinistreButton from "@/components/AddSinistreButton";
import db from "@/src/lib/db";
import DeleteButton from "@/components/DeleteButton";

interface Client {
  id: number;
  nom: string;
  email: string;
  telephone: string;
}

interface Contrat {
  id: number;
  police: string;
  type: string;
  tarif: number;
  clientId: number;
}

interface Sinistre {
  id: number;
  description: string;
  dateDeclaration: string;
  statut: string;
  police: string;
}

export default async function DetailClient({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 1. REQUÊTE CLIENT
  const client = db
    .prepare("SELECT * FROM Client WHERE id = ?")
    .get(id) as Client;

  if (!client) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-red-500 font-bold text-2xl">Client introuvable</h1>
        <Link href="/" className="text-blue-500 underline mt-4 block">
          Retour au tableau de bord
        </Link>
      </div>
    );
  }

  // 2. REQUÊTE CONTRATS
  const contrats = db
    .prepare("SELECT * FROM Contrat WHERE clientId = ?")
    .all(id) as Contrat[];

  // 3. REQUÊTE SINISTRES
  const sinistres = db
    .prepare(
      `
    SELECT Sinistre.*, Contrat.police 
    FROM Sinistre
    JOIN Contrat ON Sinistre.contratId = Contrat.id
    WHERE Contrat.clientId = ?
  `,
    )
    .all(id) as Sinistre[];

  return (
    <main className="min-h-screen bg-slate-50 p-8 font-sans">
      {/* --- EN-TÊTE --- */}{" "}
      <Link
        href="/"
        className="text-slate-500 hover:text-slate-800 font-medium"
      >
        ← Retour
      </Link>
      <header className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              Fiche Client
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-3">
              {client.nom}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              ID Client : #{client.id}
            </p>
          </div>
          <DeleteButton id={client.id} type="client" />
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-6">
          <div>
            <p className="text-slate-400 text-xs uppercase font-bold">Email</p>
            <p className="text-slate-800 font-medium text-lg">{client.email}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase font-bold">
              Téléphone
            </p>
            <p className="text-slate-800 font-medium text-lg">
              {client.telephone}
            </p>
          </div>
        </div>
      </header>
      {/* --- CONTRATS --- */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">
            Contrats Souscrits ({contrats.length})
          </h2>
          <AddContractButton clientId={client.id} />
        </div>

        {contrats.length === 0 ? (
          <p className="text-slate-500 italic">Aucun contrat pour ce client.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contrats.map((contrat) => (
              <Link
                key={contrat.id}
                href={`/contrats/${contrat.id}`} // Lien vers la page détail contrat
                className="block bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600 font-bold text-xl group-hover:scale-110 transition-transform">
                    📄
                  </div>
                  <span className="text-slate-400 text-xs font-mono">
                    {contrat.police}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors">
                  {contrat.type}
                </h3>
                <div className="flex justify-between items-center border-t border-slate-50 pt-4 mt-4">
                  <span className="text-slate-400 text-sm">Tarif mensuel</span>
                  <span className="text-xl font-black text-slate-800">
                    {contrat.tarif} €
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
      {/* --- SINISTRES (CORRIGÉ) --- */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">
            Historique des Sinistres ({sinistres.length})
          </h2>
          <AddSinistreButton contrats={contrats} clientId={client.id} />
        </div>

        {sinistres.length === 0 ? (
          <div className="bg-green-50 p-6 rounded-xl border border-green-100 text-green-700">
            ✅ Aucun sinistre déclaré pour ce client.
          </div>
        ) : (
          // ✅ CORRECTION : Utilisation d'une grille de cartes au lieu d'un tableau
          <div className="grid gap-4">
            {sinistres.map((s) => (
              <Link
                key={s.id}
                href={`/sinistres/${s.id}`} // Assure-toi que cette page existe si tu veux cliquer
                className="block bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all flex justify-between items-center group"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="font-bold text-slate-700">
                      {s.dateDeclaration}
                    </span>
                    <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      {s.police}
                    </span>
                  </div>
                  <p className="font-medium text-slate-800">{s.description}</p>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      s.statut === "Validé"
                        ? "bg-green-100 text-green-700"
                        : s.statut === "Rejeté"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {s.statut}
                  </span>
                  <span className="text-slate-400 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
