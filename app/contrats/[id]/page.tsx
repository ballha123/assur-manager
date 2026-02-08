import db from "@/lib/db";
import Link from "next/link";

interface ContratDetail {
  id: number;
  police: string;
  type: string;
  tarif: number;
  clientId: number;
  nomClient: string;
  emailClient: string;
}

interface Sinistre {
  id: number;
  description: string;
  dateDeclaration: string;
  statut: string;
}

export default async function PageContrat({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 1. REQUÊTE CONTRAT (Turso)
  const { rows: contratRows } = await db.execute({
    sql: `
    SELECT 
      Contrat.*, 
      Client.nom as nomClient,
      Client.email as emailClient
    FROM Contrat
    JOIN Client ON Contrat.clientId = Client.id
    WHERE Contrat.id = ?
  `,
    args: [id],
  });
  const contrat = contratRows[0] as unknown as ContratDetail;

  if (!contrat) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-red-500 font-bold text-2xl">Contrat introuvable</h1>
        <Link href="/" className="text-blue-500 underline mt-4 block">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  // 2. REQUÊTE SINISTRES (Turso)
  const { rows: sinistresRows } = await db.execute({
    sql: "SELECT * FROM Sinistre WHERE contratId = ?",
    args: [id],
  });
  const sinistres = sinistresRows as unknown as Sinistre[];

  return (
    <main className="min-h-screen bg-slate-50 p-8 font-sans">
      <header className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              Contrat {contrat.type}
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-3">
              Police N° {contrat.police}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Souscrit par :{" "}
              <span className="font-semibold text-slate-700">
                {contrat.nomClient}
              </span>
            </p>
          </div>
          <Link
            href={`/client/${contrat.clientId}`}
            className="text-slate-500 hover:text-slate-800 font-medium"
          >
            ← Retour Client
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-6">
          <div>
            <p className="text-slate-400 text-xs uppercase font-bold">
              Tarif Mensuel
            </p>
            <p className="text-slate-800 font-black text-2xl">
              {contrat.tarif} DT
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase font-bold">
              Contact Client
            </p>
            <p className="text-slate-800 font-medium">{contrat.emailClient}</p>
          </div>
        </div>
      </header>
      <section>
        <h2 className="text-xl font-bold text-slate-800 mb-6">
          Sinistres rattachés ({sinistres.length})
        </h2>

        {sinistres.length === 0 ? (
          <div className="bg-green-50 p-6 rounded-xl border border-green-100 text-green-700">
            ✅ Aucun sinistre déclaré sur ce contrat.
          </div>
        ) : (
          <div className="grid gap-4">
            {sinistres.map((s) => (
              <Link
                key={s.id}
                href={`/sinistre/${s.id}`}
                className="block bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all flex justify-between items-center"
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-slate-800">
                      {s.dateDeclaration}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold ${
                        s.statut === "Validé"
                          ? "bg-green-100 text-green-700"
                          : s.statut === "Rejeté"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {s.statut}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm">{s.description}</p>
                </div>
                <span className="text-slate-400">→</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
