import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

// Dados de teste: dá pra ver a listagem, a busca, a paginação (12 registros = 2 páginas)
// e o estado "inativo" (cinza) funcionando desde o primeiro `npm run dev`.
const heroes = [
  { name: "Clark Kent", nickname: "Superman", date_of_birth: new Date("1938-06-01"), universe: "DC", main_power: "Voo e super força", avatar_url: "https://i.pravatar.cc/300?img=1", is_active: true },
  { name: "Bruce Wayne", nickname: "Batman", date_of_birth: new Date("1939-05-01"), universe: "DC", main_power: "Inteligência e artes marciais", avatar_url: "https://i.pravatar.cc/300?img=2", is_active: true },
  { name: "Diana Prince", nickname: "Wonder Woman", date_of_birth: new Date("1941-10-01"), universe: "DC", main_power: "Força e combate", avatar_url: "https://i.pravatar.cc/300?img=3", is_active: true },
  { name: "Barry Allen", nickname: "Flash", date_of_birth: new Date("1956-01-01"), universe: "DC", main_power: "Super velocidade", avatar_url: "https://i.pravatar.cc/300?img=4", is_active: false },
  { name: "Arthur Curry", nickname: "Aquaman", date_of_birth: new Date("1941-11-01"), universe: "DC", main_power: "Controle dos oceanos", avatar_url: "https://i.pravatar.cc/300?img=5", is_active: true },
  { name: "Robert Bruce Banner", nickname: "Hulk", date_of_birth: new Date("1962-04-10"), universe: "Marvel", main_power: "Força", avatar_url: "https://i.pravatar.cc/300?img=6", is_active: false },
  { name: "Tony Stark", nickname: "Iron Man", date_of_birth: new Date("1963-03-01"), universe: "Marvel", main_power: "Armadura tecnológica", avatar_url: "https://i.pravatar.cc/300?img=7", is_active: true },
  { name: "Steve Rogers", nickname: "Captain America", date_of_birth: new Date("1941-03-01"), universe: "Marvel", main_power: "Força e escudo indestrutível", avatar_url: "https://i.pravatar.cc/300?img=8", is_active: true },
  { name: "Natasha Romanoff", nickname: "Black Widow", date_of_birth: new Date("1964-04-01"), universe: "Marvel", main_power: "Combate e espionagem", avatar_url: "https://i.pravatar.cc/300?img=9", is_active: true },
  { name: "T'Challa", nickname: "Black Panther", date_of_birth: new Date("1966-07-01"), universe: "Marvel", main_power: "Força e agilidade felina", avatar_url: "https://i.pravatar.cc/300?img=10", is_active: true },
  { name: "Wanda Maximoff", nickname: "Scarlet Witch", date_of_birth: new Date("1964-03-01"), universe: "Marvel", main_power: "Magia do caos", avatar_url: "https://i.pravatar.cc/300?img=11", is_active: true },
  { name: "Peter Parker", nickname: "Spider-Man", date_of_birth: new Date("1962-08-01"), universe: "Marvel", main_power: "Sentido aranha e agilidade", avatar_url: "https://i.pravatar.cc/300?img=12", is_active: true },
];

async function main() {
  await prisma.hero.deleteMany();
  await prisma.hero.createMany({ data: heroes });
  console.log(`Seed concluído: ${heroes.length} heróis criados.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
