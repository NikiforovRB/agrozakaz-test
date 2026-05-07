import { prisma } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";
import { PageHeader } from "@/components/admin/PageHeader";

export const dynamic = "force-dynamic";

type Row = { id: string; name: string; parentId: string | null };

function buildOptions(rows: Row[]): { id: string; name: string; depth: number }[] {
  const map = new Map<string, Row & { children: string[] }>();
  rows.forEach((r) => map.set(r.id, { ...r, children: [] }));
  for (const r of rows) {
    if (r.parentId && map.has(r.parentId)) {
      map.get(r.parentId)!.children.push(r.id);
    }
  }
  const result: { id: string; name: string; depth: number }[] = [];
  function walk(id: string, depth: number) {
    const node = map.get(id);
    if (!node) return;
    result.push({ id: node.id, name: node.name, depth });
    for (const childId of node.children) walk(childId, depth + 1);
  }
  for (const r of rows) {
    if (!r.parentId) walk(r.id, 0);
  }
  return result;
}

export default async function NewProductPage() {
  const cats = await prisma.category.findMany({
    select: { id: true, name: true, parentId: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });
  return (
    <div className="space-y-4">
      <PageHeader title="Новый товар" />
      <ProductForm categories={buildOptions(cats)} />
    </div>
  );
}
