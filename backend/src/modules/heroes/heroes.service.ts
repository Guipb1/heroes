import { heroesRepository } from "./heroes.repository";
import { NotFoundError, ConflictError } from "../../errors/app-error";
import { HeroInput } from "./heroes.validation";

// Regras de negócio da Hero Factory. O controller não sabe de Prisma, e o
// repository não sabe de regras de negócio — cada camada tem uma única razão
// para mudar (Single Responsibility, um dos princípios SOLID).
export const heroesService = {
  async list(page: number, search?: string) {
    const { data, total, pageSize } = await heroesRepository.findMany(page, search);
    return {
      data,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
    };
  },

  async getById(id: string) {
    const hero = await heroesRepository.findById(id);
    if (!hero) throw new NotFoundError("Herói não encontrado.");
    return hero;
  },

  create(input: HeroInput) {
    return heroesRepository.create({
      ...input,
      date_of_birth: new Date(input.date_of_birth),
    });
  },

  async update(id: string, input: HeroInput) {
    const hero = await heroesRepository.findById(id);
    if (!hero) throw new NotFoundError("Herói não encontrado.");
    if (!hero.is_active) {
      throw new ConflictError("Não é possível editar um herói desativado.");
    }

    return heroesRepository.update(id, {
      ...input,
      date_of_birth: new Date(input.date_of_birth),
    });
  },

  async setStatus(id: string, is_active: boolean) {
    const hero = await heroesRepository.findById(id);
    if (!hero) throw new NotFoundError("Herói não encontrado.");
    return heroesRepository.updateStatus(id, is_active);
  },

  async remove(id: string) {
    const hero = await heroesRepository.findById(id);
    if (!hero) throw new NotFoundError("Herói não encontrado.");
    await heroesRepository.delete(id);
  },
};
