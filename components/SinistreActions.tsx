"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SinistreActions({ id }: { id: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const updateStatut = async (nouveauStatut: string) => {
    if (!confirm(`Passer ce sinistre en ${nouveauStatut} ?`)) return;
    setLoading(true);

    try {
      await fetch(`/api/sinistre/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ statut: nouveauStatut }),
      });
      router.refresh();
    } catch (e) {
      alert("Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => updateStatut("Validé")}
        disabled={loading}
        className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-xs font-bold"
      >
        Valider
      </button>
      <button
        onClick={() => updateStatut("Rejeté")}
        disabled={loading}
        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs font-bold"
      >
        Rejeter
      </button>
    </div>
  );
}
