import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
import { publicUrl } from "@/lib/s3";
import { formatPrice } from "@/lib/utils";
import { PageHeader } from "@/components/admin/PageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteProductAction } from "@/app/superadmin/actions/products";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <PageHeader
        title="Товары"
        description="Запчасти и расходники, которые отображаются в каталоге и привязываются к маркерам схем."
        createHref="/superadmin/products/new"
        createLabel="Добавить товар"
      />
      <div className="overflow-hidden rounded-lg border bg-white">
        <div className="grid grid-cols-[60px_minmax(120px,1fr)_minmax(220px,2fr)_120px_100px_140px] items-center gap-3 border-b bg-muted px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          <div></div>
          <div>Артикул</div>
          <div>Название</div>
          <div className="text-right">Цена</div>
          <div className="text-center">Статус</div>
          <div className="text-right">Действия</div>
        </div>
        {products.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Товаров пока нет
          </div>
        ) : (
          products.map((p) => {
            const url = publicUrl(p.imageKey);
            return (
              <div
                key={p.id}
                className="grid grid-cols-[60px_minmax(120px,1fr)_minmax(220px,2fr)_120px_100px_140px] items-center gap-3 border-b px-3 py-2"
              >
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded border bg-muted">
                  {url ? (
                    <img src={url} alt="" className="h-full w-full object-contain" />
                  ) : (
                    <span className="text-[10px] text-muted-foreground">img</span>
                  )}
                </div>
                <div className="font-mono text-xs text-muted-foreground">
                  {p.sku}
                </div>
                <div className="text-sm">{p.name}</div>
                <div className="text-right text-sm font-semibold tabular-nums">
                  {formatPrice(p.priceRub)}
                </div>
                <div className="text-center">
                  {p.inStock ? (
                    <span className="inline-flex rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700">
                      в наличии
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-medium text-orange-700">
                      под заказ
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/superadmin/products/${p.id}`}
                    className="inline-flex h-8 items-center gap-1.5 rounded-md border bg-white px-2 text-xs hover:bg-muted"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Изменить
                  </Link>
                  <DeleteButton
                    action={deleteProductAction.bind(null, p.id)}
                    iconOnly
                    confirmMessage={`Удалить товар "${p.name}"?`}
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
