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
  upsertProductAction,
  type ProductFormState,
} from "@/app/superadmin/actions/products";

export type CategoryOption = { id: string; name: string; depth: number };
export type WarehouseOption = { id: string; name: string };

export function ProductForm({
  initial,
  categories,
  warehouses,
}: {
  initial?: {
    id: string;
    sku: string;
    name: string;
    description: string | null;
    priceRub: number;
    stockCount: number;
    imageKey: string | null;
    warehouseId: string | null;
    categoryIds: string[];
  };
  categories: CategoryOption[];
  warehouses: WarehouseOption[];
}) {
  const router = useRouter();
  const [state, formAction] = useFormState<ProductFormState, FormData>(
    upsertProductAction,
    {},
  );
  const [imageKey, setImageKey] = useState<string | null>(initial?.imageKey ?? null);

  useEffect(() => {
    if (state.ok) {
      router.push("/superadmin/products");
    }
  }, [state.ok, router]);

  return (
    <form action={formAction} className="space-y-5 rounded-lg border bg-white p-6">
      {initial && <input type="hidden" name="id" value={initial.id} />}
      <input type="hidden" name="imageKey" value={imageKey ?? ""} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="sku">Артикул</Label>
          <Input id="sku" name="sku" required defaultValue={initial?.sku} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="priceRub">Цена, ₽</Label>
          <Input
            id="priceRub"
            name="priceRub"
            type="number"
            min={0}
            required
            defaultValue={initial?.priceRub ?? 0}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="stockCount">Сколько штук в наличии</Label>
          <Input
            id="stockCount"
            name="stockCount"
            type="number"
            min={0}
            required
            defaultValue={initial?.stockCount ?? 0}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="name">Название</Label>
        <Input id="name" name="name" required defaultValue={initial?.name} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="warehouseId">Склад</Label>
        <select
          id="warehouseId"
          name="warehouseId"
          defaultValue={initial?.warehouseId ?? ""}
          className="flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        >
          <option value="">— не указан —</option>
          {warehouses.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Описание</Label>
        <Textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={initial?.description ?? ""}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Категории (можно выбрать несколько)</Label>
        <div className="max-h-48 overflow-y-auto rounded-md border p-3">
          {categories.length === 0 ? (
            <div className="text-xs text-muted-foreground">
              Сначала создайте категории
            </div>
          ) : (
            categories.map((c) => (
              <label
                key={c.id}
                className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 text-sm hover:bg-muted/60"
              >
                <input
                  type="checkbox"
                  name="categoryIds"
                  value={c.id}
                  defaultChecked={initial?.categoryIds.includes(c.id) ?? false}
                  className="h-4 w-4 rounded border-border text-brand focus:ring-brand"
                />
                <span style={{ paddingLeft: `${c.depth * 12}px` }}>{c.name}</span>
              </label>
            ))
          )}
        </div>
      </div>

      <ImageUpload
        folder="products"
        value={imageKey}
        onChange={setImageKey}
        label="Изображение товара"
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
