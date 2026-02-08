import AddClientButton from "@/components/AddClientButton";
import LogoutButton from "@/components/LogoutButton";
import RevenueChart from "@/components/RevenueChart";
import SearchBar from "@/components/SearchBar";
import db from "@/lib/db";

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

  // 1. Données Graphique (Turso)
  const { rows: dataRows } = await db.execute(`
    SELECT 
      type as name, 
      SUM(tarif) as total 
    FROM Contrat 
    GROUP BY type
  `);
  // 🛠️ CORRECTION : On convertit en objets simples pour le composant Client
  const data = dataRows.map((row) => ({ ...row })) as unknown as ChartData[];

  // 2. Liste Clients (Turso)
  const { rows: clientRows } = await db.execute({
    sql: `
      SELECT 
        Client.*, 
        COUNT(Contrat.id) as nombreContrats 
      FROM Client 
      LEFT JOIN Contrat ON Client.id = Contrat.clientId 
      WHERE Client.nom LIKE ? OR Client.email LIKE ? 
      GROUP BY Client.id
      ORDER BY Client.id DESC
    `,
    args: [searchTerm, searchTerm],
  });
  // 🛠️ CORRECTION : On convertit en objets simples
  const clients = clientRows.map((row) => ({ ...row }));

  // 3. Statistiques
  const [clientsRes, contratsRes, sinistresRes] = await Promise.all([
    db.execute("SELECT COUNT(*) as count FROM Client"),
    db.execute("SELECT COUNT(*) as count FROM Contrat"),
    db.execute("SELECT COUNT(*) as count FROM Sinistre"),
  ]);

  const stats = {
    clients: { count: Number(clientsRes.rows[0].count) },
    contrats: { count: Number(contratsRes.rows[0].count) },
    sinistres: { count: Number(sinistresRes.rows[0].count) },
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-md mx-auto mb-6">
        <SearchBar />
      </div>

      <div className="absolute top-4 right-4">
        <LogoutButton />
      </div>

      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            AssurManager <span className="text-blue-600">Pro</span>
          </h1>
          <p className="text-slate-500 mt-1">Tableau de bord de gestion</p>
        </div>
        <div className="ml-auto">
          <AddClientButton />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
            Portefeuille Clients
          </span>
          <span className="text-4xl font-black text-slate-800">
            {stats.clients.count}
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
            Contrats Actifs
          </span>
          <span className="text-4xl font-black text-blue-600">
            {stats.contrats.count}
          </span>
        </div>

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
              href={`/client/${client.id}`}
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
                {Number(client.nombreContrats) > 0 ? (
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
