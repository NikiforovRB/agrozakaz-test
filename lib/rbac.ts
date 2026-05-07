import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    redirect("/superadmin/login");
  }
  return session;
}

export async function requireSuperAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPERADMIN") {
    redirect("/superadmin/login");
  }
  return session;
}
