import { z } from "zod";

// Usado tanto na criação quanto na edição: são exatamente os mesmos 6 campos
// editáveis descritos no requisito ("Nome completo", "Nome de guerra", etc).
export const heroInputSchema = z.object({
  name: z.string({ error: "Nome completo é obrigatório." }).trim().min(1, "Nome completo é obrigatório."),
  nickname: z.string({ error: "Nome de guerra é obrigatório." }).trim().min(1, "Nome de guerra é obrigatório."),
  date_of_birth: z
    .string({ error: "Data de nascimento é obrigatória." })
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "Data de nascimento inválida.",
    }),
  universe: z.string({ error: "Universo é obrigatório." }).trim().min(1, "Universo é obrigatório."),
  main_power: z.string({ error: "Habilidade é obrigatória." }).trim().min(1, "Habilidade é obrigatória."),
  avatar_url: z.string({ error: "Avatar é obrigatório." }).trim().url("Avatar deve ser uma URL válida."),
});

export const heroStatusSchema = z.object({
  is_active: z.boolean({ error: "Campo is_active é obrigatório." }),
});

// A paginação de 10 por página é uma regra de negócio, não uma preferência do
// cliente: por isso o "limit" não é aceito aqui, só a página.
export const listHeroesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  search: z.string().trim().optional(),
});

export type HeroInput = z.infer<typeof heroInputSchema>;
