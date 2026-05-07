import { redirect } from "next/navigation";
import { auth, signIn } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; from?: string };
}) {
  const session = await auth();
  if (session?.user) {
    redirect(searchParams.from ?? "/superadmin");
  }

  async function login(formData: FormData) {
    "use server";
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");
    const from = String(formData.get("from") ?? "/superadmin");
    await signIn("credentials", {
      email,
      password,
      redirectTo: from,
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-darker via-brand-dark to-brand p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="inline-flex h-12 items-center justify-center rounded-md bg-[#033D25] px-3">
            <img
              src="/images/logo.svg"
              alt="АгроЗаказ"
              className="h-6 w-auto"
            />
          </div>
          <div className="text-xs text-muted-foreground">
            Панель администратора
          </div>
        </div>

        {searchParams.error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            Неверный email или пароль
          </div>
        )}

        <form action={login} className="space-y-4">
          <input
            type="hidden"
            name="from"
            value={searchParams.from ?? "/superadmin"}
          />
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="admin@example.com"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full" size="lg">
            Войти
          </Button>
        </form>
      </div>
    </div>
  );
}
