import React from 'react';

interface RadarSkill {
  name: string;
  level: number; // 0 - 100
}

interface RadarChartProps {
  skills: RadarSkill[];
  size?: number;
  className?: string;
}

export const RadarChart: React.FC<RadarChartProps> = ({ skills, size = 320, className = '' }) => {
  const center = size / 2;
  const radius = size * 0.38;
  const totalAxes = skills.length;

  // Compute coordinate for an axis at given percentage radius
  const getCoordinates = (index: number, factor: number) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const x = center + radius * factor * Math.cos(angle);
    const y = center + radius * factor * Math.sin(angle);
    return { x, y };
  };

  // Concentric polygon levels (20%, 40%, 60%, 80%, 100%)
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Data polygon points
  const dataPoints = skills.map((skill, index) => {
    const factor = Math.max(0.1, skill.level / 100);
    return getCoordinates(index, factor);
  });

  const dataPolygonString = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      <svg width={size} height={size} className="overflow-visible">
        <defs>
          <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#00ff9d" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Concentric grid polygons */}
        {levels.map((lvl, lIdx) => {
          const gridPoints = skills.map((_, i) => getCoordinates(i, lvl));
          const ptsStr = gridPoints.map(p => `${p.x},${p.y}`).join(' ');
          return (
            <polygon
              key={`lvl-${lIdx}`}
              points={ptsStr}
              fill="none"
              stroke="#1b2a47"
              strokeWidth={lIdx === levels.length - 1 ? '1.5' : '1'}
              strokeDasharray={lIdx === levels.length - 1 ? 'none' : '3 3'}
            />
          );
        })}

        {/* Axis rays */}
        {skills.map((_, i) => {
          const outerPt = getCoordinates(i, 1.0);
          return (
            <line
              key={`axis-${i}`}
              x1={center}
              y1={center}
              x2={outerPt.x}
              y2={outerPt.y}
              stroke="#1b2a47"
              strokeWidth="1"
            />
          );
        })}

        {/* Data polygon filled with cyber glow */}
        <polygon
          points={dataPolygonString}
          fill="url(#radarFill)"
          stroke="#00ff9d"
          strokeWidth="2"
          className="filter drop-shadow-[0_0_10px_rgba(0,255,157,0.5)]"
        />

        {/* Vertex points */}
        {dataPoints.map((pt, i) => (
          <circle
            key={`pt-${i}`}
            cx={pt.x}
            cy={pt.y}
            r="4.5"
            fill="#00ff9d"
            stroke="#06090f"
            strokeWidth="2"
            className="transition-transform duration-200 hover:scale-150"
          />
        ))}

        {/* Axis Labels */}
        {skills.map((skill, i) => {
          const labelPt = getCoordinates(i, 1.22);
          return (
            <text
              key={`label-${i}`}
              x={labelPt.x}
              y={labelPt.y}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-cyber-textDim font-mono text-[10px] font-semibold"
            >
              {skill.name} ({skill.level}%)
            </text>
          );
        })}
      </svg>
    </div>
  );
};
