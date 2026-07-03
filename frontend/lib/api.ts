import axios from "axios";
import { Hero, HeroInput, HeroesListResponse } from "./types";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const heroesApi = {
  list(page: number, search: string) {
    return api
      .get<HeroesListResponse>("/heroes", { params: { page, search: search || undefined } })
      .then((res) => res.data);
  },

  getById(id: string) {
    return api.get<Hero>(`/heroes/${id}`).then((res) => res.data);
  },

  create(input: HeroInput) {
    return api.post<Hero>("/heroes", input).then((res) => res.data);
  },

  update(id: string, input: HeroInput) {
    return api.put<Hero>(`/heroes/${id}`, input).then((res) => res.data);
  },

  setStatus(id: string, is_active: boolean) {
    return api.patch<Hero>(`/heroes/${id}/status`, { is_active }).then((res) => res.data);
  },

  remove(id: string) {
    return api.delete(`/heroes/${id}`);
  },
};

// Extrai uma mensagem amigável de qualquer erro vindo da API (ou de rede).
export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    if (data?.message) return data.message;
    if (error.code === "ERR_NETWORK") return "Não foi possível conectar à API.";
  }
  return "Ocorreu um erro inesperado.";
}
