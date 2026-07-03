"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Hero, HeroInput, ApiFieldError, PaginationMeta } from "@/lib/types";
import { heroesApi, extractErrorMessage } from "@/lib/api";
import { useToast } from "./ToastProvider";
import { HeroCard } from "./HeroCard";
import { SearchBar } from "./SearchBar";
import { Pagination } from "./Pagination";
import { Spinner } from "./Spinner";
import { HeroFormModal } from "./HeroFormModal";
import { HeroDetailsModal } from "./HeroDetailsModal";
import { ConfirmModal } from "./ConfirmModal";

type ConfirmAction = { type: "delete" | "toggle"; hero: Hero };

function getApiFieldErrors(error: unknown): ApiFieldError[] {
  if (axios.isAxiosError(error)) {
    return (error.response?.data as { errors?: ApiFieldError[] } | undefined)?.errors ?? [];
  }
  return [];
}

export function HeroesDashboard() {
  const { showSuccess, showError } = useToast();

  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  // Incrementado a cada abertura do modal de criação, e usado como `key` dele
  // logo abaixo — força o React a remontar o formulário sempre limpo.
  const [createInstanceKey, setCreateInstanceKey] = useState(0);
  const [editHero, setEditHero] = useState<Hero | null>(null);
  const [detailsHero, setDetailsHero] = useState<Hero | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<ApiFieldError[]>([]);

  const fetchHeroes = useCallback(
    async (targetPage: number, search: string) => {
      setIsLoading(true);
      try {
        const response = await heroesApi.list(targetPage, search);
        // Se a página atual ficou vazia (ex: excluímos o único herói dela), volta uma página.
        if (response.data.length === 0 && targetPage > 1) {
          setPage(targetPage - 1);
          return;
        }
        setHeroes(response.data);
        setMeta(response.meta);
      } catch (error) {
        showError(extractErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    },
    [showError]
  );

  useEffect(() => {
    // busca de dados é um dos usos legítimos de efeito 
    // "sincronizar estado com uma prop", que resolvemos com `key` no
    // HeroFormModal). O lint acusa por causa do `setIsLoading(true)` que
    // roda antes do primeiro `await` dentro de fetchHeroes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchHeroes(page, appliedSearch);
  }, [page, appliedSearch, fetchHeroes]);

  function handleSearchSubmit() {
    setPage(1);
    setAppliedSearch(searchInput.trim());
  }

  async function handleCreateSubmit(input: HeroInput) {
    setIsSubmitting(true);
    setFieldErrors([]);
    try {
      await heroesApi.create(input);
      showSuccess("Herói criado com sucesso.");
      setCreateOpen(false);
      setPage(1);
      fetchHeroes(1, appliedSearch);
    } catch (error) {
      setFieldErrors(getApiFieldErrors(error));
      showError(extractErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleEditSubmit(input: HeroInput) {
    if (!editHero) return;
    setIsSubmitting(true);
    setFieldErrors([]);
    try {
      await heroesApi.update(editHero.id, input);
      showSuccess("Herói atualizado com sucesso.");
      setEditHero(null);
      fetchHeroes(page, appliedSearch);
    } catch (error) {
      setFieldErrors(getApiFieldErrors(error));
      showError(extractErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleConfirm() {
    if (!confirmAction) return;
    setIsConfirming(true);
    try {
      if (confirmAction.type === "delete") {
        await heroesApi.remove(confirmAction.hero.id);
        showSuccess("Herói excluído com sucesso.");
      } else {
        await heroesApi.setStatus(confirmAction.hero.id, !confirmAction.hero.is_active);
        showSuccess(confirmAction.hero.is_active ? "Herói desativado." : "Herói ativado.");
      }
      setConfirmAction(null);
      fetchHeroes(page, appliedSearch);
    } catch (error) {
      showError(extractErrorMessage(error));
    } finally {
      setIsConfirming(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6 sm:p-10">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[#FAF3EA] p-8 shadow-2xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-blue-900">Heróis</h1>

        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            onClick={() => {
              setCreateInstanceKey((key) => key + 1);
              setCreateOpen(true);
            }}
            className="rounded-full bg-blue-800 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-900"
          >
            Criar
          </button>
          <SearchBar value={searchInput} onChange={setSearchInput} onSubmit={handleSearchSubmit} />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20 text-blue-900">
            <Spinner className="h-8 w-8" />
          </div>
        ) : heroes.length === 0 ? (
          <p className="py-20 text-center text-gray-500">Nenhum herói encontrado.</p>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {heroes.map((hero) => (
              <HeroCard
                key={hero.id}
                hero={hero}
                onOpenDetails={() => setDetailsHero(hero)}
                onEdit={() => setEditHero(hero)}
                onDelete={() => setConfirmAction({ type: "delete", hero })}
                onToggleStatus={() => setConfirmAction({ type: "toggle", hero })}
              />
            ))}
          </div>
        )}

        {meta && (
          <div className="mt-8">
            <Pagination page={meta.page} totalPages={meta.totalPages} onChange={setPage} />
          </div>
        )}
      </div>

      <HeroFormModal
        key={`create-${createInstanceKey}`}
        open={createOpen}
        title="Criar herói"
        isSubmitting={isSubmitting}
        fieldErrors={fieldErrors}
        onSubmit={handleCreateSubmit}
        onClose={() => setCreateOpen(false)}
      />

      <HeroFormModal
        key={editHero?.id ?? "edit-closed"}
        open={Boolean(editHero)}
        title="Editar herói"
        initialValue={editHero ?? undefined}
        isSubmitting={isSubmitting}
        fieldErrors={fieldErrors}
        onSubmit={handleEditSubmit}
        onClose={() => setEditHero(null)}
      />

      <HeroDetailsModal hero={detailsHero} onClose={() => setDetailsHero(null)} />

      <ConfirmModal
        open={Boolean(confirmAction)}
        title={confirmAction?.type === "delete" ? "Excluir herói" : confirmAction?.hero.is_active ? "Desativar herói" : "Ativar herói"}
        message={
          confirmAction?.type === "delete"
            ? `Tem certeza que deseja excluir ${confirmAction.hero.nickname}? Essa ação não pode ser desfeita.`
            : `Tem certeza que deseja ${confirmAction?.hero.is_active ? "desativar" : "ativar"} ${confirmAction?.hero.nickname}?`
        }
        confirmLabel={confirmAction?.type === "delete" ? "Excluir" : "Confirmar"}
        danger={confirmAction?.type === "delete"}
        isLoading={isConfirming}
        onConfirm={handleConfirm}
        onClose={() => setConfirmAction(null)}
      />
    </div>
  );
}
