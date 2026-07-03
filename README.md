# Hero Factory 🦸

Plataforma de gestão de heróis: criação, listagem (com busca e paginação), edição, ativação/desativação e exclusão.


## 🧱 Stack

| Camada | Tecnologias |
|---|---|
| **Frontend** | Next.js (App Router) + TypeScript + Tailwind CSS |
| **Backend** | Node.js + Express + TypeScript |
| **Banco de dados** | MySQL 8 (rodando em container Docker) |
| **ORM** | Prisma |
| **Validação** | Zod |
| **Testes** | Jest + Supertest |

## 🗺️ Arquitetura geral

```
[Navegador] ⇄ HTTP/JSON ⇄ [Next.js — :3000] ⇄ HTTP/JSON ⇄ [Express API — :3001] ⇄ SQL (Prisma) ⇄ [MySQL 8 — Docker :3306]
```

O frontend é uma SPA (100% client-side) que consome a API REST do backend, que por sua vez é a única camada com acesso ao banco de dados.

## 📦 Pré-requisitos

- [Node.js](https://nodejs.org/) 20.9 ou superior
- [Docker](https://www.docker.com/) (para rodar o MySQL)

## 🚀 Como rodar o projeto

### 1. Banco de dados (MySQL no Docker)

Na raiz do projeto:

```bash
docker compose up -d
```

Sobe um MySQL 8 em `localhost:3306` (banco `hero_factory`), com os dados persistidos em um volume Docker.

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env          # já vem configurado para o banco do passo 1
npx prisma migrate deploy     # cria as tabelas
npx prisma db seed            # popula com 12 heróis de exemplo
npm run dev                   # API em http://localhost:3001
```

### 3. Frontend

Em outro terminal:

```bash
cd frontend
npm install
cp .env.local.example .env.local   # já aponta para http://localhost:3001
npm run dev                        # aplicação em http://localhost:3000
```

Acesse **http://localhost:3000**.

## ✅ Rodando os testes (backend)

Os testes usam um banco **separado** do banco de desenvolvimento, para poderem apagar/recriar dados livremente.

```bash
cd backend
docker exec hero-factory-mysql mysql -uroot -prootpass -e "CREATE DATABASE IF NOT EXISTS hero_factory_test;"
cp .env.test.example .env.test
DATABASE_URL="mysql://root:rootpass@localhost:3306/hero_factory_test" npx prisma migrate deploy
npm test
```

São **14 testes**: 6 de unidade (regras de negócio do `heroesService`, com o repositório mockado) e 8 de integração (endpoints reais via Supertest, contra o banco de teste).

## 🗂️ Estrutura do projeto

```
heroes/
├─ docker-compose.yml
├─ backend/
│  ├─ prisma/
│  │  ├─ schema.prisma        # modelo do herói
│  │  ├─ migrations/          # histórico versionado do schema do banco
│  │  └─ seed.ts              # popula o banco com heróis de exemplo
│  ├─ src/
│  │  ├─ app.ts               # configuração do Express (rotas, middlewares)
│  │  ├─ server.ts            # ponto de entrada (só liga a porta)
│  │  ├─ lib/prisma.ts        # instância única do Prisma Client
│  │  ├─ errors/              # classes de erro de domínio (404, 409...)
│  │  ├─ middlewares/         # validação de body e tratamento central de erros
│  │  └─ modules/heroes/      # routes → controller → service → repository
│  └─ tests/                  # testes de unidade e integração
└─ frontend/
   ├─ app/                    # layout raiz e página única (App Router)
   ├─ components/             # HeroesDashboard + componentes de UI reutilizáveis
   └─ lib/                    # cliente HTTP (axios), tipos e formatação
```

## 🌐 Contrato da API

Todas as respostas seguem o formato:

```json
{
  "id": "e314636e-1ca6-4925-a0e7-da5eb5ae2403",
  "name": "Robert Bruce Banner",
  "nickname": "Hulk",
  "date_of_birth": "1962-04-10 00:00:00",
  "universe": "Marvel",
  "main_power": "Force",
  "avatar_url": "https://cdn.pixabay.com/photo/2024/05/07/00/59/hulk-8744607_1280.jpg",
  "is_active": true,
  "created_at": "2024-09-18 21:41:43",
  "updated_at": "2024-09-18 21:41:43"
}
```

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/heroes` | Cria um herói (nasce sempre ativo) |
| `GET` | `/heroes?page=1&search=` | Lista paginada (10/página), ordenada por `created_at` desc, com busca por nome/apelido |
| `GET` | `/heroes/:id` | Detalhes de um herói |
| `PUT` | `/heroes/:id` | Edita os 6 campos permitidos — retorna **409** se o herói estiver inativo |
| `PATCH` | `/heroes/:id/status` | Ativa/desativa (`{ "is_active": boolean }`) |
| `DELETE` | `/heroes/:id` | Exclusão definitiva |

## 🧠 Decisões de arquitetura e regras de negócio

- **Ativar/Desativar × Excluir**: o enunciado descreve um fluxo de soft-delete (registros inativos continuam listados, em cinza), mas os prints de referência mostram um **toggle** de ativar/desativar **junto** com uma opção de excluir. Interpretei como dois controles com papéis distintos: o toggle liga/desliga o herói (`is_active`, reversível, é o que produz os registros "cinza" da listagem), e "Excluir" remove o registro definitivamente. Documentando aqui porque o texto e os prints, isolados, sugeririam leituras diferentes.
- **Campos em `snake_case` no Prisma**: o schema usa os mesmos nomes de campo exigidos na resposta da API (`date_of_birth`, `main_power`, etc.), em vez do `camelCase` convencional em JS. Evita uma camada de tradução de nomes só para atender ao contrato — a serialização cuida apenas da formatação de datas.
- **Repository + Serializer (DTO)**: `heroes.repository.ts` isola todo acesso ao Prisma; `heroes.serializer.ts` é o único lugar que formata a resposta no formato exigido (incluindo a conversão de `Date` para `"YYYY-MM-DD HH:mm:ss"`). Trocar o ORM ou ajustar o formato de resposta afeta um arquivo só, não a aplicação inteira.
- **Camadas (routes → controller → service → repository)**: cada camada tem uma única responsabilidade — o controller só traduz HTTP, o service concentra as regras de negócio, o repository só fala com o banco.
- **Tratamento de erros centralizado**: um único middleware (`error-handler.ts`) decide como qualquer erro (validação do Zod, regra de negócio, erro inesperado) vira uma resposta HTTP
- **Avatar como URL, não upload**: os prints mostram o campo "Avatar" como um input de texto ("Digite a URL"), então o backend valida uma URL (Zod) em vez de lidar com upload/armazenamento de arquivo.
- **Paginação fixa em 10 por página**: é uma regra de negócio, não uma preferência do cliente — por isso a API não aceita um parâmetro `limit` vindo da requisição.
- **`app.ts` separado de `server.ts`**: permite que os testes de integração chamem a aplicação Express diretamente (via Supertest), sem precisar abrir uma porta de rede real.
- **Next.js majoritariamente client-side**: a tela inteira é interativa (busca, paginação, modais), então não há ganho em dividir Server/Client Components — a página raiz é apenas um wrapper fino em torno do `HeroesDashboard` (Client Component).

## 🧪 Estratégia de testes

- **Unidade** (`heroes.service.test.ts`): testam as regras de negócio do `heroesService` com o `heroesRepository` mockado — rápidos, sem depender de banco.
- **Integração** (`heroes.routes.test.ts`): sobem a aplicação Express real via Supertest contra um banco MySQL de teste dedicado, cobrindo os 6 endpoints de ponta a ponta (inclusive o formato exato da resposta).

## 🌿 Fluxo de Git

O projeto seguiu o **GitHub Flow**: uma branch por funcionalidade, commits no padrão (`feat`, `fix`, `chore`, `test`, `docs`), e Pull Requests mesclados na `main` a cada entrega fechada

## 💡 Melhorias propostas

Fora do escopo deste teste, mas seriam os próximos passos naturais de evolução:


- **Upload de avatar** com armazenamento em serviço de objetos (S3/Cloudinary), em vez de depender de uma URL externa informada pelo usuário.
- **CI** (GitHub Actions) rodando lint, testes e build a cada Pull Request.
- **Dockerizar a stack inteira** (backend e frontend também, não só o banco), com um `docker compose` único para subir tudo.
- **Testes de frontend** (React Testing Library) e testes end-to-end (Playwright/Cypress) cobrindo os fluxos completos pela UI.
- **Autenticação/autorização**, caso a aplicação deixe de ser interna/de demonstração.
- **Server-Side Rendering** da listagem inicial (o backend já é uma API separada; a listagem inicial poderia ser pré-carregada no servidor Next.js e hidratada no cliente).
- **Acessibilidade**: foco automático e "trap" de foco dentro dos modais, navegação completa por teclado.
