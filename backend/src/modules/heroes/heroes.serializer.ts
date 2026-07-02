import { Hero } from "../../generated/prisma/client";

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

// Formata como "YYYY-MM-DD HH:mm:ss" (formato do MySQL), usando os
// componentes UTC do Date para não sofrer deslocamento por fuso horário.
function formatDateTime(date: Date): string {
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Único lugar responsável por moldar a resposta da API no contrato exigido
// pelo enunciado (padrão DTO/Serializer).
export function toHeroResponse(hero: Hero) {
  return {
    id: hero.id,
    name: hero.name,
    nickname: hero.nickname,
    date_of_birth: formatDateTime(hero.date_of_birth),
    universe: hero.universe,
    main_power: hero.main_power,
    avatar_url: hero.avatar_url,
    is_active: hero.is_active,
    created_at: formatDateTime(hero.created_at),
    updated_at: formatDateTime(hero.updated_at),
  };
}
