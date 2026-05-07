import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PageHeader({
  title,
  description,
  createHref,
  createLabel = "Добавить",
}: {
  title: string;
  description?: string;
  createHref?: string;
  createLabel?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {createHref && (
        <Button asChild>
          <Link href={createHref}>
            <Plus className="mr-1 h-4 w-4" /> {createLabel}
          </Link>
        </Button>
      )}
    </div>
  );
}
