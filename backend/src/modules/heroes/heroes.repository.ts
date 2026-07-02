import { prisma } from "../../lib/prisma";
import { Prisma } from "../../generated/prisma/client";

const PAGE_SIZE = 10;

// Isola todo o acesso ao Prisma/banco (padrão Repository). O restante da
// aplicação não sabe (nem precisa saber) que estamos usando Prisma + MySQL.
export const heroesRepository = {
  async findMany(page: number, search?: string) {
    const where: Prisma.HeroWhereInput = search
      ? {
          OR: [
            { name: { contains: search } },
            { nickname: { contains: search } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      prisma.hero.findMany({
        where,
        orderBy: { created_at: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.hero.count({ where }),
    ]);

    return { data, total, pageSize: PAGE_SIZE };
  },

  findById(id: string) {
    return prisma.hero.findUnique({ where: { id } });
  },

  create(data: Prisma.HeroCreateInput) {
    return prisma.hero.create({ data });
  },

  update(id: string, data: Prisma.HeroUpdateInput) {
    return prisma.hero.update({ where: { id }, data });
  },

  updateStatus(id: string, is_active: boolean) {
    return prisma.hero.update({ where: { id }, data: { is_active } });
  },

  delete(id: string) {
    return prisma.hero.delete({ where: { id } });
  },
};
