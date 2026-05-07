"use client";

import { useState } from "react";
import { Send, MessageCircle, CheckCircle2 } from "lucide-react";

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="relative bg-[#DADCDE]">
      <div className="container-page relative">
        <div className="grid grid-cols-1 items-center gap-6 py-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10 lg:py-12">
          <div className="space-y-3">
            <h3 className="text-xl font-bold">Закажите звонок</h3>
            <p className="max-w-xl text-sm text-muted-foreground">
              Перезвоним в течение 15 минут в рабочее время и поможем подобрать
              оригинальные или аналоговые запчасти.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
                setTimeout(() => setSubmitted(false), 3000);
              }}
              className="flex max-w-md flex-col gap-2 sm:flex-row"
            >
              <input
                required
                type="tel"
                placeholder="+7 (___) ___-__-__"
                className="h-11 flex-1 rounded-md border border-transparent bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-brand px-5 text-sm font-medium text-white hover:bg-brand-dark"
              >
                {submitted ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" /> Принято
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Жду звонка
                  </>
                )}
              </button>
              <button
                type="button"
                title="Написать в WhatsApp"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-green-500 text-white hover:bg-green-600"
              >
                <MessageCircle className="h-4 w-4" />
              </button>
            </form>
          </div>

          <div className="hidden h-full lg:block" />
        </div>
        <img
          src="/images/man7.png"
          alt=""
          className="pointer-events-none absolute bottom-0 right-4 hidden h-[110%] w-auto max-w-none select-none object-contain object-bottom lg:block"
        />
      </div>
    </section>
  );
}
