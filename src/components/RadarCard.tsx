import React from "react";
import { Dim } from "../types";

interface RadarCardProps {
  avg: Record<Dim, number>;
}

const DIM_META: Record<Dim, { label: string; description: string }> = {
  komunikasi: {
    label: "Komunikasi",
    description: "Kejelasan, active listening & transparansi alasan",
  },
  empati: {
    label: "Empati / EQ",
    description: "Pengakuan beban mental & dukungan moril anggota",
  },
  ketegasan: {
    label: "Ketegasan",
    description: "Ketepatan waktu, batasan jelas & tidak menghindar",
  },
  krisis: {
    label: "Manajemen Krisis",
    description: "Prioritas realistis & kontingensi risiko demo",
  },
};

const DIMS: Dim[] = ["komunikasi", "empati", "ketegasan", "krisis"];

export default function RadarCard({ avg }: RadarCardProps) {
  const size = 300;
  const center = size / 2;
  const radius = size * 0.38;
  const levels = [2, 4, 6, 8, 10];

  const getPoint = (index: number, val: number) => {
    const angle = (Math.PI * 2 * index) / 4 - Math.PI / 2;
    const r = (val / 10) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const polygonPoints = DIMS.map((d, i) => {
    const pt = getPoint(i, avg[d] || 1);
    return `${pt.x},${pt.y}`;
  }).join(" ");

  return (
    <div className="surface-card flex flex-col items-center rounded-lg p-5">
      <div className="mb-2 flex w-full items-center justify-between">
        <h3 className="type-subhead text-slate-900">Profil Kepemimpinan 4 Dimensi</h3>
        <span className="type-meta rounded-sm border border-blue-200 bg-blue-50 px-2 py-0.5 font-semibold text-blue-700">
          Skor Rata-Rata (1-10)
        </span>
      </div>

      <div className="relative flex items-center justify-center py-2">
        <svg
          width={size}
          height={size}
          className="overflow-visible"
          role="img"
          aria-label="Grafik Radar 4 Dimensi Kepemimpinan"
        >
          {levels.map((lvl) => {
            const levelPoints = DIMS.map((_, i) => {
              const pt = getPoint(i, lvl);
              return `${pt.x},${pt.y}`;
            }).join(" ");

            return (
              <g key={lvl}>
                <polygon
                  points={levelPoints}
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray={lvl % 4 === 0 ? "none" : "2,2"}
                />
                <text
                  x={center + 4}
                  y={center - (lvl / 10) * radius + 4}
                  fontSize="11"
                  fill="#475569"
                  className="select-none font-mono"
                >
                  {lvl}
                </text>
              </g>
            );
          })}

          {DIMS.map((_, i) => {
            const outer = getPoint(i, 10);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={outer.x}
                y2={outer.y}
                stroke="#cbd5e1"
                strokeWidth="1.2"
              />
            );
          })}

          <polygon
            points={polygonPoints}
            fill="#2563eb"
            fillOpacity="0.16"
            stroke="#2563eb"
            strokeWidth="2"
            strokeLinejoin="round"
            className="transition-all duration-500"
          />

          {DIMS.map((dim, i) => {
            const val = avg[dim] || 1;
            const pt = getPoint(i, val);
            return (
              <g key={dim}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="4"
                  fill="#ffffff"
                  stroke="#2563eb"
                  strokeWidth="2"
                  className="transition-all duration-500"
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Dimension breakdown cards */}
      <div className="mt-3 grid w-full grid-cols-2 gap-2">
        {DIMS.map((dim) => {
          const meta = DIM_META[dim];
          const val = avg[dim] || 0;
          return (
            <div
              key={dim}
              className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-2.5 transition-colors hover:bg-slate-100"
            >
              <div className="min-w-0">
                <div className="type-meta font-semibold text-slate-900">{meta.label}</div>
                <div className="type-meta line-clamp-1 text-slate-600">
                  {meta.description}
                </div>
              </div>
              <div className="type-body ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white font-mono font-bold text-blue-600">
                {val.toFixed(1)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
