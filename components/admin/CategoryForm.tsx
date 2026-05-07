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
  upsertCategoryAction,
  type CategoryFormState,
} from "@/app/superadmin/actions/categories";

export type CategoryOption = { id: string; name: string; depth: number };

export function CategoryForm({
  initial,
  parents,
}: {
  initial?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    parentId: string | null;
    imageKey: string | null;
    order: number;
    isActive: boolean;
  };
  parents: CategoryOption[];
}) {
  const router = useRouter();
  const [state, formAction] = useFormState<CategoryFormState, FormData>(
    upsertCategoryAction,
    {},
  );
  const [imageKey, setImageKey] = useState<string | null>(initial?.imageKey ?? null);

  useEffect(() => {
    if (state.ok) {
      router.push("/superadmin/categories");
    }
  }, [state.ok, router]);

  return (
    <form action={formAction} className="space-y-5 rounded-lg border bg-white p-6">
      {initial && <input type="hidden" name="id" value={initial.id} />}
      <input type="hidden" name="imageKey" value={imageKey ?? ""} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Название</Label>
          <Input
            id="name"
            name="name"
            required
            defaultValue={initial?.name}
            placeholder="Например: ZimAri CS10D"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="slug">Slug (необязательно)</Label>
          <Input
            id="slug"
            name="slug"
            defaultValue={initial?.slug}
            placeholder="генерируется автоматически"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Описание</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={initial?.description ?? ""}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="parentId">Родительская категория</Label>
          <select
            id="parentId"
            name="parentId"
            defaultValue={initial?.parentId ?? ""}
            className="flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="">— корневая —</option>
            {parents
              .filter((p) => p.id !== initial?.id)
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {"— ".repeat(p.depth) + p.name}
                </option>
              ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="order">Порядок сортировки</Label>
          <Input
            id="order"
            name="order"
            type="number"
            defaultValue={initial?.order ?? 0}
          />
        </div>
      </div>

      <ImageUpload
        folder="categories"
        value={imageKey}
        onChange={setImageKey}
        label="Изображение / схема узла"
      />

      <div className="flex items-center gap-2">
        <input
          id="isActive"
          name="isActive"
          type="checkbox"
          defaultChecked={initial?.isActive ?? true}
          className="h-4 w-4 rounded border-border text-brand focus:ring-brand"
        />
        <Label htmlFor="isActive" className="cursor-pointer">
          Активна (отображается в публичном каталоге)
        </Label>
      </div>

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
