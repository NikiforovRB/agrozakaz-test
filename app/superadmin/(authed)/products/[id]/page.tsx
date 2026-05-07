import { notFound } from "next/navigation";
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

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, cats] = await Promise.all([
    prisma.product.findUnique({
      where: { id: params.id },
      include: { categories: { select: { id: true } } },
    }),
    prisma.category.findMany({
      select: { id: true, name: true, parentId: true },
      orderBy: [{ order: "asc" }, { name: "asc" }],
    }),
  ]);
  if (!product) notFound();
  return (
    <div className="space-y-4">
      <PageHeader title={`Товар: ${product.name}`} />
      <ProductForm
        initial={{
          id: product.id,
          sku: product.sku,
          name: product.name,
          description: product.description,
          priceRub: product.priceRub,
          inStock: product.inStock,
          imageKey: product.imageKey,
          categoryIds: product.categories.map((c) => c.id),
        }}
        categories={buildOptions(cats)}
      />
    </div>
  );
}
