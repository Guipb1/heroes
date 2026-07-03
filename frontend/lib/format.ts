// Converte "YYYY-MM-DD HH:mm:ss" (formato da API) para "DD/MM/AAAA".
export function formatDateBR(value: string): string {
  const [datePart] = value.split(" ");
  const [year, month, day] = datePart.split("-");
  return `${day}/${month}/${year}`;
}
