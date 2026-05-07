"use client";

import { useState, useRef, useTransition } from "react";
import { Trash2, Plus, Save, Check } from "lucide-react";
import { publicUrl } from "@/lib/s3";
import { saveMarkersAction } from "@/app/superadmin/actions/schemas";

export type MarkerDraft = {
  id?: string;
  position: number;
  label?: string | null;
  x: number;
  y: number;
  productId?: string | null;
};

export function MarkerEditor({
  schemaId,
  imageKey,
  initialMarkers,
  products,
}: {
  schemaId: string;
  imageKey: string;
  initialMarkers: MarkerDraft[];
  products: Array<{ id: string; sku: string; name: string }>;
}) {
  const [markers, setMarkers] = useState<MarkerDraft[]>(
    initialMarkers.map((m, i) => ({ ...m, position: m.position ?? i + 1 })),
  );
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const [pending, startTransition] = useTransition();

  const url = publicUrl(imageKey);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const nextPosition =
      markers.reduce((m, x) => Math.max(m, x.position), 0) + 1;
    setMarkers((prev) => [
      ...prev,
      { position: nextPosition, x, y, productId: null, label: null },
    ]);
    setSelectedIdx(markers.length);
  };

  const updateMarker = (idx: number, patch: Partial<MarkerDraft>) => {
    setMarkers((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, ...patch } : m)),
    );
  };

  const removeMarker = (idx: number) => {
    setMarkers((prev) => prev.filter((_, i) => i !== idx));
    setSelectedIdx(null);
  };

  const renumber = () => {
    setMarkers((prev) => prev.map((m, i) => ({ ...m, position: i + 1 })));
  };

  const save = () => {
    setError(null);
    startTransition(async () => {
      const res = await saveMarkersAction(
        schemaId,
        markers.map((m) => ({
          position: m.position,
          label: m.label,
          x: m.x,
          y: m.y,
          productId: m.productId ?? null,
        })),
      );
      if (!res.ok) {
        setError(res.error);
      } else {
        setSavedFlash(true);
        setTimeout(() => setSavedFlash(false), 1500);
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm text-muted-foreground">
          Кликните по схеме, чтобы поставить маркер. Для каждого маркера
          выберите товар-запчасть из списка справа.
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={renumber}
            className="inline-flex items-center gap-1.5 rounded-md border bg-white px-3 py-1.5 text-xs hover:bg-muted"
          >
            Перенумеровать
          </button>
          <button
            type="button"
            onClick={save}
            disabled={pending}
            className="inline-flex items-center gap-1.5 rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-dark disabled:opacity-50"
          >
            {savedFlash ? (
              <>
                <Check className="h-4 w-4" /> Сохранено
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />{" "}
                {pending ? "Сохранение..." : "Сохранить маркеры"}
              </>
            )}
          </button>
        </div>
      </div>
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(280px,2fr)]">
        <div
          ref={imgRef}
          onClick={handleClick}
          className="relative cursor-crosshair overflow-hidden rounded-lg border bg-white"
        >
          {url ? (
            <img src={url} alt="" className="block w-full select-none" />
          ) : (
            <div className="flex h-[400px] items-center justify-center text-muted-foreground">
              нет изображения схемы
            </div>
          )}
          {markers.map((m, idx) => {
            const active = selectedIdx === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIdx(idx);
                }}
                style={{ left: `${m.x}%`, top: `${m.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white text-[10px] font-bold text-white shadow-lg ring-2 transition-transform ${
                  active
                    ? "bg-yellow-400 text-brand-darker ring-yellow-300 scale-110"
                    : "bg-brand ring-brand/30 hover:bg-brand-light"
                } h-7 w-7`}
              >
                {m.position}
              </button>
            );
          })}
        </div>

        <div className="rounded-lg border bg-white">
          <div className="border-b bg-muted px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Маркеры ({markers.length})
          </div>
          {markers.length === 0 ? (
            <div className="p-4 text-center text-xs text-muted-foreground">
              Маркеров нет. Кликните по схеме.
            </div>
          ) : (
            <div className="max-h-[480px] divide-y overflow-y-auto">
              {markers.map((m, idx) => {
                const isActive = selectedIdx === idx;
                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setSelectedIdx(idx)}
                    className={`p-3 ${isActive ? "bg-brand/5" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                        {m.position}
                      </span>
                      <input
                        type="number"
                        value={m.position}
                        min={1}
                        onChange={(e) =>
                          updateMarker(idx, {
                            position: parseInt(e.target.value, 10) || 1,
                          })
                        }
                        className="h-7 w-14 rounded border px-2 text-xs"
                      />
                      <select
                        value={m.productId ?? ""}
                        onChange={(e) =>
                          updateMarker(idx, {
                            productId: e.target.value || null,
                          })
                        }
                        className="h-7 flex-1 rounded border px-2 text-xs"
                      >
                        <option value="">— выберите товар —</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.sku} — {p.name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => removeMarker(idx)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded text-red-600 hover:bg-red-50"
                        aria-label="Удалить"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="border-t bg-muted/40 px-3 py-2 text-[11px] text-muted-foreground">
            <Plus className="mr-1 inline h-3 w-3" />
            Кликните по схеме слева чтобы добавить маркер
          </div>
        </div>
      </div>
    </div>
  );
}
