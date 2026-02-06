"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Compte créé avec succès ! Connectez-vous.");
        router.push("/login");
      } else {
        setError(data.error || "Erreur lors de l'inscription");
      }
    } catch (err) {
      setError("Erreur serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-800 text-center mb-2">
          Créer un compte
        </h1>
        <p className="text-slate-500 text-center mb-8 text-sm">
          Rejoignez AssurManager Pro
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 font-medium text-center border border-red-100">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Email professionnel
            </label>
            <input
              type="email"
              required
              className="text-black w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="agent@assurance.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              required
              minLength={6}
              className="text-black w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold text-white transition-all transform active:scale-95 ${
              loading
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
            }`}
          >
            {loading ? "Création en cours..." : "S'inscrire"}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-6">
          Déjà un compte ?{" "}
          <Link
            href="/login"
            className="text-blue-600 font-bold hover:underline"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  );
}
