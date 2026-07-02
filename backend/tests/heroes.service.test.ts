import { heroesService } from "../src/modules/heroes/heroes.service";
import { heroesRepository } from "../src/modules/heroes/heroes.repository";
import { NotFoundError, ConflictError } from "../src/errors/app-error";

// Mocamos o repository inteiro: testamos a REGRA DE NEGÓCIO isoladamente,
// sem precisar de um banco de verdade (por isso são testes de UNIDADE).
jest.mock("../src/modules/heroes/heroes.repository");

const mockedRepository = heroesRepository as jest.Mocked<typeof heroesRepository>;

function buildHero(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: "hero-1",
    name: "Bruce Wayne",
    nickname: "Batman",
    date_of_birth: new Date("1939-05-01"),
    universe: "DC",
    main_power: "Inteligência",
    avatar_url: "https://example.com/avatar.png",
    is_active: true,
    created_at: new Date("2024-01-01T00:00:00Z"),
    updated_at: new Date("2024-01-01T00:00:00Z"),
    ...overrides,
  } as any;
}

const validInput = {
  name: "Novo nome",
  nickname: "Novo apelido",
  date_of_birth: "1990-01-01",
  universe: "DC",
  main_power: "Voo",
  avatar_url: "https://example.com/a.png",
};

describe("heroesService.update", () => {
  beforeEach(() => jest.clearAllMocks());

  it("lança ConflictError ao tentar editar um herói desativado", async () => {
    mockedRepository.findById.mockResolvedValue(buildHero({ is_active: false }));

    await expect(heroesService.update("hero-1", validInput)).rejects.toThrow(ConflictError);
    expect(mockedRepository.update).not.toHaveBeenCalled();
  });

  it("lança NotFoundError quando o herói não existe", async () => {
    mockedRepository.findById.mockResolvedValue(null);

    await expect(heroesService.update("inexistente", validInput)).rejects.toThrow(NotFoundError);
  });

  it("atualiza normalmente quando o herói está ativo", async () => {
    mockedRepository.findById.mockResolvedValue(buildHero({ is_active: true }));
    mockedRepository.update.mockResolvedValue(buildHero({ name: "Atualizado" }));

    const result = await heroesService.update("hero-1", validInput);

    expect(result.name).toBe("Atualizado");
    expect(mockedRepository.update).toHaveBeenCalledTimes(1);
  });
});

describe("heroesService.remove", () => {
  beforeEach(() => jest.clearAllMocks());

  it("lança NotFoundError ao excluir um herói inexistente", async () => {
    mockedRepository.findById.mockResolvedValue(null);

    await expect(heroesService.remove("inexistente")).rejects.toThrow(NotFoundError);
    expect(mockedRepository.delete).not.toHaveBeenCalled();
  });

  it("remove normalmente quando o herói existe", async () => {
    mockedRepository.findById.mockResolvedValue(buildHero());

    await heroesService.remove("hero-1");

    expect(mockedRepository.delete).toHaveBeenCalledWith("hero-1");
  });
});

describe("heroesService.list", () => {
  it("calcula corretamente o total de páginas com base no total de registros", async () => {
    mockedRepository.findMany.mockResolvedValue({ data: [], total: 25, pageSize: 10 });

    const result = await heroesService.list(1);

    expect(result.meta).toEqual({ page: 1, pageSize: 10, total: 25, totalPages: 3 });
  });
});
