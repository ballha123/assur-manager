"use client"; // Obligatoire pour le onClick

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  id: number;
  type: "client" | "contrat" | "sinistre"; // Pour savoir quelle API appeler
}

export default function DeleteButton({ id, type }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    // 1. Confirmation
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) return;

    setLoading(true);

    try {
      // 2. Appel de l'API DELETE
      const res = await fetch(`/api/${type}/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // 3. Rafraîchissement
        router.refresh();
        // Optionnel : router.push('/') si tu veux revenir à l'accueil après suppression
      } else {
        alert("Erreur lors de la suppression.");
      }
    } catch (error) {
      alert("Erreur serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-500 hover:text-red-700 font-bold disabled:opacity-50"
    >
      {loading ? "..." : "🗑️ Supprimer"}
    </button>
  );
}
