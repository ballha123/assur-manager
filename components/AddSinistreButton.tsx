"use client";

import { useState } from "react";
import FormSinistre from "./FormSinistre";

// On doit passer les contrats au formulaire
export default function AddSinistreButton({
  contrats,
  clientId,
}: {
  contrats: any[];
  clientId: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-red-600 font-semibold text-sm hover:underline bg-red-50 px-3 py-1 rounded-full transition-colors hover:bg-red-100"
      >
        + Déclarer un sinistre
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">
                Nouveau Sinistre
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:bg-slate-200 w-8 h-8 rounded-full"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <FormSinistre
                contrats={contrats}
                clientId={clientId}
                onSuccess={() => setIsOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
