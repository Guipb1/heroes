export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Recurso não encontrado.") {
    super(message, 404);
  }
}

// Erro de regra de negócio: a requisição está bem formada, mas não pode ser
// executada por causa do estado atual do recurso (ex: herói desativado).
export class ConflictError extends AppError {
  constructor(message = "Operação não permitida no estado atual do recurso.") {
    super(message, 409);
  }
}
