import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { UserForm } from "@/components/admin/UserForm";
import { PageHeader } from "@/components/admin/PageHeader";

export const dynamic = "force-dynamic";

export default async function EditUserPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await prisma.user.findUnique({ where: { id: params.id } });
  if (!user) notFound();
  return (
    <div className="space-y-4">
      <PageHeader title={`Пользователь: ${user.email}`} />
      <UserForm
        initial={{
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }}
      />
    </div>
  );
}
