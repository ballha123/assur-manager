"use client";

import { useState } from "react";
import FormContrat from "./FormContrat";
import FormClient from "./FormClient";

export default function AddClientButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-blue-600 font-semibold text-sm hover:underline bg-blue-50 px-3 py-1 rounded-full transition-colors hover:bg-blue-100"
      >
        + Ajouter un client
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">
                Nouveau Client
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <FormClient onSuccess={() => setIsOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
