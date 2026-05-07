"use client";

import { useRef, useState, useTransition } from "react";
import { Upload, X } from "lucide-react";
import { uploadImageAction } from "@/app/superadmin/actions/upload";
import { publicUrl } from "@/lib/s3";

export function ImageUpload({
  folder,
  value,
  onChange,
  label = "Изображение",
}: {
  folder: "categories" | "schemas" | "products";
  value: string | null;
  onChange: (key: string | null) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleFile = (file: File) => {
    setError(null);
    const fd = new FormData();
    fd.append("file", file);
    startTransition(async () => {
      const res = await uploadImageAction(folder, fd);
      if (!res.ok) {
        setError(res.error);
      } else {
        onChange(res.key);
      }
    });
  };

  const url = publicUrl(value);

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">{label}</div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <div className="flex items-start gap-3">
        <div className="relative flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted">
          {url ? (
            <>
              <img
                src={url}
                alt=""
                className="h-full w-full object-contain"
              />
              <button
                type="button"
                onClick={() => onChange(null)}
                className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-foreground shadow hover:bg-white"
                aria-label="Удалить"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <div className="text-xs text-muted-foreground">нет</div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            {pending ? "Загрузка..." : url ? "Заменить" : "Загрузить"}
          </button>
          {error && <div className="text-xs text-red-600">{error}</div>}
          <div className="text-xs text-muted-foreground">
            PNG, JPG, WEBP, SVG до 10 МБ
          </div>
        </div>
      </div>
    </div>
  );
}
