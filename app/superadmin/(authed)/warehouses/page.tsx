import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteWarehouseAction } from "@/app/superadmin/actions/warehouses";

export const dynamic = "force-dynamic";

export default async function WarehousesPage() {
  const warehouses = await prisma.warehouse.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });

  return (
    <div className="space-y-4">
      <PageHeader
        title="Склады"
        description="Список складов, по которым распределены товары."
        createHref="/superadmin/warehouses/new"
        createLabel="Добавить склад"
      />
      <div className="overflow-hidden rounded-lg border bg-white">
        <div className="grid grid-cols-[minmax(160px,1fr)_minmax(120px,1fr)_minmax(180px,2fr)_100px_100px_140px] items-center gap-3 border-b bg-muted px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          <div>Название</div>
          <div>Город</div>
          <div>Адрес</div>
          <div className="text-center">Товаров</div>
          <div className="text-center">Статус</div>
          <div className="text-right">Действия</div>
        </div>
        {warehouses.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Складов пока нет
          </div>
        ) : (
          warehouses.map((w) => (
            <div
              key={w.id}
              className="grid grid-cols-[minmax(160px,1fr)_minmax(120px,1fr)_minmax(180px,2fr)_100px_100px_140px] items-center gap-3 border-b px-3 py-2 text-sm"
            >
              <div className="font-medium">{w.name}</div>
              <div className="text-muted-foreground">{w.city ?? "—"}</div>
              <div className="text-muted-foreground">{w.address ?? "—"}</div>
              <div className="text-center tabular-nums">{w._count.products}</div>
              <div className="text-center">
                {w.isActive ? (
                  <span className="inline-flex rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700">
                    активен
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                    скрыт
                  </span>
                )}
              </div>
              <div className="flex items-center justify-end gap-2">
                <Link
                  href={`/superadmin/warehouses/${w.id}`}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md border bg-white px-2 text-xs hover:bg-muted"
                >
                  <Pencil className="h-3.5 w-3.5" /> Изменить
                </Link>
                <DeleteButton
                  action={deleteWarehouseAction.bind(null, w.id)}
                  iconOnly
                  confirmMessage={`Удалить склад "${w.name}"?`}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
