"use client";

import { Hero } from "@/lib/types";
import { Modal } from "./Modal";
import { formatDateBR } from "@/lib/format";

type HeroDetailsModalProps = {
  hero: Hero | null;
  onClose: () => void;
};

export function HeroDetailsModal({ hero, onClose }: HeroDetailsModalProps) {
  if (!hero) return null;

  return (
    <Modal
      open={Boolean(hero)}
      onClose={onClose}
      title={hero.nickname}
      footer={
        <button
          onClick={onClose}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Fechar
        </button>
      }
    >
      <div className="flex flex-col items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element -- avatar_url é uma URL arbitrária informada pelo usuário */}
        <img src={hero.avatar_url} alt={hero.nickname} className="h-24 w-24 rounded-full object-cover" />
        <div className="grid w-full grid-cols-2 gap-4 text-sm">
          <Info label="Nome completo" value={hero.name} />
          <Info label="Data de nascimento" value={formatDateBR(hero.date_of_birth)} />
          <Info label="Universo" value={hero.universe} />
          <Info label="Habilidade" value={hero.main_power} />
        </div>
      </div>
    </Modal>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-medium text-gray-700">{label}</p>
      <p className="text-gray-500">{value}</p>
    </div>
  );
}
