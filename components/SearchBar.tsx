"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function SearchBox() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative mb-6">
      <label htmlFor="search" className="sr-only">
        Recherche
      </label>
      <input
        className="text-black peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder="Rechercher un client..."
        defaultValue={searchParams.get("q")?.toString()}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
      />

      <div className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900">
        🔍
      </div>
    </div>
  );
}
