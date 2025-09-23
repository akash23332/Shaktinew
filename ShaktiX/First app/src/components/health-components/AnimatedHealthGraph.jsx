import React, { useEffect, useMemo, useRef, useState } from "react";

// Professional, glowing, real-time-ready line chart (SVG, no libs)
// Props:
// - data: number[] (required) — values will tween smoothly on change
// - labels: string[] (optional)
// - minY, maxY: number (optional)
// - width, height: number (optional)
const AnimatedHealthGraph = ({
  data: inputData,
  labels: inputLabels,
  minY = 50,
  maxY = 100,
  width = 560,
  height = 300,
}) => {
  const containerRef = useRef(null);
  const [hover, setHover] = useState(null);
  const [data, setData] = useState(() => inputData || [62, 64, 63, 66, 68, 70, 69, 72, 74, 73, 76, 79]);

  const labels = useMemo(() => {
    if (inputLabels && inputLabels.length === data.length) return inputLabels;
    return Array.from({ length: data.length }, (_, i) => `${i + 1}`);
  }, [inputLabels, data.length]);

  const padding = { top: 24, right: 18, bottom: 32, left: 44 };

  // Lerp towards incoming data for a smooth real-time feel
  useEffect(() => {
    if (!inputData || inputData.length === 0) return;
    const target = inputData;
    // Normalize length by interpolating or slicing
    const maxLen = Math.max(data.length, target.length);
    const current = [...data, ...Array(Math.max(0, maxLen - data.length)).fill(data[data.length - 1] ?? target[0])].slice(0, maxLen);
    const goal = [...target, ...Array(Math.max(0, maxLen - target.length)).fill(target[target.length - 1] ?? current[0])].slice(0, maxLen);

    const duration = 700;
    const start = performance.now();
    let raf;
    const tick = (t) => {
      const k = Math.min(1, (t - start) / duration);
      const eased = k < 0.5 ? 2 * k * k : -1 + (4 - 2 * k) * k; // easeInOutQuad
      const next = current.map((cv, i) => cv + (goal[i] - cv) * eased);
      setData(next);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inputData]);

  const x = (i) =>
    padding.left + (i * (width - padding.left - padding.right)) / (data.length - 1 || 1);
  const y = (v) =>
    padding.top + (1 - (v - minY) / (maxY - minY)) * (height - padding.top - padding.bottom);

  const line = useMemo(() => data.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join(" "), [data]);
  const area = useMemo(
    () =>
      `M${x(0)},${y(data[0])} ${data.map((v, i) => (i === 0 ? "" : `L${x(i)},${y(v)}`)).join(" ")}
       L${x(data.length - 1)},${height - padding.bottom}
       L${x(0)},${height - padding.bottom} Z`,
    [data]
  );

  // First-draw dash animation
  useEffect(() => {
    const path = containerRef.current?.querySelector("path.graph-line");
    if (!path) return;
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
    requestAnimationFrame(() => {
      path.style.transition = "stroke-dashoffset 1500ms ease";
      path.style.strokeDashoffset = "0";
    });
  }, []);

  return (
    <div className="graph-root" ref={containerRef}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" role="img" aria-label="Health trend chart">
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00d4ff" />
            <stop offset="100%" stopColor="#0099cc" />
          </linearGradient>
          <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#0099cc" stopOpacity="0" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid */}
        {Array.from({ length: 5 }).map((_, i) => {
          const gy = padding.top + (i * (height - padding.top - padding.bottom)) / 4;
          return (
            <line key={i} x1={padding.left} x2={width - padding.right} y1={gy} y2={gy} className="grid-line" />
          );
        })}

        {/* X labels */}
        {labels.map((l, i) => (
          <text key={i} x={x(i)} y={height - 8} className="axis-label" textAnchor="middle">
            {l}
          </text>
        ))}

        {/* Area fill */}
        <path d={area} fill="url(#fillGrad)" />

        {/* Glowing line (two strokes: blurred outer + crisp inner) */}
        <path d={line} fill="none" stroke="#00b4e6" strokeOpacity="0.55" strokeWidth="6" filter="url(#glow)" />
        <path d={line} fill="none" stroke="url(#lineGrad)" strokeWidth="3" className="graph-line" strokeLinecap="round" strokeLinejoin="round" />

        {/* Points */}
        {data.map((v, i) => (
          <g
            key={i}
            onMouseEnter={() => setHover({ i, v })}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover({ i, v })}
            onBlur={() => setHover(null)}
          >
            <circle cx={x(i)} cy={y(v)} r={5} className="point" />
          </g>
        ))}

        {/* Tooltip */}
        {hover && (
          <g>
            <rect
              x={Math.min(Math.max(x(hover.i) - 36, padding.left), width - 120)}
              y={y(hover.v) - 46}
              width={110}
              height={34}
              rx={8}
              className="tooltip-bg"
            />
            <text
              x={Math.min(Math.max(x(hover.i) - 26, padding.left + 10), width - 100)}
              y={y(hover.v) - 24}
              className="tooltip-text"
            >
              {labels[hover.i]} • {hover.v.toFixed(1)}
            </text>
          </g>
        )}
      </svg>
      <div className="graph-legend" aria-hidden>
        <span className="dot" /> Healthy Trend
      </div>
    </div>
  );
};

export default AnimatedHealthGraph;
