"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/rbac";

const userSchema = z.object({
  id: z.string().optional(),
  email: z.string().email(),
  name: z.string().optional().nullable(),
  password: z.string().optional().nullable(),
  role: z.enum(["SUPERADMIN", "ADMIN"]),
});

export type UserFormState = { error?: string; ok?: boolean };

export async function upsertUserAction(
  _prev: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  await requireAdmin();
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const parsed = userSchema.safeParse({
    id: raw.id || undefined,
    email: raw.email,
    name: raw.name,
    password: raw.password,
    role: raw.role,
  });
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Ошибка валидации" };
  }
  const data = parsed.data;
  try {
    if (data.id) {
      const update: { email: string; name: string | null; role: "SUPERADMIN" | "ADMIN"; passwordHash?: string } = {
        email: data.email.toLowerCase(),
        name: data.name ?? null,
        role: data.role,
      };
      if (data.password && data.password.length > 0) {
        update.passwordHash = await bcrypt.hash(data.password, 10);
      }
      await prisma.user.update({ where: { id: data.id }, data: update });
    } else {
      if (!data.password || data.password.length < 6) {
        return { error: "Пароль обязателен (мин. 6 символов)" };
      }
      await prisma.user.create({
        data: {
          email: data.email.toLowerCase(),
          name: data.name ?? null,
          role: data.role,
          passwordHash: await bcrypt.hash(data.password, 10),
        },
      });
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ошибка сохранения";
    return { error: msg };
  }
  revalidatePath("/superadmin/users");
  return { ok: true };
}

export async function deleteUserAction(id: string) {
  await requireAdmin();
  await prisma.user.delete({ where: { id } });
  revalidatePath("/superadmin/users");
}
