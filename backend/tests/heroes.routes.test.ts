import request from "supertest";
import { app } from "../src/app";
import { prisma } from "../src/lib/prisma";

// Testes de INTEGRAÇÃO: sobem a aplicação Express de verdade e batem contra
// o banco de TESTE (configurado em tests/setup-env.ts + .env.test).
beforeEach(async () => {
  await prisma.hero.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

function heroPayload(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    name: "Diana Prince",
    nickname: "Mulher-Maravilha",
    date_of_birth: "1941-10-21",
    universe: "DC",
    main_power: "Forca e combate",
    avatar_url: "https://example.com/avatar.png",
    ...overrides,
  };
}

describe("POST /heroes", () => {
  it("cria um herói e retorna a resposta no formato exigido pelo contrato", async () => {
    const response = await request(app).post("/heroes").send(heroPayload());

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      name: "Diana Prince",
      nickname: "Mulher-Maravilha",
      universe: "DC",
      is_active: true,
    });
    expect(response.body.id).toEqual(expect.any(String));
    expect(response.body.date_of_birth).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
  });

  it("retorna 400 com mensagens em português quando faltam campos obrigatórios", async () => {
    const response = await request(app).post("/heroes").send({ name: "" });

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: "name" })])
    );
  });
});

describe("GET /heroes", () => {
  it("lista ordenado por created_at (mais recente primeiro), com paginação", async () => {
    await prisma.hero.create({
      data: { ...heroPayload({ name: "Primeiro" }), date_of_birth: new Date("1990-01-01"), created_at: new Date("2024-01-01T00:00:00Z") },
    });
    await prisma.hero.create({
      data: { ...heroPayload({ name: "Segundo" }), date_of_birth: new Date("1990-01-01"), created_at: new Date("2024-01-02T00:00:00Z") },
    });

    const response = await request(app).get("/heroes");

    expect(response.status).toBe(200);
    expect(response.body.data[0].name).toBe("Segundo");
    expect(response.body.meta).toMatchObject({ page: 1, pageSize: 10, total: 2 });
  });

  it("filtra por nome ou apelido através do parâmetro search", async () => {
    await prisma.hero.create({ data: { ...heroPayload({ name: "Clark Kent", nickname: "Superman" }), date_of_birth: new Date("1938-06-01") } });
    await prisma.hero.create({ data: { ...heroPayload({ name: "Bruce Wayne", nickname: "Batman" }), date_of_birth: new Date("1939-05-01") } });

    const response = await request(app).get("/heroes").query({ search: "Super" });

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].nickname).toBe("Superman");
  });
});

describe("PUT /heroes/:id", () => {
  it("edita um herói ativo", async () => {
    const hero = await prisma.hero.create({ data: { ...heroPayload(), date_of_birth: new Date("1990-01-01") } });

    const response = await request(app).put(`/heroes/${hero.id}`).send(heroPayload({ name: "Nome Editado" }));

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Nome Editado");
  });

  it("bloqueia a edição de um herói desativado com 409", async () => {
    const hero = await prisma.hero.create({ data: { ...heroPayload(), date_of_birth: new Date("1990-01-01"), is_active: false } });

    const response = await request(app).put(`/heroes/${hero.id}`).send(heroPayload());

    expect(response.status).toBe(409);
  });
});

describe("PATCH /heroes/:id/status", () => {
  it("ativa/desativa um herói", async () => {
    const hero = await prisma.hero.create({ data: { ...heroPayload(), date_of_birth: new Date("1990-01-01") } });

    const response = await request(app).patch(`/heroes/${hero.id}/status`).send({ is_active: false });

    expect(response.status).toBe(200);
    expect(response.body.is_active).toBe(false);
  });
});

describe("DELETE /heroes/:id", () => {
  it("exclui um herói, que deixa de ser encontrado em seguida", async () => {
    const hero = await prisma.hero.create({ data: { ...heroPayload(), date_of_birth: new Date("1990-01-01") } });

    const deleteResponse = await request(app).delete(`/heroes/${hero.id}`);
    expect(deleteResponse.status).toBe(204);

    const getResponse = await request(app).get(`/heroes/${hero.id}`);
    expect(getResponse.status).toBe(404);
  });
});
