import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
import { publicUrl } from "@/lib/s3";
import { PageHeader } from "@/components/admin/PageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteSchemaAction } from "@/app/superadmin/actions/schemas";

export const dynamic = "force-dynamic";

export default async function SchemasPage() {
  const schemas = await prisma.schema.findMany({
    include: {
      category: { select: { name: true } },
      _count: { select: { markers: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className="space-y-4">
      <PageHeader
        title="Схемы"
        description="Большие технические чертежи узлов с интерактивными маркерами на запчасти."
        createHref="/superadmin/schemas/new"
        createLabel="Добавить схему"
      />
      <div className="overflow-hidden rounded-lg border bg-white">
        <div className="grid grid-cols-[80px_minmax(180px,2fr)_minmax(140px,1fr)_100px_140px] items-center gap-3 border-b bg-muted px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          <div></div>
          <div>Название</div>
          <div>Категория</div>
          <div className="text-center">Маркеров</div>
          <div className="text-right">Действия</div>
        </div>
        {schemas.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Схем пока нет
          </div>
        ) : (
          schemas.map((s) => {
            const url = publicUrl(s.imageKey);
            return (
              <div
                key={s.id}
                className="grid grid-cols-[80px_minmax(180px,2fr)_minmax(140px,1fr)_100px_140px] items-center gap-3 border-b px-3 py-2"
              >
                <div className="flex h-14 w-16 items-center justify-center overflow-hidden rounded border bg-muted">
                  {url ? (
                    <img src={url} alt="" className="h-full w-full object-contain" />
                  ) : (
                    <span className="text-[10px] text-muted-foreground">img</span>
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium">{s.title}</div>
                  {s.description && (
                    <div className="line-clamp-1 text-xs text-muted-foreground">
                      {s.description}
                    </div>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {s.category.name}
                </div>
                <div className="text-center text-sm tabular-nums">
                  {s._count.markers}
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/superadmin/schemas/${s.id}`}
                    className="inline-flex h-8 items-center gap-1.5 rounded-md border bg-white px-2 text-xs hover:bg-muted"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Изменить
                  </Link>
                  <DeleteButton
                    action={deleteSchemaAction.bind(null, s.id)}
                    iconOnly
                    confirmMessage={`Удалить схему "${s.title}"?`}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
