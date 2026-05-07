import Link from "next/link";
import { cn } from "@/lib/utils";
import { publicUrl } from "@/lib/s3";

export type CategoryCardProps = {
  name: string;
  href: string;
  imageKey?: string | null;
  active?: boolean;
};

export function CategoryCard({
  name,
  href,
  imageKey,
  active,
}: CategoryCardProps) {
  const url = publicUrl(imageKey ?? null);
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col overflow-hidden rounded-lg border bg-white shadow-card transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-card-hover",
        active && "border-brand ring-2 ring-brand/40",
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {url ? (
          <img
            src={url}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs">
            нет изображения
          </div>
        )}
      </div>
      <div
        className={cn(
          "border-t px-3 py-2.5 text-center text-[13px] font-medium leading-tight text-foreground transition-colors group-hover:text-brand",
          active && "text-brand",
        )}
      >
        {name}
      </div>
    </Link>
  );
}
