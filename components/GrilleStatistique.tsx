interface StatsProps {
  stats: {
    clients: number;
    contrats: number;
    sinistres: number;
  };
}
export default function StatsGrid({ stats }: StatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
          Portefeuille Clients
        </span>
        <span className="text-4xl font-black text-slate-800">
          {stats.clients}
        </span>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
          Contrats Actifs
        </span>
        <span className="text-4xl font-black text-blue-600">
          {stats.contrats}
        </span>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
          Sinistres en cours
        </span>
        <span className="text-4xl font-black text-red-500">
          {stats.sinistres}
        </span>
      </div>
    </div>
  );
}
