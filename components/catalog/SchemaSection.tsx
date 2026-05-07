"use client";

import { useState } from "react";
import { SchemaViewer, type Marker } from "./SchemaViewer";
import { PartsTable, type PartRow } from "./PartsTable";

export type SchemaSectionProps = {
  title: string;
  imageKey: string;
  markers: Marker[];
  rows: PartRow[];
};

export function SchemaSection({
  title,
  imageKey,
  markers,
  rows,
}: SchemaSectionProps) {
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);

  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(320px,5fr)_minmax(360px,7fr)]">
      <SchemaViewer
        title={title}
        imageKey={imageKey}
        markers={markers}
        selectedMarkerId={selectedMarkerId}
        onSelectMarker={(id) => setSelectedMarkerId(id)}
      />
      <PartsTable
        rows={rows}
        selectedMarkerId={selectedMarkerId}
        onSelectMarker={(id) => setSelectedMarkerId(id)}
      />
    </section>
  );
}
