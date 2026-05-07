import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const endpoint = process.env.S3_ENDPOINT ?? "https://s3.twcstorage.ru";
const region = process.env.S3_REGION ?? "ru-1";
const bucket = process.env.S3_BUCKET ?? "";
const prefix = (process.env.S3_PREFIX ?? "agrozakaz-test").replace(
  /\/+$/,
  "",
);

if (!process.env.S3_ACCESS_KEY_ID || !process.env.S3_SECRET_ACCESS_KEY) {
  // eslint-disable-next-line no-console
  console.warn("S3 credentials are not set");
}

export const s3 = new S3Client({
  endpoint,
  region,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
  },
});

export const s3Config = {
  endpoint,
  region,
  bucket,
  prefix,
};

export function buildKey(folder: string, filename: string): string {
  const safeFolder = folder.replace(/^\/+|\/+$/g, "");
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}/${safeFolder}/${timestamp}-${random}-${safeName}`;
}

export function publicUrl(key: string | null | undefined): string | null {
  if (!key) return null;
  return `${endpoint}/${bucket}/${key}`;
}

export async function uploadObject(params: {
  key: string;
  body: Buffer | Uint8Array | Blob | string;
  contentType?: string;
}): Promise<string> {
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: params.key,
      Body: params.body as Buffer,
      ContentType: params.contentType,
      ACL: "public-read",
    }),
  );
  return params.key;
}

export async function deleteObject(key: string): Promise<void> {
  if (!key) return;
  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("Failed to delete S3 object", key, error);
  }
}
