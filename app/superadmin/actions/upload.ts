"use server";

import { requireAdmin } from "@/lib/rbac";
import { buildKey, uploadObject } from "@/lib/s3";

const ALLOWED_MIME = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
  "image/gif",
]);
const MAX_BYTES = 10 * 1024 * 1024;

export type UploadResult = { ok: true; key: string } | { ok: false; error: string };

export async function uploadImageAction(
  folder: "categories" | "schemas" | "products",
  formData: FormData,
): Promise<UploadResult> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { ok: false, error: "Файл не передан" };
  }
  if (!ALLOWED_MIME.has(file.type)) {
    return { ok: false, error: `Недопустимый тип файла: ${file.type}` };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, error: "Файл больше 10 МБ" };
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const key = buildKey(folder, file.name);
  await uploadObject({ key, body: buffer, contentType: file.type });
  return { ok: true, key };
}
