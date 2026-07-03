"use client";

import { useEffect, useRef, useState } from "react";
import { Hero } from "@/lib/types";

type ActionsMenuProps = {
  hero: Hero;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
};

export function ActionsMenu({ hero, onEdit, onDelete, onToggleStatus }: ActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="absolute right-3 top-3" ref={ref}>
      <button
        onClick={() => setOpen((current) => !current)}
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
        aria-label="Ações"
      >
        ⋮
      </button>
      {open && (
        <div className="absolute right-0 top-full z-10 mt-2 flex flex-col gap-1 rounded-xl bg-white p-2 shadow-lg">
          <button
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
            aria-label="Excluir"
            title="Excluir"
          >
            🗑
          </button>
          {hero.is_active && (
            <button
              onClick={() => {
                setOpen(false);
                onEdit();
              }}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50"
              aria-label="Editar"
              title="Editar"
            >
              ✏️
            </button>
          )}
          <button
            onClick={() => {
              setOpen(false);
              onToggleStatus();
            }}
            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-50"
            aria-label={hero.is_active ? "Desativar" : "Ativar"}
            title={hero.is_active ? "Desativar" : "Ativar"}
          >
            <span
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                hero.is_active ? "bg-blue-800" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  hero.is_active ? "translate-x-4" : "translate-x-1"
                }`}
              />
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
