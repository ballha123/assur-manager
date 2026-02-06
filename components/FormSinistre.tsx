"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Définition locale de ce qu'est un contrat (juste ce dont on a besoin)
interface Contrat {
  id: number;
  police: string;
  type: string;
}

interface Props {
  contrats: Contrat[];
  clientId: number;
  onSuccess: () => void;
}

export default function FormSinistre({ contrats, clientId, onSuccess }: Props) {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [statut, setStatut] = useState("");
  const [contratId, setContratId] = useState(contrats[0]?.id || ""); // Sélectionne le 1er par défaut
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/sinistre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description,
          dateDeclaration: date,
          statut: statut,
          contratId: Number(contratId),
        }),
      });

      if (response.ok) {
        router.refresh();
        onSuccess();
        setDescription("");
        setDate("");
      } else {
        alert("Erreur lors de l'ajout.");
      }
    } catch (error) {
      alert("Erreur serveur.");
    } finally {
      setLoading(false);
    }
  };

  // Si le client n'a pas de contrat, on ne peut pas créer de sinistre
  if (contrats.length === 0) {
    return (
      <p className="text-red-500 text-center">
        Ce client n'a aucun contrat actif.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-4">
        <label className="block text-slate-700 font-bold mb-2">
          Contrat Concerné
        </label>
        <select
          value={contratId}
          onChange={(e) => setContratId(Number(e.target.value))}
          className="w-full p-3 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
        >
          {contrats.map((c) => (
            <option key={c.id} value={c.id}>
              {c.police} - {c.type}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-slate-700 font-bold mb-2">
          Date du Sinistre
        </label>
        <input
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="mb-6">
        <label className="block text-slate-700 font-bold mb-2">
          Description
        </label>
        <textarea
          required
          rows={3}
          placeholder="Ex: Accident de voiture..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 px-4 rounded-lg text-white font-bold ${
          loading ? "bg-slate-400" : "bg-red-600 hover:bg-red-700"
        }`}
      >
        {loading ? "Enregistrement..." : "Déclarer le Sinistre"}
      </button>
    </form>
  );
}
