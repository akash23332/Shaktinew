import React, { useEffect, useMemo, useRef, useState } from "react";

// Sparkline: animated glowing line chart used for small metric cards
// Props:
// - width, height: size in px (defaults 240x56)
// - color: main stroke color
// - glow: outer glow color
// - speedMs: interval for new sample generation
// - range: [min, max] numeric value range
// - onValue: callback(value) when a new point is produced
// - seed: starting value to initialize series
export default function Sparkline({
  width = 240,
  height = 56,
  color = "#4cc3ff",
  glow = "rgba(76,195,255,0.8)",
  speedMs = 650,
  range = [60, 95],
  onValue,
  seed = 78,
}) {
  const padding = 8; // inner padding for grid/line
  const pointsCount = 36;
  const [series, setSeries] = useState(() => Array.from({ length: pointsCount }, (_, i) => seed + (Math.sin(i / 2) * 4)));
  const valueRef = useRef(seed);

  // y scale helpers
  const [min, max] = range;
  const yScale = (v) => {
    const t = (v - min) / (max - min || 1);
    const clamped = Math.max(0, Math.min(1, t));
    // invert for SVG (0 at top)
    return padding + (1 - clamped) * (height - padding * 2);
  };

  // build path d from series
  const pathD = useMemo(() => {
    const w = width - padding * 2;
    const stepX = w / (pointsCount - 1);
    return series
      .map((v, i) => `${i === 0 ? "M" : "L"} ${padding + i * stepX} ${yScale(v).toFixed(2)}`)
      .join(" ");
  }, [series, width, height]);

  // animate by appending new points
  useEffect(() => {
    const id = setInterval(() => {
      // Generate a new value with gentle noise + slight tendency back to center
      const center = (min + max) / 2;
      const drift = (center - valueRef.current) * 0.05;
      const noise = (Math.random() - 0.5) * 3.2;
      const next = Math.max(min, Math.min(max, valueRef.current + drift + noise));
      valueRef.current = next;
      setSeries((prev) => {
        const arr = prev.slice(1);
        arr.push(next);
        return arr;
      });
      if (onValue) onValue(Number(next.toFixed(0)));
    }, speedMs);
    return () => clearInterval(id);
  }, [speedMs, min, max, onValue]);

  // grid lines
  const gridLines = 4;
  const grid = Array.from({ length: gridLines }, (_, i) => padding + ((height - padding * 2) / gridLines) * i);

  return (
    <svg className="sparkline-root" width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <defs>
        <linearGradient id="sl-grad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
        <filter id="sl-glow" x="-30%" y="-300%" width="160%" height="700%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={glow} floodOpacity="0.9" />
          <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor={glow} floodOpacity="0.6" />
        </filter>
      </defs>

      {/* grid */}
      {grid.map((y, i) => (
        <line key={i} x1={padding} y1={y} x2={width - padding} y2={y} className="spark-grid" />
      ))}

      {/* path */}
      <path d={pathD} className="spark-path" stroke="url(#sl-grad)" />
      <path d={pathD} className="spark-path-glow" stroke="url(#sl-grad)" filter="url(#sl-glow)" />
    </svg>
  );
}
