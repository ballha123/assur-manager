"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface FormProps {
  onSuccess?: () => void; // ✅ NOUVEAU : Fonction optionnelle pour fermer la modale
}

export default function FormContrat({ onSuccess }: FormProps) {
  const router = useRouter();

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("Automobile");
  const [telephone, setTelephone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: nom,
          email: email,
          telephone: telephone,
        }),
      });

      if (response.ok) {
        router.refresh(); // Rafraîchit les données de la page derrière

        if (onSuccess) {
          onSuccess(); // ✅ Si on est dans une modale, on la ferme
        } else {
          router.push(`/client`); // Sinon comportement classique
        }
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
        <label className="block text-slate-700 font-bold mb-2">Nom</label>
        <input
          type="text"
          required
          placeholder="Ex: AUTO-1234"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="mb-4">
        <label className="block text-slate-700 font-bold mb-2">
          Type de Contrat
        </label>
        <select
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
        ></select>
      </div>

      <div className="mb-6">
        <label className="block text-slate-700 font-bold mb-2">Telephone</label>
        <input
          type="number"
          required
          placeholder="Ex: 50"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
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
        {loading ? "Validation..." : "Valider le Client"}
      </button>
    </form>
  );
}
