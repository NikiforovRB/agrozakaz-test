"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/rbac";
import { deleteObject } from "@/lib/s3";

const schemaSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  imageKey: z.string().min(1, "Загрузите изображение схемы"),
  categoryId: z.string().min(1),
  order: z.coerce.number().int().default(0),
});

export type SchemaFormState = { error?: string; ok?: boolean; id?: string };

export async function upsertSchemaAction(
  _prev: SchemaFormState,
  formData: FormData,
): Promise<SchemaFormState> {
  await requireAdmin();
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const parsed = schemaSchema.safeParse({
    id: raw.id || undefined,
    title: raw.title,
    description: raw.description,
    imageKey: raw.imageKey,
    categoryId: raw.categoryId,
    order: raw.order,
  });
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Ошибка валидации" };
  }
  const data = parsed.data;
  try {
    let id = data.id;
    if (id) {
      await prisma.schema.update({
        where: { id },
        data: {
          title: data.title,
          description: data.description ?? null,
          imageKey: data.imageKey,
          categoryId: data.categoryId,
          order: data.order,
        },
      });
    } else {
      const created = await prisma.schema.create({
        data: {
          title: data.title,
          description: data.description ?? null,
          imageKey: data.imageKey,
          categoryId: data.categoryId,
          order: data.order,
        },
      });
      id = created.id;
    }
    revalidatePath("/superadmin/schemas");
    revalidatePath("/catalog");
    return { ok: true, id };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ошибка сохранения";
    return { error: msg };
  }
}

export async function deleteSchemaAction(id: string) {
  await requireAdmin();
  const sch = await prisma.schema.findUnique({ where: { id } });
  if (sch?.imageKey) await deleteObject(sch.imageKey);
  await prisma.schema.delete({ where: { id } });
  revalidatePath("/superadmin/schemas");
  revalidatePath("/catalog");
}

const markersSchema = z.array(
  z.object({
    id: z.string().optional(),
    position: z.coerce.number().int().min(1),
    label: z.string().optional().nullable(),
    x: z.coerce.number().min(0).max(100),
    y: z.coerce.number().min(0).max(100),
    productId: z.string().optional().nullable(),
  }),
);

export async function saveMarkersAction(
  schemaId: string,
  markers: Array<{
    id?: string;
    position: number;
    label?: string | null;
    x: number;
    y: number;
    productId?: string | null;
  }>,
): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireAdmin();
  const parsed = markersSchema.safeParse(markers);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0]?.message ?? "Ошибка валидации" };
  }
  await prisma.$transaction([
    prisma.partMarker.deleteMany({ where: { schemaId } }),
    prisma.partMarker.createMany({
      data: parsed.data.map((m) => ({
        schemaId,
        position: m.position,
        label: m.label || null,
        x: m.x,
        y: m.y,
        productId: m.productId || null,
      })),
    }),
  ]);
  revalidatePath("/superadmin/schemas");
  revalidatePath("/catalog");
  return { ok: true };
}
