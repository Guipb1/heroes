import { RequestHandler } from "express";
import { ZodTypeAny } from "zod";

// Middleware genérico: valida req.body contra qualquer schema Zod.
// Se for inválido, o erro cai no error-handler central (via next(error)).
export function validateBody(schema: ZodTypeAny): RequestHandler {
  return (req, _res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
}
