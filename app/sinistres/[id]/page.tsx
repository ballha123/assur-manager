import db from "@/src/lib/db";
import Link from "next/link";

interface SinistreDetail {
  id: number;
  description: string;
  dateDeclaration: string;
  statut: string;
  contratId: number;
  police: string;
  clientId: number;
  nomClient: string;
  emailClient: string;
}

export default async function PageSinistre({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const sinistre = db
    .prepare(
      `
    SELECT 
      Sinistre.*, 
      Contrat.police,
      Contrat.clientId,
      Client.nom as nomClient,
      Client.email as emailClient
    FROM Sinistre
    JOIN Contrat ON Sinistre.contratId = Contrat.id
    JOIN Client ON Contrat.clientId = Client.id
    WHERE Sinistre.id = ?
  `,
    )
    .get(id) as SinistreDetail;

  if (!sinistre) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h1 className="text-3xl font-bold text-red-500 mb-4">
          Dossier introuvable
        </h1>
        <Link href="/" className="text-blue-600 hover:underline">
          Retour à l'accueil
        </Link>
      </div>
    );
  }
  const statusColors =
    {
      "En cours": "bg-yellow-100 text-yellow-800 border-yellow-200",
      Validé: "bg-green-100 text-green-800 border-green-200",
      Rejeté: "bg-red-100 text-red-800 border-red-200",
    }[sinistre.statut] || "bg-gray-100 text-gray-800";

  return (
    <main className="min-h-screen bg-slate-50 p-8 font-sans flex flex-col items-center">
      <Link
        href="/"
        className="mr-auto text-slate-500 hover:text-slate-800 font-medium"
      >
        ← Retour
      </Link>
      <div className="w-full max-w-2xl">
        <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-blue-600">
            Dashboard
          </Link>
          <span>/</span>
          <Link
            href={`/client/${sinistre.clientId}`}
            className="hover:text-blue-600"
          >
            {sinistre.nomClient}
          </Link>
          <span>/</span>
          <span className="font-bold text-slate-800">
            Sinistre #{sinistre.id}
          </span>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
          <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-100">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
                Dossier Sinistre
              </p>
              <h1 className="text-3xl font-black text-slate-800">
                #{sinistre.id}
              </h1>
              <p className="text-slate-500 mt-1">
                Déclaré le {sinistre.dateDeclaration}
              </p>
            </div>

            <span
              className={`px-4 py-2 rounded-full text-sm font-bold border ${statusColors}`}
            >
              {sinistre.statut}
            </span>
          </div>

          <div className="grid gap-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase mb-2">
                Description de l'incident
              </h3>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
                {sinistre.description}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <p className="text-xs text-blue-600 font-bold uppercase mb-1">
                  Contrat concerné
                </p>
                <p className="font-mono text-lg font-bold text-slate-800">
                  {sinistre.police}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-xs text-slate-500 font-bold uppercase mb-1">
                  Assuré
                </p>
                <Link
                  href={`/client/${sinistre.clientId}`}
                  className="font-bold text-blue-600 hover:underline"
                >
                  {sinistre.nomClient}
                </Link>
                <p className="text-xs text-slate-400 mt-1">
                  {sinistre.emailClient}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-100">
            <Link
              href={`/client/${sinistre.clientId}`}
              className="flex items-center justify-center w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              ← Retour au dossier client
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
