import Link from "next/link";
import SinistreActions from "@/components/SinistreActions";
import db from "@/src/lib/db";

interface SinistreFull {
  id: number;
  description: string;
  dateDeclaration: string;
  statut: string;
  police: string;
  nomClient: string;
  clientId: number;
}

export default async function GestionSinistres({
  searchParams,
}: {
  searchParams: Promise<{ statut?: string }>;
}) {
  const params = await searchParams;
  const filterStatut = params.statut;

  let sql = `
    SELECT 
      Sinistre.*, 
      Contrat.police, 
      Client.nom as nomClient, 
      Client.id as clientId
    FROM Sinistre
    JOIN Contrat ON Sinistre.contratId = Contrat.id
    JOIN Client ON Contrat.clientId = Client.id
  `;

  const args = [];

  if (filterStatut) {
    sql += " WHERE Sinistre.statut = ?";
    args.push(filterStatut);
  }

  sql += " ORDER BY dateDeclaration DESC";

  const sinistres = db.prepare(sql).all(...args) as SinistreFull[];

  return (
    <main className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Gestion des Sinistres
          </h1>
          <p className="text-slate-500">Gérez les demandes entrantes</p>
        </header>

        <div className="flex gap-4 mb-6">
          <Link
            href="/sinistres"
            className={`px-4 py-2 rounded-full font-bold text-sm ${!filterStatut ? "bg-blue-600 text-white" : "bg-white text-slate-600"}`}
          >
            Tout voir
          </Link>
          <Link
            href="/sinistres?statut=En cours"
            className={`px-4 py-2 rounded-full font-bold text-sm ${filterStatut === "En cours" ? "bg-blue-600 text-white" : "bg-white text-slate-600"}`}
          >
            À traiter (En cours)
          </Link>
          <Link
            href="/sinistres?statut=Validé"
            className={`px-4 py-2 rounded-full font-bold text-sm ${filterStatut === "Validé" ? "bg-blue-600 text-white" : "bg-white text-slate-600"}`}
          >
            Archives (Validés)
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Client / Police</th>
                <th className="p-4">Description</th>
                <th className="p-4">Statut</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sinistres.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="p-4">{s.dateDeclaration}</td>
                  <td className="p-4">
                    <div className="font-bold text-slate-800">
                      {s.nomClient}
                    </div>
                    <div className="font-mono text-xs text-slate-400">
                      {s.police}
                    </div>
                  </td>
                  <td className="p-4 font-medium">{s.description}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        s.statut === "En cours"
                          ? "bg-yellow-100 text-yellow-800"
                          : s.statut === "Validé"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {s.statut}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {s.statut === "En cours" && <SinistreActions id={s.id} />}
                  </td>
                </tr>
              ))}
              {sinistres.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="p-10 text-center text-slate-400 italic"
                  >
                    Aucun sinistre trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
