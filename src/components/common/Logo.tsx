import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showTagline = false, className = '' }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Precision Geometric SVG: Shield + Circuit Traces + Minimal Geometric Leo Lion Profile + Core Lock */}
      <div className={`relative ${iconSizes[size]} flex-shrink-0 group`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full filter drop-shadow-[0_0_10px_rgba(0,255,157,0.35)] transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#06090f" />
            </linearGradient>
            <linearGradient id="neonEdge" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="50%" stopColor="#00ff9d" />
              <stop offset="100%" stopColor="#00f0ff" />
            </linearGradient>
          </defs>

          {/* Outer Protective Shield Perimeter */}
          <polygon
            points="50,6 88,22 88,58 50,94 12,58 12,22"
            fill="url(#shieldGrad)"
            stroke="url(#neonEdge)"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Inner Circuit Trace Network */}
          <path
            d="M50,14 L50,26 M28,30 L38,30 L44,36 M72,30 L62,30 L56,36 M30,50 L40,50 M70,50 L60,50 M50,74 L50,86"
            stroke="#1e3a5f"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Minimalist Geometric Leo/Lion Angular Brow & Mane Contours */}
          <path
            d="M32,36 L44,28 L56,28 L68,36 L62,46 L50,42 L38,46 Z"
            fill="#0d1b2a"
            stroke="#00f0ff"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          {/* Angular Lion Muzzle & Jaw */}
          <path
            d="M40,50 L50,58 L60,50 L50,46 Z"
            fill="#06121e"
            stroke="#00ff9d"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Core Central Security Lock / Sentinel Node */}
          <rect
            x="45"
            y="62"
            width="10"
            height="9"
            rx="2"
            fill="#00ff9d"
            className="animate-pulse"
          />
          <path
            d="M47,62 L47,58 C47,56.34 48.34,55 50,55 C51.66,55 53,56.34 53,58 L53,62"
            stroke="#00ff9d"
            strokeWidth="1.5"
            fill="none"
          />

          {/* Circuit Nodes */}
          <circle cx="28" cy="30" r="2" fill="#00f0ff" />
          <circle cx="72" cy="30" r="2" fill="#00f0ff" />
          <circle cx="50" cy="90" r="2" fill="#00ff9d" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 font-mono font-extrabold tracking-wider">
          <span className={`text-cyber-textBright font-black ${textSizes[size]} tracking-tight`}>
            SECURE
          </span>
          <span className={`text-cyber-neonGreen ${textSizes[size]} tracking-wider drop-shadow-[0_0_8px_rgba(0,255,157,0.4)]`}>
            LEO
          </span>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyber-panel border border-cyber-border text-cyber-neonCyan ml-1 hidden sm:inline-block">
            SOC v2.4
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] font-mono tracking-widest text-cyber-neonCyan/80 uppercase font-semibold">
            BREAK. LEARN. SECURE.
          </span>
        )}
      </div>
    </div>
  );
};
