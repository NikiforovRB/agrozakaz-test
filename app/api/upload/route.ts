import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { buildKey, uploadObject } from "@/lib/s3";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_MIME = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
  "image/gif",
]);
const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_FOLDERS = new Set(["categories", "schemas", "products"]);

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Не авторизованы" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Не удалось прочитать данные";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const folder = String(formData.get("folder") ?? "");
  const file = formData.get("file");

  if (!ALLOWED_FOLDERS.has(folder)) {
    return NextResponse.json({ error: "Неверная папка" }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Файл не передан" }, { status: 400 });
  }
  if (!ALLOWED_MIME.has(file.type)) {
    return NextResponse.json(
      { error: `Недопустимый тип файла: ${file.type}` },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Файл больше 10 МБ" },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = buildKey(folder, file.name);
  await uploadObject({ key, body: buffer, contentType: file.type });

  return NextResponse.json({ key });
}
