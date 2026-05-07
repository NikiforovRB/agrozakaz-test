import Link from "next/link";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

const COLUMNS: Array<{ title: string; items: string[] }> = [
  {
    title: "Каталог",
    items: [
      "Тракторы",
      "Комбайны",
      "Прицепная техника",
      "Опрыскиватели",
      "Запчасти",
    ],
  },
  {
    title: "Покупателям",
    items: [
      "Доставка и оплата",
      "Возврат и обмен",
      "Гарантия",
      "Оптовикам",
      "FAQ",
    ],
  },
  {
    title: "Компания",
    items: [
      "Партнерская программа",
      "Инвесторам",
      "Политика компании",
      "Пользовательское соглашение",
      "Блог",
      "Гарантии и ремонт",
      "Способы покупки",
      "Доставка",
      "Контакты",
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-brand-darker text-white/80">
      <div className="container-page grid grid-cols-1 gap-8 py-10 md:grid-cols-4">
        <div className="space-y-4">
          <Link href="/" className="inline-flex items-center" aria-label="АгроЗаказ">
            <img
              src="/images/logo.svg"
              alt="АгроЗаказ"
              className="h-9 w-auto"
            />
          </Link>
          <div className="space-y-2 text-sm">
            <a
              href="tel:+74957951468"
              className="flex items-center gap-2 hover:text-white"
            >
              <Phone className="h-4 w-4" /> +7 (495) 795-14-68
            </a>
            <a
              href="mailto:info@agrozakaz.ru"
              className="flex items-center gap-2 hover:text-white"
            >
              <Mail className="h-4 w-4" /> info@agrozakaz.ru
            </a>
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span>г. Москва, ул. Сельскохозяйственная, 12, корп. 3</span>
            </div>
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-white">
              {col.title}
            </h4>
            <ul className="space-y-2 text-sm">
              {col.items.map((it) => (
                <li key={it}>
                  <Link href="#" className="hover:text-white">
                    {it}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-4 text-xs text-white/60 md:flex-row">
          <div>© {new Date().getFullYear()} АгроЗаказ. Все права защищены.</div>
          <div className="flex items-center gap-3">
            <Link href="#" className="hover:text-white">
              Политика конфиденциальности
            </Link>
            <Link href="#" className="hover:text-white">
              Публичная оферта
            </Link>
          </div>
        </div>
      </div>

      <a
        href="https://wa.me/74957951468"
        title="WhatsApp"
        className="fixed bottom-6 right-6 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-card-hover transition-transform hover:scale-105"
      >
        <MessageCircle className="h-5 w-5" />
      </a>
    </footer>
  );
}
