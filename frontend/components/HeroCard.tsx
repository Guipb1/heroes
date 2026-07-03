"use client";

import { Hero } from "@/lib/types";
import { ActionsMenu } from "./ActionsMenu";

type HeroCardProps = {
  hero: Hero;
  onOpenDetails: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
};

// heroi inativo 
export function HeroCard({ hero, onOpenDetails, onEdit, onDelete, onToggleStatus }: HeroCardProps) {
  return (
    <div
      className={`relative flex flex-col items-center rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md ${
        !hero.is_active ? "grayscale opacity-80" : ""
      }`}
    >
      <ActionsMenu hero={hero} onEdit={onEdit} onDelete={onDelete} onToggleStatus={onToggleStatus} />
      <button onClick={onOpenDetails} className="flex flex-col items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element -- avatar_url é uma URL arbitrária informada pelo usuário */}
        <img src={hero.avatar_url} alt={hero.nickname} className="h-24 w-24 rounded-full object-cover" />
        <span className={`text-sm font-medium ${hero.is_active ? "text-gray-900" : "text-gray-500"}`}>
          {hero.nickname}
        </span>
      </button>
    </div>
  );
}
