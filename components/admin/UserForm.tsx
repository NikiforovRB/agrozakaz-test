"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  upsertUserAction,
  type UserFormState,
} from "@/app/superadmin/actions/users";

export function UserForm({
  initial,
}: {
  initial?: {
    id: string;
    email: string;
    name: string | null;
    role: "SUPERADMIN" | "ADMIN";
  };
}) {
  const router = useRouter();
  const [state, formAction] = useFormState<UserFormState, FormData>(
    upsertUserAction,
    {},
  );

  useEffect(() => {
    if (state.ok) {
      router.push("/superadmin/users");
    }
  }, [state.ok, router]);

  return (
    <form action={formAction} className="space-y-5 rounded-lg border bg-white p-6">
      {initial && <input type="hidden" name="id" value={initial.id} />}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            defaultValue={initial?.email}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="name">Имя</Label>
          <Input id="name" name="name" defaultValue={initial?.name ?? ""} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="password">
            Пароль{" "}
            {initial && (
              <span className="text-xs font-normal text-muted-foreground">
                (оставьте пустым чтобы не менять)
              </span>
            )}
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            required={!initial}
            placeholder={initial ? "не менять" : "минимум 6 символов"}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="role">Роль</Label>
          <select
            id="role"
            name="role"
            required
            defaultValue={initial?.role ?? "ADMIN"}
            className="flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="SUPERADMIN">Суперадминистратор</option>
            <option value="ADMIN">Администратор</option>
          </select>
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
