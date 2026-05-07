# АгроЗаказ — кликабельная демо каталога запчастей

Fullstack-демо страницы каталога запчастей сельхозтехники: иерархические категории, интерактивные технические схемы с маркерами на запчасти, карусель товаров и закрытая админка для управления контентом.

## Стек

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** + минималистичный набор UI на Radix
- **PostgreSQL** + **Prisma**
- **Auth.js v5** (NextAuth Beta) — Credentials provider, JWT-сессии
- **AWS SDK v3** — S3-совместимое хранилище Twcstorage
- Деплой — **Vercel**

## Структура

```
app/
  (public)/                # публичная часть с шапкой/футером
    catalog/               # /catalog и /catalog/[...slug]
  superadmin/
    login/                 # форма входа
    (authed)/              # всё под авторизацией
      categories/ schemas/ products/ users/
    actions/               # server actions
components/
  catalog/                 # UI публичного каталога
  admin/                   # UI админки
  ui/                      # shadcn-подобные примитивы
lib/
  db.ts auth.ts s3.ts utils.ts rbac.ts
prisma/
  schema.prisma seed.ts
```

## Локальный запуск

```bash
npm install
npm run db:push       # пушит схему в БД (если нужно)
npm run db:seed       # создаёт суперадмина и тестовые данные
npm run dev
```

Откройте:
- Каталог: <http://localhost:3000/catalog>
- Админка: <http://localhost:3000/superadmin> → форма входа
  - Email: `nikiforovrb@yandex.ru`
  - Пароль: `1vngbwxcn`

## Переменные окружения

Хранятся в `.env.local` (для Next.js / Auth.js / S3) и `.env` (для Prisma CLI).

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB?schema=public"

S3_ENDPOINT=https://s3.twcstorage.ru
S3_REGION=ru-1
S3_BUCKET=ansara-main-baket
S3_PREFIX=agrozakaz-test
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...

# Те же endpoint и bucket, но доступные на клиенте — нужны браузеру
# чтобы строить URL картинок сразу после загрузки в админке.
NEXT_PUBLIC_S3_ENDPOINT=https://s3.twcstorage.ru
NEXT_PUBLIC_S3_BUCKET=ansara-main-baket

AUTH_SECRET=...                # openssl rand -base64 32
AUTH_TRUST_HOST=true

SUPERADMIN_EMAIL=nikiforovrb@yandex.ru
SUPERADMIN_PASSWORD=1vngbwxcn
SUPERADMIN_NAME=Никифоров Р.Б.
```

`SUPERADMIN_*` читает только seed-скрипт.

## S3 / Twcstorage

Все объекты пишутся под префиксом `agrozakaz-test/` в общий бакет `ansara-main-baket`. Подкаталоги:

- `agrozakaz-test/categories/` — изображения карточек категорий
- `agrozakaz-test/schemas/` — большие схемы узлов
- `agrozakaz-test/products/` — фото товаров

URL для публичного доступа: `https://s3.twcstorage.ru/<bucket>/<key>`. В админке загрузка происходит через server action с валидацией mime/size (≤10 МБ).

## Команды

| Команда | Описание |
|---|---|
| `npm run dev` | Локальный dev-сервер |
| `npm run build` | Сборка для прод |
| `npm run start` | Запуск собранного приложения |
| `npm run lint` | ESLint |
| `npm run db:push` | Применить Prisma-схему к БД |
| `npm run db:migrate` | Создать новую миграцию |
| `npm run db:seed` | Заполнить тестовыми данными |
| `npm run db:reset` | Сбросить и пересоздать БД |

## Деплой на Vercel

1. Залейте репозиторий на GitHub/GitLab.
2. Создайте проект в Vercel и подключите репозиторий.
3. В **Settings → Environment Variables** добавьте все переменные из `.env.local` (включая `AUTH_SECRET`, S3-ключи и `DATABASE_URL`). Для `DATABASE_URL` обязательно URL-encode спецсимволы пароля (`$` → `%24` и т.п.).
4. Build command (по умолчанию `npm run build`) уже включает `prisma generate`.
5. Push в основную ветку — Vercel задеплоит.

> При первом деплое таблиц в БД может ещё не быть. Сначала локально выполните `npm run db:push` и `npm run db:seed`, либо подключитесь к удалённой БД и сделайте то же.

## Что готово

- Публичный каталог с зелёной палитрой как в макете: шапка, верхняя/нижняя навигация, хлебные крошки, сетка категорий, секция «схема + таблица деталей» с интерактивными маркерами (hover синхронизирован), карусель товаров, контактная секция, футер.
- Иерархия категорий любой глубины — URL вида `/catalog/kombayny/izmelchiteli-botvy/zimari-cs10d/cs10d-10`.
- Админка `/superadmin`: дашборд + CRUD категорий (дерево), схем (с **визуальным редактором маркеров**: клик по схеме → ставится точка → выбирается товар), товаров (мультикатегория) и пользователей (роли).
- Загрузка изображений в отдельную папку S3 через server action.
- Первый суперадмин и тестовые данные (4 категории верхнего уровня, ZimAri CS10D с 15 узлами, 1 схема с 7 маркерами, 12 товаров).

## Что не вошло (можно добавить итеративно)

- Корзина и оформление заказа (сейчас только UI и toast).
- Поиск по каталогу (инпут есть, логика — нет).
- Регистрация пользователей с фронта (только из админки).
- Email-уведомления, оплата, подбор аналогов.
