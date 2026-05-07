"use client";

import { useRef, useState, useEffect } from "react";
import { Upload, X, Loader2 } from "lucide-react";
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
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFile = (file: File) => {
    setError(null);
    setProgress(0);
    setUploading(true);

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    const fd = new FormData();
    fd.append("folder", folder);
    fd.append("file", file);

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;
    xhr.open("POST", "/api/upload");

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 100);
        setProgress(pct);
      }
    };

    xhr.onload = () => {
      setUploading(false);
      xhrRef.current = null;
      try {
        const data = JSON.parse(xhr.responseText) as {
          key?: string;
          error?: string;
        };
        if (xhr.status >= 200 && xhr.status < 300 && data.key) {
          onChange(data.key);
          setProgress(100);
        } else {
          setError(data.error ?? `Ошибка загрузки (${xhr.status})`);
          if (previewUrl) URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }
      } catch {
        setError(`Ошибка ответа сервера (${xhr.status})`);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      xhrRef.current = null;
      setError("Ошибка сети");
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    };

    xhr.onabort = () => {
      setUploading(false);
      xhrRef.current = null;
    };

    xhr.send(fd);
  };

  const handleCancel = () => {
    xhrRef.current?.abort();
  };

  const handleRemove = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setProgress(0);
    onChange(null);
  };

  const remoteUrl = publicUrl(value);
  const displayUrl = previewUrl ?? remoteUrl;

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
          e.target.value = "";
        }}
      />
      <div className="flex items-start gap-3">
        <div className="relative flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted">
          {displayUrl ? (
            <img
              src={displayUrl}
              alt=""
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="text-xs text-muted-foreground">нет</div>
          )}
          {uploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/55 text-white">
              <Loader2 className="h-5 w-5 animate-spin" />
              <div className="text-xs font-semibold tabular-nums">
                {progress}%
              </div>
            </div>
          )}
          {!uploading && displayUrl && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-foreground shadow hover:bg-white"
              aria-label="Удалить"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {!uploading ? (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              <Upload className="h-4 w-4" />
              {displayUrl ? "Заменить" : "Загрузить"}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              <X className="h-4 w-4" />
              Отменить ({progress}%)
            </button>
          )}
          {uploading && (
            <div className="h-1.5 w-44 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-brand transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
          {error && <div className="text-xs text-red-600">{error}</div>}
          <div className="text-xs text-muted-foreground">
            PNG, JPG, WEBP, SVG до 10 МБ
          </div>
        </div>
      </div>
    </div>
  );
}
