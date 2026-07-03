"use client";

import { useState } from "react";
import { Modal } from "./Modal";
import { Spinner } from "./Spinner";
import { HeroInput, ApiFieldError } from "@/lib/types";

type HeroFormModalProps = {
  open: boolean;
  title: string;
  initialValue?: HeroInput;
  isSubmitting: boolean;
  fieldErrors: ApiFieldError[];
  onSubmit: (input: HeroInput) => void;
  onClose: () => void;
};

const emptyForm: HeroInput = {
  name: "",
  nickname: "",
  date_of_birth: "",
  universe: "",
  main_power: "",
  avatar_url: "",
};

function fieldError(errors: ApiFieldError[], field: string) {
  return errors.find((error) => error.field === field)?.message;
}

// Não usamos useEffect para resetar o formulário: o pai (HeroesDashboard) troca
// a `key` deste componente a cada abertura, o que já força o React a remontar
// e recomeçar com o estado inicial limpo — dispensando um efeito para isso.
export function HeroFormModal({ open, title, initialValue, isSubmitting, fieldErrors, onSubmit, onClose }: HeroFormModalProps) {
  const [form, setForm] = useState<HeroInput>(() => initialValue ?? emptyForm);

  function handleChange(field: keyof HeroInput, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSubmit(form)}
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-lg bg-blue-800 px-4 py-2 text-sm font-medium text-white hover:bg-blue-900 disabled:opacity-50"
          >
            {isSubmitting && <Spinner className="h-4 w-4 text-white" />}
            Salvar
          </button>
        </>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={(event) => event.preventDefault()}>
        <Field label="Nome completo" error={fieldError(fieldErrors, "name")}>
          <input
            value={form.name}
            onChange={(event) => handleChange("name", event.target.value)}
            placeholder="Digite o nome completo"
            className="input"
          />
        </Field>
        <Field label="Nome de guerra" error={fieldError(fieldErrors, "nickname")}>
          <input
            value={form.nickname}
            onChange={(event) => handleChange("nickname", event.target.value)}
            placeholder="Digite o nome de guerra"
            className="input"
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Data de nascimento" error={fieldError(fieldErrors, "date_of_birth")}>
            <input
              type="date"
              value={form.date_of_birth.slice(0, 10)}
              onChange={(event) => handleChange("date_of_birth", event.target.value)}
              className="input"
            />
          </Field>
          <Field label="Universo" error={fieldError(fieldErrors, "universe")}>
            <input
              value={form.universe}
              onChange={(event) => handleChange("universe", event.target.value)}
              placeholder="Digite o universo"
              className="input"
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Habilidade" error={fieldError(fieldErrors, "main_power")}>
            <input
              value={form.main_power}
              onChange={(event) => handleChange("main_power", event.target.value)}
              placeholder="Digite a habilidade"
              className="input"
            />
          </Field>
          <Field label="Avatar" error={fieldError(fieldErrors, "avatar_url")}>
            <input
              value={form.avatar_url}
              onChange={(event) => handleChange("avatar_url", event.target.value)}
              placeholder="Digite a URL"
              className="input"
            />
          </Field>
        </div>
      </form>
    </Modal>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-gray-700">{label}</span>
      {children}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  );
}
