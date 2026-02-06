"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      router.refresh();
      router.push("/login");
    } catch (error) {
      console.error("Erreur déconnexion", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="ml-auto text-red-500 font-bold hover:text-red-700 text-sm transition-colors flex items-center gap-2 border border-red-100 px-4 py-2 rounded-lg hover:bg-red-50"
    >
      <span>🚪</span> Se déconnecter
    </button>
  );
}
