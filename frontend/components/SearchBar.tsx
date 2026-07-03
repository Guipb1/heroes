"use client";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export function SearchBar({ value, onChange, onSubmit }: SearchBarProps) {
  return (
    <form
      className="flex flex-1 gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="flex flex-1 items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
        <span aria-hidden>🔍</span>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Digite o nome do herói"
          className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
        />
      </div>
      <button
        type="submit"
        className="rounded-full bg-white px-5 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
      >
        Buscar
      </button>
    </form>
  );
}
