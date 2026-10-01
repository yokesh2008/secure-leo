import React, { useEffect, useState, useRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  targetValue: number;
  suffix?: string;
  icon: LucideIcon;
  sublabel?: string;
  accentColor?: 'green' | 'cyan' | 'amber' | 'purple';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  targetValue,
  suffix = '',
  icon: Icon,
  sublabel = 'Simulated Benchmark Data',
  accentColor = 'green',
}) => {
  const [currentValue, setCurrentValue] = useState(0);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          const duration = 1600; // ms
          const steps = 40;
          const stepTime = duration / steps;
          const increment = targetValue / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= targetValue) {
              setCurrentValue(targetValue);
              clearInterval(timer);
            } else {
              setCurrentValue(Math.floor(current));
            }
          }, stepTime);
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [targetValue, hasAnimated]);

  const colorStyles = {
    green: {
      border: 'border-cyber-neonGreen/30 hover:border-cyber-neonGreen',
      text: 'text-cyber-neonGreen',
      bgGlow: 'group-hover:shadow-glow-green',
      badge: 'bg-cyber-neonGreen/10 text-cyber-neonGreen border-cyber-neonGreen/30',
    },
    cyan: {
      border: 'border-cyber-neonCyan/30 hover:border-cyber-neonCyan',
      text: 'text-cyber-neonCyan',
      bgGlow: 'group-hover:shadow-glow-cyan',
      badge: 'bg-cyber-neonCyan/10 text-cyber-neonCyan border-cyber-neonCyan/30',
    },
    amber: {
      border: 'border-cyber-neonAmber/30 hover:border-cyber-neonAmber',
      text: 'text-cyber-neonAmber',
      bgGlow: 'group-hover:shadow-glow-amber',
      badge: 'bg-cyber-neonAmber/10 text-cyber-neonAmber border-cyber-neonAmber/30',
    },
    purple: {
      border: 'border-cyber-neonPurple/30 hover:border-cyber-neonPurple',
      text: 'text-cyber-neonPurple',
      bgGlow: 'group-hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]',
      badge: 'bg-cyber-neonPurple/10 text-cyber-neonPurple border-cyber-neonPurple/30',
    },
  }[accentColor];

  return (
    <div
      ref={cardRef}
      className={`group relative overflow-hidden rounded-2xl bg-cyber-card/80 border p-6 backdrop-blur-md transition-all duration-300 ${colorStyles.border} ${colorStyles.bgGlow}`}
    >
      {/* Background cyber circuit pattern */}
      <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none">
        <Icon className="w-40 h-40" />
      </div>

      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyber-textMuted">
            {label}
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className={`text-4xl sm:text-5xl font-mono font-black tracking-tight ${colorStyles.text}`}>
              {currentValue.toLocaleString()}
            </span>
            {suffix && (
              <span className={`text-xl font-mono font-bold ${colorStyles.text}`}>
                {suffix}
              </span>
            )}
          </div>
        </div>

        <div className={`p-3 rounded-xl border ${colorStyles.badge}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-cyber-border/60 flex items-center justify-between text-[11px] font-mono text-cyber-textMuted">
        <span>{sublabel}</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyber-panel border border-cyber-border">
          DEMO METRIC
        </span>
      </div>
    </div>
  );
};
