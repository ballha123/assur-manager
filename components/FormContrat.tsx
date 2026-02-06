"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface FormProps {
  clientId: number;
  onSuccess?: () => void;
}

export default function FormContrat({ clientId, onSuccess }: FormProps) {
  const router = useRouter();

  const [police, setPolice] = useState("");
  const [type, setType] = useState("Automobile");
  const [tarif, setTarif] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/contrat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          police: police,
          type: type,
          tarif: Number(tarif),
          clientId: clientId,
        }),
      });

      if (response.ok) {
        router.refresh();

        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/client/${clientId}`); // Sinon comportement classique
        }

        // Reset du formulaire
        setPolice("");
        setTarif("");
      } else {
        const errorData = await response.json();
        alert(`Erreur : ${errorData.error || "Problème lors de l'ajout"}`);
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      alert("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-4">
        <label className="block text-slate-700 font-bold mb-2">
          Numéro de Police
        </label>
        <input
          type="text"
          required
          placeholder="Ex: AUTO-1234"
          value={police}
          onChange={(e) => setPolice(e.target.value)}
          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="mb-4">
        <label className="block text-slate-700 font-bold mb-2">
          Type de Contrat
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
        >
          <option value="Automobile">🚗 Automobile</option>
          <option value="Habitation">🏠 Habitation</option>
          <option value="Santé">🏥 Santé</option>
          <option value="Professionnel">💼 Professionnel</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-slate-700 font-bold mb-2">
          Tarif Mensuel (€)
        </label>
        <input
          type="number"
          required
          placeholder="Ex: 50"
          value={tarif}
          onChange={(e) => setTarif(e.target.value)}
          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 px-4 rounded-lg text-white font-bold transition-colors ${
          loading
            ? "bg-slate-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Validation..." : "Valider le Contrat"}
      </button>
    </form>
  );
}
