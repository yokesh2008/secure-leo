import React from 'react';
import { Activity, Shield, Server, Database, BookOpen } from 'lucide-react';

export const StatusStrip: React.FC = () => {
  const systems = [
    {
      name: 'LAB ENVIRONMENT',
      status: 'ONLINE',
      color: 'text-cyber-neonGreen',
      dotColor: 'bg-cyber-neonGreen',
      latency: '14ms',
      icon: Server,
    },
    {
      name: 'DEMO API',
      status: 'OPERATIONAL',
      color: 'text-cyber-neonCyan',
      dotColor: 'bg-cyber-neonCyan',
      latency: '22ms',
      icon: Activity,
    },
    {
      name: 'LAB DATABASE',
      status: 'SECURE',
      color: 'text-cyber-neonGreen',
      dotColor: 'bg-cyber-neonGreen',
      latency: '8ms',
      icon: Database,
    },
    {
      name: 'LEARNING ENGINE',
      status: 'ONLINE',
      color: 'text-cyber-neonCyan',
      dotColor: 'bg-cyber-neonCyan',
      latency: '18ms',
      icon: BookOpen,
    },
  ];

  return (
    <div className="w-full bg-cyber-surface/90 border-y border-cyber-border py-2.5 px-4 sm:px-8 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Left Indicator */}
        <div className="flex items-center gap-2 text-xs font-mono text-cyber-textMuted uppercase tracking-wider">
          <Shield className="w-4 h-4 text-cyber-neonGreen" />
          <span className="text-cyber-textBright font-semibold">SECURE LEO SOC TELEMETRY</span>
          <span className="hidden md:inline-block text-cyber-textMuted">|</span>
          <span className="hidden md:inline-block text-[11px] text-cyber-neonGreen/80">SIMULATED ENVIRONMENT</span>
        </div>

        {/* System Node Grid */}
        <div className="flex flex-wrap items-center gap-6 sm:gap-8 font-mono text-xs">
          {systems.map((sys) => {
            const IconComponent = sys.icon;
            return (
              <div key={sys.name} className="flex items-center gap-2 group cursor-default">
                <IconComponent className="w-3.5 h-3.5 text-cyber-textMuted group-hover:text-cyber-textBright transition-colors" />
                <span className="text-cyber-textDim text-[11px] font-medium tracking-wide">
                  {sys.name}
                </span>
                <span className="flex items-center gap-1.5 font-bold">
                  <span className={`w-2 h-2 rounded-full ${sys.dotColor} animate-pulse`} />
                  <span className={`text-[11px] tracking-wider ${sys.color}`}>
                    {sys.status}
                  </span>
                </span>
                <span className="hidden lg:inline text-[10px] text-cyber-textMuted/70 font-normal">
                  ({sys.latency})
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
