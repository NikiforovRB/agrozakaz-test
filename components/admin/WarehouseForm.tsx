"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  upsertWarehouseAction,
  type WarehouseFormState,
} from "@/app/superadmin/actions/warehouses";

export function WarehouseForm({
  initial,
}: {
  initial?: {
    id: string;
    name: string;
    city: string | null;
    address: string | null;
    order: number;
    isActive: boolean;
  };
}) {
  const router = useRouter();
  const [state, formAction] = useFormState<WarehouseFormState, FormData>(
    upsertWarehouseAction,
    {},
  );

  useEffect(() => {
    if (state.ok) {
      router.push("/superadmin/warehouses");
    }
  }, [state.ok, router]);

  return (
    <form action={formAction} className="space-y-5 rounded-lg border bg-white p-6">
      {initial && <input type="hidden" name="id" value={initial.id} />}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Название</Label>
          <Input
            id="name"
            name="name"
            required
            defaultValue={initial?.name}
            placeholder="Например: Склад Москва"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="city">Город</Label>
          <Input
            id="city"
            name="city"
            defaultValue={initial?.city ?? ""}
            placeholder="Москва"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="address">Адрес</Label>
        <Input
          id="address"
          name="address"
          defaultValue={initial?.address ?? ""}
          placeholder="ул. ..., д. ..."
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="order">Порядок сортировки</Label>
          <Input
            id="order"
            name="order"
            type="number"
            defaultValue={initial?.order ?? 0}
          />
        </div>
        <div className="flex items-end pb-1.5">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              name="isActive"
              type="checkbox"
              defaultChecked={initial?.isActive ?? true}
              className="h-4 w-4 rounded border-border text-brand focus:ring-brand"
            />
            <span className="text-sm font-medium">Активен</span>
          </label>
        </div>
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
