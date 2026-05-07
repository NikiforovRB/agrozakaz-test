import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteUserAction } from "@/app/superadmin/actions/users";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const [users, session] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "asc" } }),
    auth(),
  ]);
  const currentUserId = session?.user?.id;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Пользователи"
        description="Учётные записи доступа к панели администратора."
        createHref="/superadmin/users/new"
        createLabel="Добавить пользователя"
      />
      <div className="overflow-hidden rounded-lg border bg-white">
        <div className="grid grid-cols-[minmax(180px,2fr)_minmax(140px,1fr)_120px_140px] items-center gap-3 border-b bg-muted px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          <div>Email</div>
          <div>Имя</div>
          <div className="text-center">Роль</div>
          <div className="text-right">Действия</div>
        </div>
        {users.map((u) => (
          <div
            key={u.id}
            className="grid grid-cols-[minmax(180px,2fr)_minmax(140px,1fr)_120px_140px] items-center gap-3 border-b px-3 py-2 text-sm"
          >
            <div className="font-medium">{u.email}</div>
            <div className="text-muted-foreground">{u.name ?? "—"}</div>
            <div className="text-center">
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  u.role === "SUPERADMIN"
                    ? "bg-brand/10 text-brand"
                    : "bg-blue-50 text-blue-700"
                }`}
              >
                {u.role}
              </span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <Link
                href={`/superadmin/users/${u.id}`}
                className="inline-flex h-8 items-center gap-1.5 rounded-md border bg-white px-2 text-xs hover:bg-muted"
              >
                <Pencil className="h-3.5 w-3.5" /> Изменить
              </Link>
              {u.id !== currentUserId && (
                <DeleteButton
                  action={deleteUserAction.bind(null, u.id)}
                  iconOnly
                  confirmMessage={`Удалить пользователя "${u.email}"?`}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
