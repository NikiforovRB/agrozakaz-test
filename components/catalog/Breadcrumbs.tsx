import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Хлебные крошки"
      className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground"
    >
      <Link
        href="/"
        className="hover:text-brand"
      >
        Главная
      </Link>
      {items.map((c, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight className="h-3 w-3" />
          {c.href ? (
            <Link href={c.href} className="hover:text-brand">
              {c.label}
            </Link>
          ) : (
            <span className="text-foreground">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
