"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderTree,
  ImageIcon,
  Package,
  Warehouse as WarehouseIcon,
  Users,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/superadmin/actions/auth";

const ITEMS = [
  { href: "/superadmin", label: "Дашборд", icon: LayoutDashboard, exact: true },
  { href: "/superadmin/categories", label: "Категории", icon: FolderTree },
  { href: "/superadmin/schemas", label: "Схемы", icon: ImageIcon },
  { href: "/superadmin/products", label: "Товары", icon: Package },
  { href: "/superadmin/warehouses", label: "Склады", icon: WarehouseIcon },
  { href: "/superadmin/users", label: "Пользователи", icon: Users },
];

export function Sidebar({
  user,
}: {
  user: { name?: string | null; email?: string | null; role?: string };
}) {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r bg-brand-darker text-white">
      <div className="flex flex-col gap-1 px-5 py-4">
        <img
          src="/images/logo.svg"
          alt="АгроЗаказ"
          className="h-8 w-auto"
        />
        <div className="text-[11px] uppercase tracking-wide text-white/60">
          superadmin
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 px-2 py-2">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-white/15 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-3 py-3">
        <Link
          href="/catalog"
          target="_blank"
          className="mb-2 flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-white/70 hover:bg-white/10 hover:text-white"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Открыть каталог
        </Link>
        <div className="rounded-md bg-white/10 p-2">
          <div className="truncate text-xs font-medium text-white">
            {user.name ?? user.email}
          </div>
          <div className="truncate text-[10px] text-white/60">{user.email}</div>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="mt-2 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-white/70 hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" />
            Выйти
          </button>
        </form>
      </div>
    </aside>
  );
}
