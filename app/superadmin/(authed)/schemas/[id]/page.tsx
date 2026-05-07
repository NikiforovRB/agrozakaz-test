import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { SchemaForm } from "@/components/admin/SchemaForm";
import { MarkerEditor } from "@/components/admin/MarkerEditor";
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

export default async function EditSchemaPage({
  params,
}: {
  params: { id: string };
}) {
  const [schema, cats, products] = await Promise.all([
    prisma.schema.findUnique({
      where: { id: params.id },
      include: { markers: { orderBy: { position: "asc" } } },
    }),
    prisma.category.findMany({
      select: { id: true, name: true, parentId: true },
      orderBy: [{ order: "asc" }, { name: "asc" }],
    }),
    prisma.product.findMany({
      select: { id: true, sku: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);
  if (!schema) notFound();

  return (
    <div className="space-y-6">
      <PageHeader title={`Схема: ${schema.title}`} />
      <SchemaForm
        initial={{
          id: schema.id,
          title: schema.title,
          description: schema.description,
          imageKey: schema.imageKey,
          categoryId: schema.categoryId,
          order: schema.order,
        }}
        categories={buildOptions(cats)}
      />
      <div className="space-y-3 rounded-lg border bg-white p-6">
        <h2 className="text-lg font-bold">Редактор маркеров</h2>
        <MarkerEditor
          schemaId={schema.id}
          imageKey={schema.imageKey}
          initialMarkers={schema.markers.map((m) => ({
            id: m.id,
            position: m.position,
            label: m.label,
            x: m.x,
            y: m.y,
            productId: m.productId,
          }))}
          products={products}
        />
      </div>
    </div>
  );
}
