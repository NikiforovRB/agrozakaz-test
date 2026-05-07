import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const prisma = new PrismaClient();

const S3_ENDPOINT = process.env.S3_ENDPOINT ?? "https://s3.twcstorage.ru";
const S3_REGION = process.env.S3_REGION ?? "ru-1";
const S3_BUCKET = process.env.S3_BUCKET ?? "";
const S3_PREFIX = (process.env.S3_PREFIX ?? "agrozakaz-test").replace(/\/+$/, "");

const s3 = new S3Client({
  endpoint: S3_ENDPOINT,
  region: S3_REGION,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
  },
});

async function uploadIfMissing(key: string, body: string, contentType: string) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: S3_BUCKET, Key: key }));
    return key;
  } catch {
    await s3.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        Body: body,
        ContentType: contentType,
        ACL: "public-read",
      }),
    );
    return key;
  }
}

function schemaSvg(title: string, color: string) {
  const w = 600;
  const h = 450;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="#ffffff"/>
  <g fill="none" stroke="${color}" stroke-width="2">
    <rect x="60" y="60" width="480" height="330" rx="6"/>
    <line x1="60" y1="180" x2="540" y2="180"/>
    <line x1="60" y1="280" x2="540" y2="280"/>
    <line x1="220" y1="60" x2="220" y2="390"/>
    <line x1="380" y1="60" x2="380" y2="390"/>
    <circle cx="140" cy="120" r="32"/>
    <circle cx="300" cy="220" r="40"/>
    <circle cx="460" cy="320" r="28"/>
    <path d="M80 350 L200 320 L320 350 L440 310 L520 360" stroke-width="3"/>
    <path d="M120 80 L180 140 M380 80 L440 140 M120 360 L180 300 M380 360 L440 300" stroke-dasharray="4,4"/>
  </g>
  <text x="${w / 2}" y="40" font-family="Arial,sans-serif" font-size="20" font-weight="700" fill="${color}" text-anchor="middle">${title}</text>
  <text x="${w / 2}" y="${h - 16}" font-family="Arial,sans-serif" font-size="11" fill="#9CA3AF" text-anchor="middle">тестовая схема узла</text>
</svg>`;
}

function partSvg(label: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="#F4F6F8"/>
  <g fill="none" stroke="#0F5132" stroke-width="3">
    <circle cx="100" cy="100" r="60"/>
    <circle cx="100" cy="100" r="40"/>
    <line x1="40" y1="100" x2="160" y2="100"/>
    <line x1="100" y1="40" x2="100" y2="160"/>
    <circle cx="100" cy="100" r="10" fill="#0F5132"/>
  </g>
  <text x="100" y="185" font-family="Arial,sans-serif" font-size="11" fill="#0F5132" text-anchor="middle">${label}</text>
</svg>`;
}

const SUPERADMIN_EMAIL = (process.env.SUPERADMIN_EMAIL ?? "nikiforovrb@yandex.ru").toLowerCase();
const SUPERADMIN_PASSWORD = process.env.SUPERADMIN_PASSWORD ?? "1vngbwxcn";
const SUPERADMIN_NAME = process.env.SUPERADMIN_NAME ?? "Никифоров Р.Б.";

async function ensureSuperAdmin() {
  const passwordHash = await bcrypt.hash(SUPERADMIN_PASSWORD, 10);
  const existing = await prisma.user.findUnique({ where: { email: SUPERADMIN_EMAIL } });
  if (existing) {
    await prisma.user.update({
      where: { email: SUPERADMIN_EMAIL },
      data: {
        name: SUPERADMIN_NAME,
        role: "SUPERADMIN",
        passwordHash,
      },
    });
    console.log(`✓ Updated superadmin: ${SUPERADMIN_EMAIL}`);
  } else {
    await prisma.user.create({
      data: {
        email: SUPERADMIN_EMAIL,
        name: SUPERADMIN_NAME,
        role: "SUPERADMIN",
        passwordHash,
      },
    });
    console.log(`✓ Created superadmin: ${SUPERADMIN_EMAIL}`);
  }
}

const TOP_CATEGORIES = [
  { name: "Тракторы", slug: "traktory", color: "#0F5132" },
  { name: "Комбайны", slug: "kombayny", color: "#0F5132" },
  { name: "Прицепная техника", slug: "pricepnaya-tehnika", color: "#0F5132" },
  { name: "Расходники", slug: "rashodniki", color: "#0F5132" },
];

const ZIMARI_NODES = [
  "Двигатель",
  "Рама",
  "Бункер",
  "Молотилка",
  "Передний мост",
  "Шасси",
  "Кардан и редуктор",
  "Гидравлика",
  "Электрика",
  "Передняя рама",
  "Узел заточки",
  "Привод барабана",
  "Кожухи и щитки",
  "Колеса и оси",
  "Тяги и крепления",
];

const WAREHOUSES = [
  { name: "Склад Москва", city: "Москва", address: "ул. Горбунова, 12" },
  { name: "Склад Санкт-Петербург", city: "Санкт-Петербург", address: "пр. Энергетиков, 47" },
  { name: "Склад Краснодар", city: "Краснодар", address: "ул. Уральская, 100" },
];

async function seedCatalog() {
  await prisma.partMarker.deleteMany();
  await prisma.schema.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.warehouse.deleteMany();

  const warehouses = await Promise.all(
    WAREHOUSES.map((w, i) =>
      prisma.warehouse.create({
        data: { ...w, order: i },
      }),
    ),
  );
  console.log(`✓ Created ${warehouses.length} warehouses`);
  const pickWarehouse = (i: number) => warehouses[i % warehouses.length].id;

  for (const top of TOP_CATEGORIES) {
    const topImageKey = `${S3_PREFIX}/categories/${top.slug}.svg`;
    await uploadIfMissing(topImageKey, schemaSvg(top.name, top.color), "image/svg+xml");
    const topCat = await prisma.category.create({
      data: {
        name: top.name,
        slug: top.slug,
        imageKey: topImageKey,
        order: TOP_CATEGORIES.indexOf(top),
      },
    });
    console.log(`✓ Created top category: ${top.name}`);

    if (top.slug === "kombayny") {
      const groupKey = `${S3_PREFIX}/categories/izmelchiteli-botvy.svg`;
      await uploadIfMissing(
        groupKey,
        schemaSvg("Измельчители ботвы", "#0F5132"),
        "image/svg+xml",
      );
      const group = await prisma.category.create({
        data: {
          name: "Измельчители ботвы",
          slug: "izmelchiteli-botvy",
          parentId: topCat.id,
          imageKey: groupKey,
          description:
            "Запчасти и сменные узлы для роторных измельчителей ботвы.",
        },
      });

      const modelKey = `${S3_PREFIX}/categories/zimari-cs10d.svg`;
      await uploadIfMissing(
        modelKey,
        schemaSvg("ZimAri CS10D", "#0F5132"),
        "image/svg+xml",
      );
      const model = await prisma.category.create({
        data: {
          name: "ZimAri CS10D",
          slug: "zimari-cs10d",
          parentId: group.id,
          imageKey: modelKey,
          description: "Запчасти для измельчителей ботвы ZimAri CS10D",
        },
      });

      let order = 0;
      for (const nodeName of ZIMARI_NODES) {
        const nodeSlug = `cs10d-${order + 1}`;
        const nodeKey = `${S3_PREFIX}/categories/${nodeSlug}.svg`;
        await uploadIfMissing(
          nodeKey,
          schemaSvg(nodeName, "#0A3D24"),
          "image/svg+xml",
        );
        const nodeCat = await prisma.category.create({
          data: {
            name: nodeName,
            slug: nodeSlug,
            parentId: model.id,
            imageKey: nodeKey,
            order: order++,
          },
        });

        if (nodeName === "Передняя рама") {
          const productData = [
            { sku: "ZA-001", name: "Крепление передней рамы левое", price: 3550 },
            { sku: "ZA-002", name: "Крепление передней рамы правое", price: 3550 },
            { sku: "ZA-003", name: "Поперечная балка передней рамы", price: 8970 },
            { sku: "ZA-004", name: "Болт высокопрочный M16x80", price: 220 },
            { sku: "ZA-005", name: "Шайба пружинная M16", price: 35 },
            { sku: "ZA-006", name: "Кронштейн усилительный", price: 4250 },
            { sku: "ZA-007", name: "Втулка резиновая амортизатора", price: 690 },
          ];
          const products = await Promise.all(
            productData.map(async (p, idx) => {
              const imageKey = `${S3_PREFIX}/products/${p.sku.toLowerCase()}.svg`;
              await uploadIfMissing(imageKey, partSvg(p.sku), "image/svg+xml");
              return prisma.product.create({
                data: {
                  sku: p.sku,
                  name: p.name,
                  priceRub: p.price,
                  stockCount: [12, 8, 25, 240, 540, 6, 18][idx] ?? 10,
                  imageKey,
                  warehouseId: pickWarehouse(idx),
                  categories: { connect: [{ id: nodeCat.id }, { id: model.id }] },
                },
              });
            }),
          );

          const schemaImageKey = `${S3_PREFIX}/schemas/cs10d-front-frame.svg`;
          await uploadIfMissing(
            schemaImageKey,
            schemaSvg("ZimAri CS10D — Передняя рама", "#0F5132"),
            "image/svg+xml",
          );
          const schema = await prisma.schema.create({
            data: {
              title: "ZimAri CS10D — Передняя рама",
              description: "Чертеж узла передней рамы с маркерами на запчасти",
              imageKey: schemaImageKey,
              categoryId: nodeCat.id,
            },
          });

          const positions = [
            { x: 24, y: 28 },
            { x: 76, y: 28 },
            { x: 50, y: 50 },
            { x: 30, y: 70 },
            { x: 50, y: 78 },
            { x: 70, y: 70 },
            { x: 50, y: 22 },
          ];
          await prisma.partMarker.createMany({
            data: products.map((p, i) => ({
              schemaId: schema.id,
              productId: p.id,
              position: i + 1,
              x: positions[i % positions.length].x,
              y: positions[i % positions.length].y,
            })),
          });
        }
      }

      const extraProducts = [
        { sku: "AC-101", name: "Ремень приводной 17x1750", price: 2890 },
        { sku: "AC-102", name: "Подшипник шариковый 6206-2RS", price: 540 },
        { sku: "AC-103", name: "Сальник вала 35x52x7", price: 280 },
        { sku: "AC-104", name: "Втулка распорная 25x40x60", price: 1480 },
        { sku: "AC-105", name: "Звездочка цепи привода Z-21", price: 3450 },
      ];
      for (let idx = 0; idx < extraProducts.length; idx++) {
        const p = extraProducts[idx];
        const imageKey = `${S3_PREFIX}/products/${p.sku.toLowerCase()}.svg`;
        await uploadIfMissing(imageKey, partSvg(p.sku), "image/svg+xml");
        await prisma.product.create({
          data: {
            sku: p.sku,
            name: p.name,
            priceRub: p.price,
            stockCount: [22, 90, 150, 14, 4][idx] ?? 10,
            imageKey,
            warehouseId: pickWarehouse(idx + 7),
            categories: { connect: { id: model.id } },
          },
        });
      }
    }
  }
}

async function main() {
  await ensureSuperAdmin();
  await seedCatalog();
  console.log("\n✓ Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
