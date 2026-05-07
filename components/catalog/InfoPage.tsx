import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";

export function InfoPage({ title }: { title: string }) {
  return (
    <div className="container-page space-y-5 py-8">
      <Breadcrumbs items={[{ label: title }]} />
      <h1 className="text-2xl font-bold lg:text-3xl">{title}</h1>
      <div className="rounded-lg border border-dashed bg-white p-12 text-center">
        <div className="text-base text-muted-foreground">
          Контент на стадии заполнения
        </div>
      </div>
    </div>
  );
}
