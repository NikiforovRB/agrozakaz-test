"use client";

import Link from "next/link";
import { Search, ShoppingCart, User, Menu, Heart, Clock, MapPin, Phone } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="bg-[#033D25] text-white">
      <div>
        <div className="container-page flex items-center justify-between gap-4 py-2 text-[12px] text-white/80">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Пн-Вс 9:00 — 21:00
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              Адрес магазина: ул. Горбунова, д.12 корп.2 стр.5 (56 км МКАД)
            </span>
          </div>
          <a
            href="tel:+74957951468"
            className="inline-flex items-center gap-1.5 whitespace-nowrap font-medium text-white hover:opacity-80"
          >
            <Phone className="h-3.5 w-3.5" />
            +7 (495) 795-14-68
          </a>
        </div>
      </div>

      <div className="container-page flex items-center gap-3 py-3 lg:py-4">
        <Link href="/" className="flex shrink-0 items-center" aria-label="АгроЗаказ">
          <img
            src="/images/logo.svg"
            alt="АгроЗаказ"
            className="h-8 w-auto lg:h-9"
          />
        </Link>

        <Link
          href="/catalog"
          className="hidden h-10 shrink-0 items-center gap-2 rounded-md bg-[#2D9E71] px-4 text-sm font-medium text-white transition-colors hover:bg-[#268A62] active:bg-[#22785a] lg:inline-flex"
        >
          <img src="/images/menu.svg" alt="" className="h-4 w-4" />
          Каталог
        </Link>

        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="relative ml-1 flex flex-1 items-center"
        >
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по артикулу, названию или модели техники..."
            className="h-10 w-full rounded-md bg-white pl-4 pr-14 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2D9E71]/40"
          />
          <button
            type="submit"
            aria-label="Найти"
            className="absolute right-1 top-1/2 inline-flex h-8 w-12 -translate-y-1/2 items-center justify-center rounded-md bg-[#2D9E71] text-white transition-colors hover:bg-[#268A62] active:bg-[#22785a]"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>

        <button
          type="button"
          className="hidden h-10 w-10 items-center justify-center rounded-md hover:bg-white/10 lg:flex"
          aria-label="Сравнение"
          title="Сравнение"
        >
          <img src="/images/bar.svg" alt="" className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="hidden h-10 w-10 items-center justify-center rounded-md hover:bg-white/10 lg:flex"
          aria-label="Избранное"
          title="Избранное"
        >
          <Heart className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="hidden h-10 w-10 items-center justify-center rounded-md hover:bg-white/10 lg:flex"
          aria-label="Личный кабинет"
          title="Личный кабинет"
        >
          <User className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-md hover:bg-white/10"
          aria-label="Корзина"
          title="Корзина"
        >
          <ShoppingCart className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-[10px] font-bold text-[#033D25]">
            0
          </span>
        </button>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-white/10 lg:hidden"
          aria-label="Меню"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
