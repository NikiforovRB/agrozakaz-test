"use client";

import { useState } from "react";
import { publicUrl } from "@/lib/s3";
import { cn } from "@/lib/utils";

export type Marker = {
  id: string;
  position: number;
  x: number;
  y: number;
  productId: string | null;
  productName?: string | null;
  productSku?: string | null;
};

export type SchemaViewerProps = {
  title: string;
  imageKey: string;
  markers: Marker[];
  selectedMarkerId?: string | null;
  onSelectMarker?: (markerId: string) => void;
};

export function SchemaViewer({
  title,
  imageKey,
  markers,
  selectedMarkerId,
  onSelectMarker,
}: SchemaViewerProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const url = publicUrl(imageKey);

  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <div className="border-b bg-brand-darker px-4 py-3">
        <h3 className="text-base font-bold text-white">{title}</h3>
      </div>
      <div className="relative">
        {url ? (
          <img
            src={url}
            alt={title}
            className="block h-auto w-full select-none"
          />
        ) : (
          <div className="flex h-[400px] items-center justify-center text-muted-foreground">
            нет изображения схемы
          </div>
        )}
        {markers.map((m) => {
          const isActive = selectedMarkerId === m.id || hoveredId === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onMouseEnter={() => setHoveredId(m.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onSelectMarker?.(m.id)}
              title={
                m.productName
                  ? `${m.position}. ${m.productName}`
                  : `Позиция ${m.position}`
              }
              style={{ left: `${m.x}%`, top: `${m.y}%` }}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white text-[10px] font-bold text-white shadow-lg ring-2 transition-all",
                "h-6 w-6",
                isActive
                  ? "bg-yellow-400 text-brand-darker ring-yellow-300 scale-110"
                  : "bg-brand ring-brand/30 hover:bg-brand-light",
              )}
            >
              {m.position}
            </button>
          );
        })}
      </div>
    </div>
  );
}
