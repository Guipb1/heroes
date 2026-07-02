import { Request, Response, NextFunction } from "express";
import { heroesService } from "./heroes.service";
import { toHeroResponse } from "./heroes.serializer";
import { listHeroesQuerySchema } from "./heroes.validation";

// Tipa o formato dos parâmetros de rota (nossas rotas só usam um :id simples).
// O Express 5 tipa req.params de forma genérica como string | string[] para
// suportar rotas com múltiplos valores; como não é o nosso caso, declarar o
// formato exato aqui é mais correto do que simplesmente forçar o tipo (as string).
type HeroParams = { id: string };

// Só traduz HTTP <-> serviço: lê a requisição, chama o service, formata a
// resposta. Nenhuma regra de negócio mora aqui.
export const heroesController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, search } = listHeroesQuerySchema.parse(req.query);
      const result = await heroesService.list(page, search);
      res.json({ data: result.data.map(toHeroResponse), meta: result.meta });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request<HeroParams>, res: Response, next: NextFunction) {
    try {
      const hero = await heroesService.getById(req.params.id);
      res.json(toHeroResponse(hero));
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const hero = await heroesService.create(req.body);
      res.status(201).json(toHeroResponse(hero));
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request<HeroParams>, res: Response, next: NextFunction) {
    try {
      const hero = await heroesService.update(req.params.id, req.body);
      res.json(toHeroResponse(hero));
    } catch (error) {
      next(error);
    }
  },

  async setStatus(req: Request<HeroParams>, res: Response, next: NextFunction) {
    try {
      const hero = await heroesService.setStatus(req.params.id, req.body.is_active);
      res.json(toHeroResponse(hero));
    } catch (error) {
      next(error);
    }
  },

  async remove(req: Request<HeroParams>, res: Response, next: NextFunction) {
    try {
      await heroesService.remove(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
