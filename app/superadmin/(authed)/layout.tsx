import { requireAdmin } from "@/lib/rbac";
import { Sidebar } from "@/components/admin/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();
  const user = session.user;
  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar
        user={{
          name: user.name ?? null,
          email: user.email ?? null,
          role: user.role,
        }}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
