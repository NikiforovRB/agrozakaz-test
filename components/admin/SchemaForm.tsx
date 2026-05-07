"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/admin/ImageUpload";
import {
  upsertSchemaAction,
  type SchemaFormState,
} from "@/app/superadmin/actions/schemas";

export type CategoryOption = { id: string; name: string; depth: number };

export function SchemaForm({
  initial,
  categories,
}: {
  initial?: {
    id: string;
    title: string;
    description: string | null;
    imageKey: string;
    categoryId: string;
    order: number;
  };
  categories: CategoryOption[];
}) {
  const router = useRouter();
  const [state, formAction] = useFormState<SchemaFormState, FormData>(
    upsertSchemaAction,
    {},
  );
  const [imageKey, setImageKey] = useState<string | null>(initial?.imageKey ?? null);

  useEffect(() => {
    if (state.ok) {
      if (state.id) {
        router.push(`/superadmin/schemas/${state.id}`);
      } else {
        router.push("/superadmin/schemas");
      }
      router.refresh();
    }
  }, [state.ok, state.id, router]);

  return (
    <form action={formAction} className="space-y-5 rounded-lg border bg-white p-6">
      {initial && <input type="hidden" name="id" value={initial.id} />}
      <input type="hidden" name="imageKey" value={imageKey ?? ""} />

      <div className="space-y-1.5">
        <Label htmlFor="title">Название схемы</Label>
        <Input id="title" name="title" required defaultValue={initial?.title} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Описание</Label>
        <Textarea
          id="description"
          name="description"
          rows={2}
          defaultValue={initial?.description ?? ""}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="categoryId">Категория</Label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={initial?.categoryId ?? ""}
            className="flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="">— выберите категорию —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {"— ".repeat(c.depth) + c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="order">Порядок</Label>
          <Input
            id="order"
            name="order"
            type="number"
            defaultValue={initial?.order ?? 0}
          />
        </div>
      </div>

      <ImageUpload
        folder="schemas"
        value={imageKey}
        onChange={setImageKey}
        label="Изображение схемы (большой технический чертеж)"
      />

      {state.error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div className="flex items-center gap-2">
        <SubmitButton hasInitial={Boolean(initial)} />
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Отмена
        </Button>
      </div>
    </form>
  );
}

function SubmitButton({ hasInitial }: { hasInitial: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Сохранение..." : hasInitial ? "Сохранить" : "Создать"}
    </Button>
  );
}
