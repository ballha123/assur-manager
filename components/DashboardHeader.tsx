import React from "react";

export default function DashboardHeader() {
  return (
    <header className="flex justify-between items-center mb-10">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          AssurManager <span className="text-blue-600">Pro</span>
        </h1>
        <p className="text-slate-500 mt-1">Tableau de bord de gestion</p>
      </div>

      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold shadow-lg shadow-blue-200 transition-all">
        + Nouveau Client
      </button>
    </header>
  );
}
