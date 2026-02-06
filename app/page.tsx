import AddClientButton from "@/components/AddClientButton";
import RevenueChart from "@/components/RevenueChart";
import SearchBar from "@/components/SearchBar";
import db from "@/src/lib/db";
import Link from "next/link";
interface ChartData {
  name: string;
  total: number;
}
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  const searchTerm = `%${query}%`;
  const data = db
    .prepare(
      `SELECT 
  type as name, 
  SUM(tarif) as total 
FROM Contrat 
GROUP BY type`,
    )
    .all() as ChartData[];
  const clients = db
    .prepare(
      `
    SELECT 
      Client.*, 
      COUNT(Contrat.id) as nombreContrats 
    FROM Client 
    LEFT JOIN Contrat ON Client.id = Contrat.clientId 
    WHERE Client.nom LIKE ? OR Client.email LIKE ? 
    GROUP BY Client.id
    ORDER BY Client.id DESC
  `,
    )
    .all(searchTerm, searchTerm);

  // B. On calcule les chiffres clés pour le haut de page
  const stats = {
    clients: db.prepare("SELECT COUNT(*) as count FROM Client").get() as {
      count: number;
    },
    contrats: db.prepare("SELECT COUNT(*) as count FROM Contrat").get() as {
      count: number;
    },
    sinistres: db.prepare("SELECT COUNT(*) as count FROM Sinistre").get() as {
      count: number;
    },
  };

  // 2. AFFICHAGE (Le Rendu)
  return (
    <main className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-md mb-6">
        <SearchBar />
      </div>
      {/* --- EN-TÊTE --- */}
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            AssurManager <span className="text-blue-600">Pro</span>
          </h1>
          <p className="text-slate-500 mt-1">Tableau de bord de gestion</p>
        </div>
        <AddClientButton />
      </header>

      {/* --- STATISTIQUES (Les Cartes du haut) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Carte Clients */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
            Portefeuille Clients
          </span>
          <span className="text-4xl font-black text-slate-800">
            {stats.clients.count}
          </span>
        </div>

        {/* Carte Contrats */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
            Contrats Actifs
          </span>
          <span className="text-4xl font-black text-blue-600">
            {stats.contrats.count}
          </span>
        </div>

        {/* Carte Sinistres */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
            Sinistres en cours
          </span>
          <span className="text-4xl font-black text-red-500">
            {stats.sinistres.count}
          </span>
        </div>
      </div>
      <section className="mb-10">
        <RevenueChart data={data} />
      </section>

      {/* --- LISTE DES CLIENTS --- */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Derniers Clients</h2>
          <span className="text-sm text-slate-400">
            Total : {clients.length}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {clients.map((client: any) => (
            <Link
              key={client.id}
              href={`/client/${client.id}`} // Lien vers la page détail (étape suivante)
              className="group block bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all duration-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-lg">
                    👤
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {client.nom}
                    </h3>
                    <p className="text-xs text-slate-400">ID: #{client.id}</p>
                  </div>
                </div>
                {client.nombreContrats > 0 ? (
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md">
                    {client.nombreContrats} Contrat(s)
                  </span>
                ) : (
                  <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded-md">
                    Prospect
                  </span>
                )}
              </div>

              <div className="space-y-2 text-sm text-slate-600 mb-4">
                <p className="flex items-center gap-2">📧 {client.email}</p>
                <p className="flex items-center gap-2">📞 {client.telephone}</p>
              </div>

              <div className="pt-4 border-t border-slate-50 flex justify-end">
                <span className="text-blue-600 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                  Voir le dossier &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
