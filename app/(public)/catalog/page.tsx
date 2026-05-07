import { prisma } from "@/lib/db";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { CategoryCard } from "@/components/catalog/CategoryCard";

export const dynamic = "force-dynamic";

export default async function CatalogIndexPage() {
  const categories = await prisma.category.findMany({
    where: { parentId: null, isActive: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });

  return (
    <div className="container-page space-y-5 py-5">
      <Breadcrumbs items={[{ label: "Каталог" }]} />
      <h1 className="text-xl font-bold lg:text-2xl">
        Каталог запчастей для сельхозтехники
      </h1>

      {categories.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-white p-10 text-center text-sm text-muted-foreground">
          Категории не загружены. Войдите в админку{" "}
          <a href="/superadmin" className="font-medium text-brand underline">
            /superadmin
          </a>{" "}
          и добавьте категории.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {categories.map((c) => (
            <CategoryCard
              key={c.id}
              name={c.name}
              href={`/catalog/${c.slug}`}
              imageKey={c.imageKey}
            />
          ))}
        </div>
      )}
    </div>
  );
}
