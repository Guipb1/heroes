"use client";

type PaginationProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="flex items-center justify-end gap-1">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="rounded px-2 py-1 text-gray-500 disabled:opacity-30"
        aria-label="Página anterior"
      >
        ‹
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`h-8 w-8 rounded-md text-sm font-medium ${
            p === page ? "bg-blue-800 text-white" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="rounded px-2 py-1 text-gray-500 disabled:opacity-30"
        aria-label="Próxima página"
      >
        ›
      </button>
    </div>
  );
}
