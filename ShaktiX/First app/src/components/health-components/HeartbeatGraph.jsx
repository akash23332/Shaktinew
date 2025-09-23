import React, { useMemo } from "react";

/**
 * HeartbeatGraph (ECG)
 * - Smooth ECG-style path that scrolls horizontally for a live feel
 * - Props:
 *    width, height: SVG size (viewBox responsive)
 *    color: stroke color
 *    bpm: beats per minute (controls scroll speed)
 *    amplitude: vertical scale for spikes
 *    thickness: stroke width
 */
export default function HeartbeatGraph({
  width = 560,
  height = 240,
  color = "#00e0ff",
  bpm = 72,
  amplitude = 26,
  thickness = 3,
  paused = false,
  meter = true,
}) {
  const padding = { top: 20, right: 16, bottom: 28, left: 16 };
  const innerH = height - padding.top - padding.bottom;
  const midY = padding.top + innerH / 2;

  // Build one ECG cycle path (P-QRS-T)
  const cycle = useMemo(() => {
    const a = amplitude;
    const pts = [];
    let x = 0;
    const step = 18;

    pts.push(`M ${x} ${midY}`); // baseline
    x += step;
    // P wave
    pts.push(`C ${x - 10} ${midY}, ${x - 6} ${midY - a * 0.25}, ${x} ${midY - a * 0.25}`);
    x += step * 0.6;
    pts.push(`C ${x - 6} ${midY - a * 0.25}, ${x - 6} ${midY}, ${x} ${midY}`);

    // PR
    x += step * 0.4; pts.push(`L ${x} ${midY}`);
    // Q
    x += step * 0.25; pts.push(`L ${x} ${midY + a * 0.35}`);
    // R
    x += step * 0.25; pts.push(`L ${x} ${midY - a * 1.2}`);
    // S
    x += step * 0.25; pts.push(`L ${x} ${midY + a * 0.6}`);
    // baseline
    x += step * 0.4; pts.push(`L ${x} ${midY}`);
    // ST
    x += step * 0.8; pts.push(`L ${x} ${midY}`);
    // T
    pts.push(`C ${x + 8} ${midY}, ${x + 10} ${midY - a * 0.5}, ${x + 18} ${midY - a * 0.5}`);
    x += 26;
    pts.push(`C ${x} ${midY - a * 0.5}, ${x + 8} ${midY}, ${x + 20} ${midY}`);
    x += 24;
    // end baseline
    pts.push(`L ${x} ${midY}`);

    return { d: pts.join(" "), w: x };
  }, [amplitude, midY]);

  // Tiling and speed
  const cyclesPerSecond = bpm / 60; // how many cycles per second
  const cycleGap = 24; // spacing between cycles
  const cycleW = cycle.w + cycleGap;
  const viewTile = Math.max(width * 2, cycleW * 6);
  const repeats = Math.ceil(viewTile / cycleW) + 2;

  // Duration so that 1 cycle passes per (1 / cps) seconds
  const pixelsPerSecond = cyclesPerSecond * cycleW;
  const duration = Math.max(3, viewTile / pixelsPerSecond);
  // For meter mode we want the sweep to cross the viewport roughly once per second at given bpm.
  const sweepDuration = Math.max(2.5, 60 / bpm * 2); // seconds per full sweep (tweak factor 2)
  const tail = Math.max(140, width * 0.35); // tail length in px

  return (
    <div className="ecg-root">
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" role="img" aria-label="ECG heart line">
        <defs>
          <linearGradient id="ecgLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor="#26e1b1" />
          </linearGradient>
          <filter id="ecg-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="g" />
            <feMerge>
              <feMergeNode in="g" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="fadeMask" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0000" />
            <stop offset="8%" stopColor="#000" />
            <stop offset="92%" stopColor="#000" />
            <stop offset="100%" stopColor="#0000" />
          </linearGradient>
          <mask id="edgeFade">
            <rect x="0" y="0" width={width} height={height} fill="url(#fadeMask)" />
          </mask>

          {/* Sweep mask for meter mode */}
          <linearGradient id="sweepGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0000" />
            <stop offset="30%" stopColor="#fff" />
            <stop offset="100%" stopColor="#fff" />
          </linearGradient>
          <mask id="sweepMask">
            <g>
              <g>
                <rect x={-tail} y="0" width={tail} height={height} fill="url(#sweepGrad)" />
                {/* cursor */}
                <rect x={-2} y="0" width="2" height={height} fill="#ffffff" />
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from={`0 0`}
                  to={`${width + tail} 0`}
                  dur={`${sweepDuration}s`}
                  repeatCount="indefinite"
                  begin={paused ? "indefinite" : "0s"}
                />
              </g>
            </g>
          </mask>
        </defs>

        {/* grid lines */}
        {Array.from({ length: 4 }).map((_, i) => (
          <line key={i} x1={16} x2={width - 16} y1={20 + (i * (height - 48)) / 3} y2={20 + (i * (height - 48)) / 3} stroke="#142b3f" strokeWidth="1" />
        ))}

        <g
          mask={meter ? "url(#sweepMask)" : "url(#edgeFade)"}
          className={meter ? undefined : "ecg-scroll"}
          style={meter ? undefined : { "--ecg-duration": `${duration}s`, "--ecg-shift": `${cycleW}px`, animation: `ecg-scroll ${duration}s linear infinite`, animationPlayState: paused ? "paused" : "running" }}
        >
          {Array.from({ length: repeats }).map((_, i) => (
            <path
              key={i}
              d={cycle.d}
              transform={`translate(${i * cycleW}, 0)`}
              fill="none"
              stroke="url(#ecgLine)"
              strokeWidth={thickness}
              strokeLinecap="round"
              filter="url(#ecg-glow)"
              className="ecg-path"
            />
          ))}
        </g>
        {!meter && (
          // Fallback visible segment when not using meter sweep
          <path
            d={cycle.d}
            transform={`translate(${Math.max(16, (width - cycleW) / 2)}, 0)`}
            fill="none"
            stroke="url(#ecgLine)"
            strokeWidth={thickness}
            strokeLinecap="round"
            opacity="0.35"
          />
        )}
      </svg>
    </div>
  );
}
