import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Breadcrumbs, type Crumb } from "@/components/catalog/Breadcrumbs";
import { CategoryCard } from "@/components/catalog/CategoryCard";
import { SchemaSection } from "@/components/catalog/SchemaSection";
import { ProductCarousel } from "@/components/catalog/ProductCarousel";
import { ContactSection } from "@/components/catalog/ContactSection";

export const dynamic = "force-dynamic";

async function loadCategoryChain(slugs: string[]) {
  let parentId: string | null = null;
  const chain: Array<{ id: string; name: string; slug: string }> = [];
  for (const slug of slugs) {
    const cat: { id: string; name: string; slug: string; parentId: string | null } | null =
      await prisma.category.findFirst({
        where: { slug, parentId },
        select: { id: true, name: true, slug: true, parentId: true },
      });
    if (!cat) return null;
    chain.push({ id: cat.id, name: cat.name, slug: cat.slug });
    parentId = cat.id;
  }
  return chain;
}

export default async function CatalogCategoryPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const chain = await loadCategoryChain(params.slug);
  if (!chain || chain.length === 0) notFound();

  const current = chain[chain.length - 1];

  const [category, children, schema, featuredProducts] = await Promise.all([
    prisma.category.findUnique({
      where: { id: current.id },
      include: { products: true },
    }),
    prisma.category.findMany({
      where: { parentId: current.id, isActive: true },
      orderBy: [{ order: "asc" }, { name: "asc" }],
    }),
    prisma.schema.findFirst({
      where: { categoryId: current.id },
      orderBy: { order: "asc" },
      include: {
        markers: {
          orderBy: { position: "asc" },
          include: { product: true },
        },
      },
    }),
    prisma.product.findMany({
      where: {
        OR: [
          { categories: { some: { id: current.id } } },
          {
            markers: {
              some: { schema: { categoryId: current.id } },
            },
          },
        ],
      },
      include: { warehouse: { select: { name: true } } },
      take: 12,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!category) notFound();

  const breadcrumbItems: Crumb[] = [
    { label: "Каталог", href: "/catalog" },
    ...chain.map((c, i) => ({
      label: c.name,
      href:
        i === chain.length - 1
          ? undefined
          : `/catalog/${chain
              .slice(0, i + 1)
              .map((x) => x.slug)
              .join("/")}`,
    })),
  ];

  const slugPath = chain.map((c) => c.slug).join("/");

  return (
    <>
      <div className="container-page space-y-6 py-5">
      <Breadcrumbs items={breadcrumbItems} />
      <h1 className="text-xl font-bold lg:text-2xl">{category.name}</h1>
      {category.description && (
        <p className="max-w-3xl text-sm text-muted-foreground">
          {category.description}
        </p>
      )}

      {children.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {children.map((c, i) => (
            <CategoryCard
              key={c.id}
              name={c.name}
              href={`/catalog/${slugPath}/${c.slug}`}
              imageKey={c.imageKey}
              active={i === 0 && !schema}
            />
          ))}
        </div>
      )}

      {schema && (
        <SchemaSection
          title={schema.title}
          imageKey={schema.imageKey}
          markers={schema.markers.map((m) => ({
            id: m.id,
            position: m.position,
            x: m.x,
            y: m.y,
            productId: m.productId,
            productName: m.product?.name ?? null,
            productSku: m.product?.sku ?? null,
          }))}
          rows={schema.markers
            .filter((m) => m.product)
            .map((m) => ({
              markerId: m.id,
              position: m.position,
              sku: m.product!.sku,
              name: m.product!.name,
              priceRub: m.product!.priceRub,
              stockCount: m.product!.stockCount,
            }))}
        />
      )}

      {featuredProducts.length > 0 && (
        <ProductCarousel
          title="Запчасти из этой категории"
          products={featuredProducts.map((p) => ({
            id: p.id,
            sku: p.sku,
            name: p.name,
            priceRub: p.priceRub,
            stockCount: p.stockCount,
            imageKey: p.imageKey,
            warehouseName: p.warehouse?.name ?? null,
          }))}
        />
      )}
      </div>

      <ContactSection />
    </>
  );
}
