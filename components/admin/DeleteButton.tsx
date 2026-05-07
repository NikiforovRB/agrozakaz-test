"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";

export function DeleteButton({
  action,
  confirmMessage = "Удалить?",
  iconOnly = false,
  label = "Удалить",
}: {
  action: () => Promise<void>;
  confirmMessage?: string;
  iconOnly?: boolean;
  label?: string;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm(confirmMessage)) return;
        startTransition(async () => {
          await action();
        });
      }}
      className={
        iconOnly
          ? "inline-flex h-8 w-8 items-center justify-center rounded-md text-red-600 hover:bg-red-50"
          : "inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
      }
      aria-label={label}
    >
      <Trash2 className="h-4 w-4" />
      {!iconOnly && (pending ? "Удаление..." : label)}
    </button>
  );
}
