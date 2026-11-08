import React from "react";
import { Dim } from "../types";

interface RadarCardProps {
  avg: Record<Dim, number>;
}

const DIM_META: Record<Dim, { label: string; description: string; color: string }> = {
  komunikasi: {
    label: "Komunikasi",
    description: "Kejelasan, active listening & transparansi alasan",
    color: "#3b82f6", // blue-500
  },
  empati: {
    label: "Empati / EQ",
    description: "Pengakuan beban mental & dukungan moril anggota",
    color: "#ec4899", // pink-500
  },
  ketegasan: {
    label: "Ketegasan",
    description: "Ketepatan waktu, batasan jelas & tidak menghindar",
    color: "#f59e0b", // amber-500
  },
  krisis: {
    label: "Manajemen Krisis",
    description: "Prioritas realistis & kontingensi risiko demo",
    color: "#10b981", // emerald-500
  },
};

const DIMS: Dim[] = ["komunikasi", "empati", "ketegasan", "krisis"];

export default function RadarCard({ avg }: RadarCardProps) {
  const size = 320;
  const center = size / 2;
  const radius = size * 0.38;
  const levels = [2, 4, 6, 8, 10];

  // Helper to compute coordinate for a given index and value (0 - 10)
  const getPoint = (index: number, val: number) => {
    // 4 dimensions: angles at -90deg, 0deg, 90deg, 180deg
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
    <div className="flex flex-col items-center rounded-lg border border-slate-200 bg-white p-5 shadow-xs">
      <div className="mb-2 flex w-full items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">Profil Kepemimpinan 4 Dimensi</h3>
        <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
          Skor Rata-Rata (1-10)
        </span>
      </div>

      <div className="relative flex items-center justify-center py-2">
        <svg width={size} height={size} className="overflow-visible">
          {/* Concentric grid circles / polygons */}
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
                  fontSize="9"
                  fill="#94a3b8"
                  className="select-none font-mono"
                >
                  {lvl}
                </text>
              </g>
            );
          })}

          {/* Radial Axis Lines */}
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

          {/* Player Polygon */}
          <polygon
            points={polygonPoints}
            fill="#2563eb"
            fillOpacity="0.18"
            stroke="#2563eb"
            strokeWidth="2"
            strokeLinejoin="round"
            className="transition-all duration-500"
          />

          {/* Points on vertices */}
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
      <div className="mt-3 grid w-full grid-cols-2 gap-2 text-xs">
        {DIMS.map((dim) => {
          const meta = DIM_META[dim];
          const val = avg[dim] || 0;
          return (
            <div
              key={dim}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/80 p-2.5 transition-colors hover:bg-slate-100/80"
            >
              <div>
                <div className="font-semibold text-slate-800">{meta.label}</div>
                <div className="line-clamp-1 text-[10px] text-slate-500">
                  {meta.description}
                </div>
              </div>
              <div className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white font-mono text-sm font-black text-blue-600 shadow-xs border border-slate-200">
                {val.toFixed(1)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
