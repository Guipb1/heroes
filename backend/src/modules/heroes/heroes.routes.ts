import { Router } from "express";
import { heroesController } from "./heroes.controller";
import { validateBody } from "../../middlewares/validate-body";
import { heroInputSchema, heroStatusSchema } from "./heroes.validation";

export const heroesRouter = Router();

heroesRouter.get("/", heroesController.list);
heroesRouter.get("/:id", heroesController.getById);
heroesRouter.post("/", validateBody(heroInputSchema), heroesController.create);
heroesRouter.put("/:id", validateBody(heroInputSchema), heroesController.update);
heroesRouter.patch("/:id/status", validateBody(heroStatusSchema), heroesController.setStatus);
heroesRouter.delete("/:id", heroesController.remove);
