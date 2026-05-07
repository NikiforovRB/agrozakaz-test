"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/rbac";
import { slugify } from "@/lib/utils";
import { deleteObject } from "@/lib/s3";

const upsertSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Введите название"),
  slug: z.string().optional(),
  description: z.string().optional().nullable(),
  parentId: z.string().optional().nullable(),
  imageKey: z.string().optional().nullable(),
  order: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean().default(true),
});

export type CategoryFormState = { error?: string; ok?: boolean };

export async function upsertCategoryAction(
  _prev: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  await requireAdmin();
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const parsed = upsertSchema.safeParse({
    id: raw.id || undefined,
    name: raw.name,
    slug: raw.slug,
    description: raw.description,
    parentId: raw.parentId || null,
    imageKey: raw.imageKey || null,
    order: raw.order,
    isActive: raw.isActive === "on" || raw.isActive === "true",
  });
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Ошибка валидации" };
  }
  const data = parsed.data;
  const slug = (data.slug && data.slug.length > 0 ? data.slug : slugify(data.name)).toLowerCase();
  try {
    if (data.id) {
      await prisma.category.update({
        where: { id: data.id },
        data: {
          name: data.name,
          slug,
          description: data.description ?? null,
          parentId: data.parentId,
          imageKey: data.imageKey ?? null,
          order: data.order,
          isActive: data.isActive,
        },
      });
    } else {
      await prisma.category.create({
        data: {
          name: data.name,
          slug,
          description: data.description ?? null,
          parentId: data.parentId,
          imageKey: data.imageKey ?? null,
          order: data.order,
          isActive: data.isActive,
        },
      });
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ошибка сохранения";
    return { error: msg };
  }

  revalidatePath("/superadmin/categories");
  revalidatePath("/catalog");
  return { ok: true };
}

export async function deleteCategoryAction(id: string) {
  await requireAdmin();
  const cat = await prisma.category.findUnique({ where: { id } });
  if (cat?.imageKey) await deleteObject(cat.imageKey);
  await prisma.category.delete({ where: { id } });
  revalidatePath("/superadmin/categories");
  revalidatePath("/catalog");
}
