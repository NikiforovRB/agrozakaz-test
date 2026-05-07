import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { WarehouseForm } from "@/components/admin/WarehouseForm";
import { PageHeader } from "@/components/admin/PageHeader";

export const dynamic = "force-dynamic";

export default async function EditWarehousePage({
  params,
}: {
  params: { id: string };
}) {
  const w = await prisma.warehouse.findUnique({ where: { id: params.id } });
  if (!w) notFound();
  return (
    <div className="space-y-4">
      <PageHeader title={`Склад: ${w.name}`} />
      <WarehouseForm
        initial={{
          id: w.id,
          name: w.name,
          city: w.city,
          address: w.address,
          order: w.order,
          isActive: w.isActive,
        }}
      />
    </div>
  );
}
