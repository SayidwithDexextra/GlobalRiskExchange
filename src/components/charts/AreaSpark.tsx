'use client';

import { useId } from 'react';

interface AreaSparkProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  fill?: boolean;
  className?: string;
}

export function AreaSpark({
  data,
  width = 100,
  height = 40,
  color = 'var(--green)',
  strokeWidth = 1.5,
  fill = true,
  className = '',
}: AreaSparkProps) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 2;

  // Generate smooth path using catmull-rom spline
  const points = data.map((v, i) => ({
    x: padding + (i / (data.length - 1)) * (width - padding * 2),
    y: padding + (1 - (v - min) / range) * (height - padding * 2),
  }));

  // Create smooth curve
  let path = `M ${points[0].x} ${points[0].y}`;
  
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    // Catmull-Rom to Bezier conversion
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  // Create fill path
  const fillPath = fill
    ? `${path} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`
    : '';

  // Determine if trend is up (last > first)
  const isUp = data[data.length - 1] >= data[0];
  const actualColor = color === 'auto' ? (isUp ? 'var(--green)' : 'var(--red)') : color;

  const gradientId = useId();

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ width: '100%', height: '100%' }}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={actualColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={actualColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && (
        <path d={fillPath} fill={`url(#${gradientId})`} />
      )}
      <path
        d={path}
        fill="none"
        stroke={actualColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Larger area chart with axis
interface AreaChartProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  min?: number;
  max?: number;
  refPrice?: number;
  grid?: boolean;
  volumeBars?: number[];
}

export function AreaChart({
  data,
  width = 200,
  height = 100,
  color = 'var(--green)',
  min: propMin,
  max: propMax,
  refPrice: refLine,
  grid = false,
  volumeBars,
}: AreaChartProps) {
  if (data.length < 2) return null;

  const min = propMin ?? Math.min(...data);
  const max = propMax ?? Math.max(...data);
  const range = max - min || 1;
  const padding = { left: 4, right: 4, top: 4, bottom: volumeBars ? 20 : 4 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const points = data.map((v, i) => ({
    x: padding.left + (i / (data.length - 1)) * chartWidth,
    y: padding.top + (1 - (v - min) / range) * chartHeight,
  }));

  // Create smooth curve
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  const fillPath = `${path} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`;

  const isUp = data[data.length - 1] >= data[0];
  const actualColor = color === 'auto' ? (isUp ? 'var(--green)' : 'var(--red)') : color;
  const gradientId = useId();

  // Reference line position
  const refY = refLine !== undefined
    ? padding.top + (1 - (refLine - min) / range) * chartHeight
    : null;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={actualColor} stopOpacity="0.25" />
          <stop offset="100%" stopColor={actualColor} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid */}
      {grid && (
        <g stroke="var(--line)" strokeWidth="0.5" strokeDasharray="2 2">
          {[0.25, 0.5, 0.75].map((p) => (
            <line
              key={p}
              x1={padding.left}
              x2={width - padding.right}
              y1={padding.top + chartHeight * p}
              y2={padding.top + chartHeight * p}
            />
          ))}
        </g>
      )}

      {/* Reference line */}
      {refY !== null && (
        <line
          x1={padding.left}
          x2={width - padding.right}
          y1={refY}
          y2={refY}
          stroke="var(--t4)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      )}

      {/* Fill */}
      <path d={fillPath} fill={`url(#${gradientId})`} />

      {/* Line */}
      <path
        d={path}
        fill="none"
        stroke={actualColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Volume bars */}
      {volumeBars && (
        <g>
          {volumeBars.map((v, i) => {
            const barWidth = chartWidth / volumeBars.length - 1;
            const barHeight = v * 16;
            const x = padding.left + (i / volumeBars.length) * chartWidth;
            return (
              <rect
                key={i}
                x={x}
                y={height - padding.bottom + 4 - barHeight}
                width={barWidth}
                height={barHeight}
                fill={i === volumeBars.length - 1 ? 'var(--t3)' : 'var(--line2)'}
                rx="1"
              />
            );
          })}
        </g>
      )}
    </svg>
  );
}
