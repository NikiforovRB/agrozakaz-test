import Link from "next/link";
import { prisma } from "@/lib/db";
import { FolderTree, ImageIcon, Package, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [categories, schemas, products, users] = await Promise.all([
    prisma.category.count(),
    prisma.schema.count(),
    prisma.product.count(),
    prisma.user.count(),
  ]);

  const cards = [
    {
      label: "Категорий",
      count: categories,
      href: "/superadmin/categories",
      icon: FolderTree,
    },
    {
      label: "Схем",
      count: schemas,
      href: "/superadmin/schemas",
      icon: ImageIcon,
    },
    {
      label: "Товаров",
      count: products,
      href: "/superadmin/products",
      icon: Package,
    },
    {
      label: "Пользователей",
      count: users,
      href: "/superadmin/users",
      icon: Users,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Дашборд</h1>
        <p className="text-sm text-muted-foreground">
          Сводка по содержимому каталога
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.href}
              href={c.href}
              className="flex items-center justify-between rounded-lg border bg-white p-5 transition-shadow hover:shadow-card-hover"
            >
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  {c.label}
                </div>
                <div className="mt-1 text-3xl font-bold">{c.count}</div>
              </div>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand/10 text-brand">
                <Icon className="h-5 w-5" />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="rounded-lg border bg-white p-6">
        <h2 className="mb-2 text-lg font-bold">Подсказки</h2>
        <ul className="list-inside list-disc space-y-1.5 text-sm text-muted-foreground">
          <li>
            Категории организованы в дерево: верхний уровень — типы техники,
            ниже — модели, потом — узлы (передняя рама, режущий аппарат и т.п.)
          </li>
          <li>
            Схема привязывается к категории-листу. На схему можно расставить
            маркеры — точки, ссылающиеся на конкретные товары.
          </li>
          <li>
            Загруженные изображения хранятся в S3 (Twcstorage), в папке{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
              agrozakaz-test/
            </code>
          </li>
        </ul>
      </div>
    </div>
  );
}
