"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function SearchBox() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term); // Si texte existe -> ?q=texte
    } else {
      params.delete("q"); // Si vide -> On enlève le ?q=
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative mb-6">
      <label htmlFor="search" className="sr-only">
        Recherche
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder="Rechercher un client..."
        // 4. L'INPUT
        // defaultValue : On lit l'URL pour remettre le texte si on rafraîchit la page
        defaultValue={searchParams.get("q")?.toString()}
        // onChange : On capture ce que l'utilisateur tape
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
      />
      {/* Petite icône loupe pour le style */}
      <div className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900">
        🔍
      </div>
    </div>
  );
}
