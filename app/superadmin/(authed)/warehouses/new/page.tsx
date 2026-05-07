import { WarehouseForm } from "@/components/admin/WarehouseForm";
import { PageHeader } from "@/components/admin/PageHeader";

export default function NewWarehousePage() {
  return (
    <div className="space-y-4">
      <PageHeader title="Новый склад" />
      <WarehouseForm />
    </div>
  );
}
