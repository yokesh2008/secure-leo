import React, { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  type: 'server' | 'endpoint' | 'gateway' | 'sentinel' | 'threat';
  pulse: number;
  name: string;
}

interface Packet {
  sourceIndex: number;
  targetIndex: number;
  progress: number;
  speed: number;
  color: string;
  isThreat?: boolean;
}

export const CyberNetworkCanvas: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Initialize Network Topology Nodes
    const nodes: Node[] = [
      { x: width * 0.5, y: height * 0.45, vx: 0, vy: 0, radius: 10, color: '#00ff9d', type: 'sentinel', pulse: 0, name: 'LEO-CORE' },
      { x: width * 0.25, y: height * 0.28, vx: 0.15, vy: -0.1, radius: 5, color: '#00f0ff', type: 'gateway', pulse: 1, name: 'GW-INGRESS' },
      { x: width * 0.75, y: height * 0.28, vx: -0.1, vy: 0.12, radius: 5, color: '#00f0ff', type: 'server', pulse: 2, name: 'AUTH-DB' },
      { x: width * 0.18, y: height * 0.65, vx: 0.1, vy: 0.15, radius: 4, color: '#a855f7', type: 'endpoint', pulse: 0.5, name: 'CLIENT-01' },
      { x: width * 0.35, y: height * 0.78, vx: -0.12, vy: -0.1, radius: 4.5, color: '#00f0ff', type: 'endpoint', pulse: 1.5, name: 'CLIENT-02' },
      { x: width * 0.65, y: height * 0.75, vx: 0.1, vy: -0.1, radius: 4, color: '#a855f7', type: 'endpoint', pulse: 2.2, name: 'API-MESH' },
      { x: width * 0.82, y: height * 0.62, vx: -0.15, vy: 0.08, radius: 5, color: '#ff3366', type: 'threat', pulse: 3, name: 'HONEYPOT' },
      { x: width * 0.5, y: height * 0.15, vx: 0.05, vy: -0.05, radius: 4, color: '#00f0ff', type: 'gateway', pulse: 0.8, name: 'EDGE-WAF' },
    ];

    // Data packets traveling between nodes
    const packets: Packet[] = [
      { sourceIndex: 1, targetIndex: 0, progress: 0.1, speed: 0.007, color: '#00f0ff' },
      { sourceIndex: 0, targetIndex: 2, progress: 0.4, speed: 0.009, color: '#00ff9d' },
      { sourceIndex: 3, targetIndex: 1, progress: 0.7, speed: 0.006, color: '#00f0ff' },
      { sourceIndex: 6, targetIndex: 0, progress: 0.2, speed: 0.008, color: '#ff3366', isThreat: true },
      { sourceIndex: 0, targetIndex: 5, progress: 0.5, speed: 0.007, color: '#00ff9d' },
    ];

    let mouseX = -1000;
    let mouseY = -1000;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    canvas.addEventListener('mousemove', onMouseMove);

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle background cyber grid
      ctx.strokeStyle = 'rgba(27, 42, 71, 0.25)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update and connect nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Slight drift (except central sentinel)
        if (i !== 0) {
          node.x += node.vx;
          node.y += node.vy;

          if (node.x < 40 || node.x > width - 40) node.vx *= -1;
          if (node.y < 40 || node.y > height - 40) node.vy *= -1;
        }

        node.pulse += 0.03;

        // Draw connections to nearby nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const maxDist = width > 600 ? 240 : 160;
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.35;
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      }

      // Draw and animate traveling data packets
      for (const packet of packets) {
        packet.progress += packet.speed;
        if (packet.progress >= 1) {
          packet.progress = 0;
          // Switch target or randomize
          packet.sourceIndex = Math.floor(Math.random() * nodes.length);
          let newTarget = Math.floor(Math.random() * nodes.length);
          while (newTarget === packet.sourceIndex) {
            newTarget = Math.floor(Math.random() * nodes.length);
          }
          packet.targetIndex = newTarget;
        }

        const source = nodes[packet.sourceIndex];
        const target = nodes[packet.targetIndex];
        if (source && target) {
          const px = source.x + (target.x - source.x) * packet.progress;
          const py = source.y + (target.y - source.y) * packet.progress;

          ctx.fillStyle = packet.color;
          ctx.shadowColor = packet.color;
          ctx.shadowBlur = packet.isThreat ? 10 : 6;
          ctx.beginPath();
          ctx.arc(px, py, packet.isThreat ? 3.5 : 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // Draw Nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const pulseEffect = Math.sin(node.pulse) * 3;

        // Glowing outer pulse ring
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 4 + Math.max(0, pulseEffect), 0, Math.PI * 2);
        ctx.stroke();

        // Node core
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = i === 0 ? 16 : 8;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Node label
        ctx.fillStyle = '#94a3b8';
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(node.name, node.x, node.y + node.radius + 14);
      }

      // Draw interactive cursor shield aura if mouse is inside canvas
      if (mouseX > 0 && mouseY > 0 && mouseX < width && mouseY < height) {
        ctx.strokeStyle = 'rgba(0, 255, 157, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 30, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={`relative w-full h-full overflow-hidden rounded-2xl border border-cyber-border/60 bg-cyber-surface/70 backdrop-blur-md shadow-card-glow ${className}`}>
      <canvas ref={canvasRef} className="block w-full h-full cursor-crosshair" />
      {/* Top telemetry tag */}
      <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded bg-cyber-bg/80 border border-cyber-border text-[10px] font-mono text-cyber-neonCyan">
        <span className="w-2 h-2 rounded-full bg-cyber-neonGreen animate-pulse" />
        <span>SECURE LEO LIVE TOPOLOGY // 8 NODES ACTIVE</span>
      </div>
      {/* Bottom status */}
      <div className="absolute bottom-3 right-3 hidden sm:flex items-center gap-3 px-3 py-1 rounded bg-cyber-bg/80 border border-cyber-border text-[10px] font-mono text-cyber-textMuted">
        <span>ENCRYPTION: TLS 1.3 / AES-256-GCM</span>
        <span className="text-cyber-neonGreen">STATUS: NORMAL</span>
      </div>
    </div>
  );
};
