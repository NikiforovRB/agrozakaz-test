import Link from "next/link";

const TOP_NAV = [
  { label: "О магазине", href: "/about" },
  { label: "Сервисный центр", href: "/service" },
  { label: "Оплата и доставка", href: "/delivery" },
  { label: "Подбор по брендам", href: "/brands" },
  { label: "Гарантия", href: "/warranty" },
  { label: "Юридическим лицам", href: "/b2b" },
  { label: "Контакты", href: "/contacts" },
];

export function NavBar() {
  return (
    <nav className="bg-[#033D25] text-white">
      <div className="container-page flex items-center gap-1 overflow-x-auto py-0">
        {TOP_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-wide transition-colors hover:bg-white/10"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
