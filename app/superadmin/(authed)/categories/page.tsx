import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
import { publicUrl } from "@/lib/s3";
import { PageHeader } from "@/components/admin/PageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteCategoryAction } from "@/app/superadmin/actions/categories";

export const dynamic = "force-dynamic";

type Cat = {
  id: string;
  name: string;
  slug: string;
  imageKey: string | null;
  parentId: string | null;
  isActive: boolean;
  order: number;
  children: Cat[];
};

function buildTree(rows: Omit<Cat, "children">[]): Cat[] {
  const map = new Map<string, Cat>();
  rows.forEach((r) => map.set(r.id, { ...r, children: [] }));
  const roots: Cat[] = [];
  for (const cat of map.values()) {
    if (cat.parentId && map.has(cat.parentId)) {
      map.get(cat.parentId)!.children.push(cat);
    } else {
      roots.push(cat);
    }
  }
  return roots;
}

function CategoryRow({ cat, depth }: { cat: Cat; depth: number }) {
  const url = publicUrl(cat.imageKey);
  return (
    <>
      <div
        className="grid grid-cols-[40px_minmax(160px,2fr)_minmax(120px,1fr)_80px_80px_140px] items-center gap-3 border-b px-3 py-2"
        style={{ paddingLeft: `${12 + depth * 24}px` }}
      >
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded border bg-muted">
          {url ? (
            <img src={url} alt="" className="h-full w-full object-contain" />
          ) : (
            <span className="text-[10px] text-muted-foreground">img</span>
          )}
        </div>
        <div>
          <div className="text-sm font-medium">{cat.name}</div>
          <div className="font-mono text-[10px] text-muted-foreground">
            /{cat.slug}
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          {cat.parentId ? "вложенная" : "корневая"}
        </div>
        <div className="text-center text-xs text-muted-foreground">
          {cat.order}
        </div>
        <div className="text-center">
          {cat.isActive ? (
            <span className="inline-flex rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700">
              активна
            </span>
          ) : (
            <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
              скрыта
            </span>
          )}
        </div>
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/superadmin/categories/${cat.id}`}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border bg-white px-2 text-xs hover:bg-muted"
          >
            <Pencil className="h-3.5 w-3.5" /> Изменить
          </Link>
          <DeleteButton
            action={deleteCategoryAction.bind(null, cat.id)}
            iconOnly
            confirmMessage={`Удалить категорию "${cat.name}"?`}
          />
        </div>
      </div>
      {cat.children
        .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
        .map((child) => (
          <CategoryRow key={child.id} cat={child} depth={depth + 1} />
        ))}
    </>
  );
}

export default async function CategoriesPage() {
  const rows = await prisma.category.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });
  const tree = buildTree(rows);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Категории"
        description="Дерево категорий каталога. Верхний уровень — типы техники, ниже — модели и узлы."
        createHref="/superadmin/categories/new"
        createLabel="Добавить категорию"
      />
      <div className="overflow-hidden rounded-lg border bg-white">
        <div className="grid grid-cols-[40px_minmax(160px,2fr)_minmax(120px,1fr)_80px_80px_140px] items-center gap-3 border-b bg-muted px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          <div></div>
          <div>Название</div>
          <div>Тип</div>
          <div className="text-center">Порядок</div>
          <div className="text-center">Статус</div>
          <div className="text-right">Действия</div>
        </div>
        {tree.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Категорий пока нет
          </div>
        ) : (
          tree
            .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
            .map((cat) => <CategoryRow key={cat.id} cat={cat} depth={0} />)
        )}
      </div>
    </div>
  );
}
