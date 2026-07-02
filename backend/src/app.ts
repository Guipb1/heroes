import express from "express";
import cors from "cors";
import { heroesRouter } from "./modules/heroes/heroes.routes";
import { errorHandler } from "./middlewares/error-handler";

// App separado do server.ts (que só liga a porta) para os testes poderem
// chamar a API diretamente, sem precisar abrir uma conexão de rede real.
export const app = express();

app.use(cors());
app.use(express.json());

// Rota de verificação: confirma que a API está no ar antes de plugarmos o banco.
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/heroes", heroesRouter);

// Precisa vir depois de todas as rotas: é o único lugar que transforma
// qualquer erro lançado na aplicação em uma resposta HTTP.
app.use(errorHandler);
