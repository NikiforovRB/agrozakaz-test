"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";

export type PartRow = {
  markerId: string;
  position: number;
  sku: string;
  name: string;
  priceRub: number;
  inStock: boolean;
  quantity?: number;
};

export type PartsTableProps = {
  rows: PartRow[];
  selectedMarkerId?: string | null;
  onSelectMarker?: (markerId: string) => void;
};

export function PartsTable({
  rows,
  selectedMarkerId,
  onSelectMarker,
}: PartsTableProps) {
  const [added, setAdded] = useState<Record<string, boolean>>({});

  const handleAdd = (id: string) => {
    setAdded((s) => ({ ...s, [id]: true }));
    setTimeout(() => {
      setAdded((s) => ({ ...s, [id]: false }));
    }, 1500);
  };

  if (rows.length === 0) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border bg-white p-8 text-sm text-muted-foreground">
        Маркеры на схеме не размещены
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <div className="border-b bg-muted">
        <div className="grid grid-cols-[40px_minmax(80px,1fr)_minmax(180px,2fr)_80px_120px_72px] items-center gap-2 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          <div className="text-center">№</div>
          <div>Артикул</div>
          <div>Наименование</div>
          <div className="text-center">Кол-во</div>
          <div className="text-right">Цена</div>
          <div className="text-center">В корзину</div>
        </div>
      </div>
      <div className="max-h-[500px] divide-y overflow-y-auto">
        {rows.map((row) => {
          const isActive = selectedMarkerId === row.markerId;
          const isAdded = added[row.markerId];
          return (
            <div
              key={row.markerId}
              onMouseEnter={() => onSelectMarker?.(row.markerId)}
              className={cn(
                "grid grid-cols-[40px_minmax(80px,1fr)_minmax(180px,2fr)_80px_120px_72px] items-center gap-2 px-3 py-2.5 text-sm transition-colors",
                isActive ? "bg-brand/5" : "hover:bg-muted/60",
              )}
            >
              <div className="flex justify-center">
                <span
                  className={cn(
                    "inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold",
                    isActive
                      ? "bg-yellow-400 text-brand-darker"
                      : "bg-brand text-white",
                  )}
                >
                  {row.position}
                </span>
              </div>
              <div className="font-mono text-[12px] text-muted-foreground">
                {row.sku}
              </div>
              <div className="text-foreground">
                <div className="line-clamp-2">{row.name}</div>
                {!row.inStock && (
                  <div className="mt-0.5 text-[10px] font-medium uppercase text-orange-600">
                    под заказ
                  </div>
                )}
              </div>
              <div className="text-center text-muted-foreground">
                {row.quantity ?? 1}
              </div>
              <div className="text-right font-semibold tabular-nums">
                {formatPrice(row.priceRub)}
              </div>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => handleAdd(row.markerId)}
                  className={cn(
                    "inline-flex h-8 w-8 items-center justify-center rounded-md border transition-all",
                    isAdded
                      ? "border-brand bg-brand text-white"
                      : "border-border bg-white text-brand hover:border-brand hover:bg-brand/5",
                  )}
                  aria-label="Добавить в корзину"
                >
                  {isAdded ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <ShoppingCart className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
