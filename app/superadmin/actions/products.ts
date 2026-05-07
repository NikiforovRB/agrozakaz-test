"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/rbac";
import { deleteObject } from "@/lib/s3";

const productSchema = z.object({
  id: z.string().optional(),
  sku: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  priceRub: z.coerce.number().int().min(0),
  stockCount: z.coerce.number().int().min(0).default(0),
  imageKey: z.string().optional().nullable(),
  warehouseId: z.string().optional().nullable(),
  categoryIds: z.array(z.string()).optional(),
});

export type ProductFormState = { error?: string; ok?: boolean };

export async function upsertProductAction(
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdmin();
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const categoryIds = formData.getAll("categoryIds").map(String);
  const parsed = productSchema.safeParse({
    id: raw.id || undefined,
    sku: raw.sku,
    name: raw.name,
    description: raw.description,
    priceRub: raw.priceRub,
    stockCount: raw.stockCount,
    imageKey: raw.imageKey || null,
    warehouseId: raw.warehouseId || null,
    categoryIds,
  });
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Ошибка валидации" };
  }
  const data = parsed.data;
  try {
    if (data.id) {
      await prisma.product.update({
        where: { id: data.id },
        data: {
          sku: data.sku,
          name: data.name,
          description: data.description ?? null,
          priceRub: data.priceRub,
          stockCount: data.stockCount,
          imageKey: data.imageKey ?? null,
          warehouseId: data.warehouseId,
          categories: {
            set: (data.categoryIds ?? []).map((id) => ({ id })),
          },
        },
      });
    } else {
      await prisma.product.create({
        data: {
          sku: data.sku,
          name: data.name,
          description: data.description ?? null,
          priceRub: data.priceRub,
          stockCount: data.stockCount,
          imageKey: data.imageKey ?? null,
          warehouseId: data.warehouseId,
          categories: {
            connect: (data.categoryIds ?? []).map((id) => ({ id })),
          },
        },
      });
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ошибка сохранения";
    return { error: msg };
  }
  revalidatePath("/superadmin/products");
  revalidatePath("/catalog");
  return { ok: true };
}

export async function deleteProductAction(id: string) {
  await requireAdmin();
  const product = await prisma.product.findUnique({ where: { id } });
  if (product?.imageKey) await deleteObject(product.imageKey);
  await prisma.product.delete({ where: { id } });
  revalidatePath("/superadmin/products");
  revalidatePath("/catalog");
}
