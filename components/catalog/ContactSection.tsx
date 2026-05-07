"use client";

import { useState } from "react";
import { Send, MessageCircle, CheckCircle2 } from "lucide-react";

export function ContactSection() {
  const [submittedLeft, setSubmittedLeft] = useState(false);
  const [submittedRight, setSubmittedRight] = useState(false);

  return (
    <section className="rounded-lg border bg-muted/40">
      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
        <div className="space-y-3">
          <h3 className="text-base font-bold">Не нашли что искали?</h3>
          <p className="text-sm text-muted-foreground">
            Напишите нам артикул или модель техники — менеджер найдёт нужную
            запчасть и уточнит срок поставки.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmittedLeft(true);
              setTimeout(() => setSubmittedLeft(false), 3000);
            }}
            className="flex flex-col gap-2"
          >
            <input
              required
              type="text"
              placeholder="Артикул, модель или описание"
              className="h-10 rounded-md border bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-brand text-sm font-medium text-white hover:bg-brand-dark"
            >
              {submittedLeft ? (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Запрос отправлен
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" /> Отправить запрос
                </>
              )}
            </button>
          </form>
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-bold">Закажите звонок</h3>
          <p className="text-sm text-muted-foreground">
            Перезвоним в течение 15 минут в рабочее время и поможем подобрать
            оригинальные или аналоговые запчасти.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmittedRight(true);
              setTimeout(() => setSubmittedRight(false), 3000);
            }}
            className="flex flex-col gap-2"
          >
            <input
              required
              type="tel"
              placeholder="+7 (___) ___-__-__"
              className="h-10 rounded-md border bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-brand text-sm font-medium text-white hover:bg-brand-dark"
              >
                {submittedRight ? (
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
                className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-green-500 text-white hover:bg-green-600"
              >
                <MessageCircle className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>

        <div className="hidden items-end justify-center lg:flex">
          <div className="relative flex h-44 w-44 items-end justify-center overflow-hidden rounded-full bg-brand/10">
            <span className="select-none text-7xl">🧑‍🔧</span>
          </div>
        </div>
      </div>
    </section>
  );
}
