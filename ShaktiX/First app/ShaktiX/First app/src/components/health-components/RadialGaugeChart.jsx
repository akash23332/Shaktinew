import React, { useMemo } from "react";

// RadialGaugeChart: Semi-circular multi-segment gauge inspired by the provided image.
// - values: number[] in [0,100]
// - labels: string[] (optional)
// - colors: string[] (optional hex/rgba)
// - width, height: SVG size (default 560x320)
// - innerBase: minimal radius offset from center (default 60)
// - maxRadius: maximum radius length (default 140)
export default function RadialGaugeChart({
  values = [65, 77, 75, 87, 65, 73],
  labels = ["A", "B", "C", "D", "E", "F"],
  colors = ["#00d4ff", "#f59e0b", "#3b82f6", "#10b981", "#f97316", "#8b5cf6"],
  width = 560,
  height = 320,
  innerBase = 60,
  maxRadius = 140,
}) {
  const cx = width / 2;
  const cy = height - 12; // center near bottom to create a semicircle on top
  const count = values.length;
  const span = Math.PI; // 180deg
  const startAngle = Math.PI; // left (-x)
  const angleStep = span / count;

  const segs = useMemo(() => {
    const clamp01 = (v) => Math.max(0, Math.min(1, v));
    return values.map((v, i) => {
      const t = clamp01(v / 100);
      const radius = innerBase + t * (maxRadius - innerBase);
      const a0 = startAngle + i * angleStep;
      const a1 = startAngle + (i + 1) * angleStep;
      const largeArc = a1 - a0 > Math.PI ? 1 : 0; // never large here but kept for clarity
      const x0 = cx + radius * Math.cos(a0);
      const y0 = cy + radius * Math.sin(a0);
      const x1 = cx + radius * Math.cos(a1);
      const y1 = cy + radius * Math.sin(a1);
      // path: Move to center, line to start point, arc to end point, close to center
      const d = `M ${cx} ${cy} L ${x0} ${y0} A ${radius} ${radius} 0 ${largeArc} 1 ${x1} ${y1} Z`;
      // label position at middle angle with slightly less radius
      const am = (a0 + a1) / 2;
      const lx = cx + (radius - 18) * Math.cos(am);
      const ly = cy + (radius - 18) * Math.sin(am);
      return { d, color: colors[i % colors.length], label: `${Math.round(v)}%`, lx, ly };
    });
  }, [values, colors, angleStep, cx, cy, startAngle, innerBase, maxRadius]);

  // background arcs grid
  const rings = [0.6, 0.75, 0.9, 1];

  return (
    <div className="radial-root">
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" role="img" aria-label="Health gauge">
        <defs>
          <filter id="rg-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* faint background grid rings */}
        {rings.map((t, i) => {
          const r = innerBase + t * (maxRadius - innerBase);
          const x0 = cx + r * Math.cos(startAngle);
          const y0 = cy + r * Math.sin(startAngle);
          const x1 = cx + r * Math.cos(startAngle + span);
          const y1 = cy + r * Math.sin(startAngle + span);
          return (
            <path
              key={`ring-${i}`}
              d={`M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}`}
              fill="none"
              stroke="#142b3f"
              strokeWidth="1"
            />
          );
        })}

        {/* segments */}
        {segs.map((s, i) => (
          <path key={i} d={s.d} fill={s.color} opacity="0.85" filter="url(#rg-glow)" />
        ))}

        {/* labels */}
        {segs.map((s, i) => (
          <text key={`t-${i}`} x={s.lx} y={s.ly} className="radial-label" textAnchor="middle">
            {s.label}
          </text>
        ))}
      </svg>
    </div>
  );
}
