// Mesmo formato de resposta exigido pela API (contrato do enunciado).
export type Hero = {
  id: string;
  name: string;
  nickname: string;
  date_of_birth: string;
  universe: string;
  main_power: string;
  avatar_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

// Os 6 campos editáveis, tanto na criação quanto na edição.
export type HeroInput = {
  name: string;
  nickname: string;
  date_of_birth: string;
  universe: string;
  main_power: string;
  avatar_url: string;
};

export type PaginationMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type HeroesListResponse = {
  data: Hero[];
  meta: PaginationMeta;
};

export type ApiFieldError = {
  field: string;
  message: string;
};

export type ApiErrorResponse = {
  message: string;
  errors?: ApiFieldError[];
};
