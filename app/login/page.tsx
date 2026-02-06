"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import bgImage from "@/assets/login.jpeg";
export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        router.refresh();
        router.push("/");
      } else {
        setError(data.error || "Email ou mot de passe incorrect");
      }
    } catch (err) {
      setError("Erreur serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            🛡️
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Bienvenue</h1>
          <p className="text-slate-500 text-sm">
            Connectez-vous à votre espace
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 font-medium text-center border border-red-100 animate-pulse">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Email
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
                : "bg-black hover:bg-slate-800 shadow-lg"
            }`}
          >
            {loading ? "Connexion..." : "Se connecter →"}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-6">
          Nouveau collaborateur ?{" "}
          <Link
            href="/signUp"
            className="text-blue-600 font-bold hover:underline"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </main>
  );
}
