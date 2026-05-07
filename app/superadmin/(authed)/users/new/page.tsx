import { UserForm } from "@/components/admin/UserForm";
import { PageHeader } from "@/components/admin/PageHeader";

export default function NewUserPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="Новый пользователь" />
      <UserForm />
    </div>
  );
}
