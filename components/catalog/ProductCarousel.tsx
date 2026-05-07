"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart, Check } from "lucide-react";
import { publicUrl } from "@/lib/s3";
import { formatPrice } from "@/lib/utils";

export type CarouselProduct = {
  id: string;
  sku: string;
  name: string;
  priceRub: number;
  inStock: boolean;
  imageKey: string | null;
};

export function ProductCarousel({
  title,
  products,
}: {
  title: string;
  products: CarouselProduct[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [added, setAdded] = useState<Record<string, boolean>>({});

  const scrollBy = (direction: number) => {
    const node = scrollerRef.current;
    if (!node) return;
    const cardWidth = 220;
    node.scrollBy({ left: direction * cardWidth * 2, behavior: "smooth" });
  };

  const handleAdd = (id: string) => {
    setAdded((s) => ({ ...s, [id]: true }));
    setTimeout(() => {
      setAdded((s) => ({ ...s, [id]: false }));
    }, 1500);
  };

  if (products.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border bg-white text-muted-foreground transition-colors hover:border-brand hover:text-brand"
            aria-label="Прокрутить влево"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border bg-white text-muted-foreground transition-colors hover:border-brand hover:text-brand"
            aria-label="Прокрутить вправо"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
      >
        {products.map((p) => {
          const url = publicUrl(p.imageKey);
          const isAdded = added[p.id];
          return (
            <article
              key={p.id}
              className="group flex w-[210px] shrink-0 snap-start flex-col overflow-hidden rounded-lg border bg-white shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <div className="relative aspect-square w-full bg-muted">
                {url ? (
                  <img
                    src={url}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-contain p-3"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                    нет фото
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-3">
                <div className="font-mono text-[10px] uppercase text-muted-foreground">
                  {p.sku}
                </div>
                <h3 className="line-clamp-2 min-h-[34px] text-[13px] font-medium leading-snug text-foreground">
                  {p.name}
                </h3>
                <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                  <div className="text-base font-bold tabular-nums text-foreground">
                    {formatPrice(p.priceRub)}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAdd(p.id)}
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors ${
                      isAdded
                        ? "bg-brand text-white"
                        : "bg-brand/10 text-brand hover:bg-brand hover:text-white"
                    }`}
                    aria-label="В корзину"
                  >
                    {isAdded ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <ShoppingCart className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
