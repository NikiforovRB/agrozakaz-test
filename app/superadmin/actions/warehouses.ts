"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/rbac";

const warehouseSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Введите название"),
  city: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  order: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean().default(true),
});

export type WarehouseFormState = { error?: string; ok?: boolean };

export async function upsertWarehouseAction(
  _prev: WarehouseFormState,
  formData: FormData,
): Promise<WarehouseFormState> {
  await requireAdmin();
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const parsed = warehouseSchema.safeParse({
    id: raw.id || undefined,
    name: raw.name,
    city: raw.city,
    address: raw.address,
    order: raw.order,
    isActive: raw.isActive === "on" || raw.isActive === "true",
  });
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Ошибка валидации" };
  }
  const data = parsed.data;
  try {
    if (data.id) {
      await prisma.warehouse.update({
        where: { id: data.id },
        data: {
          name: data.name,
          city: data.city ?? null,
          address: data.address ?? null,
          order: data.order,
          isActive: data.isActive,
        },
      });
    } else {
      await prisma.warehouse.create({
        data: {
          name: data.name,
          city: data.city ?? null,
          address: data.address ?? null,
          order: data.order,
          isActive: data.isActive,
        },
      });
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ошибка сохранения";
    return { error: msg };
  }

  revalidatePath("/superadmin/warehouses");
  revalidatePath("/superadmin/products");
  revalidatePath("/catalog");
  return { ok: true };
}

export async function deleteWarehouseAction(id: string) {
  await requireAdmin();
  await prisma.warehouse.delete({ where: { id } });
  revalidatePath("/superadmin/warehouses");
  revalidatePath("/superadmin/products");
  revalidatePath("/catalog");
}
