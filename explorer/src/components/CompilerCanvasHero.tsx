import React, { useEffect, useRef } from 'react';
import { audioEngine } from '../utils/audio';

interface CyberNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  kanji: string;
  en: string;
  kind: 'meta' | 'csg' | 'vtable' | 'agent';
  pulse: number;
}

export const CompilerCanvasHero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const labels = [
      { kanji: '型反射', en: 'core::meta::Info', kind: 'meta' as const },
      { kanji: '構造体', en: 'layout_of::<T>()', kind: 'meta' as const },
      { kanji: '階層図', en: 'CSG HyperGraph', kind: 'csg' as const },
      { kanji: '動的表', en: 'VTable::reflect', kind: 'vtable' as const },
      { kanji: '解析機', en: 'csg::slice_around', kind: 'agent' as const },
      { kanji: '定数評価', en: 'TyCtxt::consteval', kind: 'meta' as const },
      { kanji: '代理者', en: 'Graph RAG Agent', kind: 'agent' as const },
      { kanji: '零負荷', en: '0-Cost Memory', kind: 'vtable' as const },
    ];

    // Initialize 24 Neo-Edo Cyber physics nodes
    const nodes: CyberNode[] = Array.from({ length: 24 }, (_, i) => {
      const item = labels[i % labels.length];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.9,
        vy: (Math.random() - 0.5) * 0.9,
        radius: Math.random() * 3 + 3,
        kanji: item.kanji,
        en: item.en,
        kind: item.kind,
        pulse: Math.random() * Math.PI * 2,
      };
    });

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      nodes.forEach((node) => {
        const dx = clickX - node.x;
        const dy = clickY - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 60) {
          node.pulse = Math.PI * 4;
          audioEngine.playCyberSweep();
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle cyber grid overlay
      ctx.strokeStyle = 'rgba(0, 255, 179, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 70;
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

      // Draw node laser connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 200) {
            const alpha = (1 - dist / 200) * 0.4;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            if (n1.kind === 'meta' || n2.kind === 'meta') {
              ctx.strokeStyle = `rgba(0, 255, 179, ${alpha})`; // Neon Cyan
            } else if (n1.kind === 'vtable' || n2.kind === 'vtable') {
              ctx.strokeStyle = `rgba(255, 42, 95, ${alpha})`; // Neon Crimson
            } else {
              ctx.strokeStyle = `rgba(255, 183, 3, ${alpha})`; // Neon Gold
            }
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }

      // Draw cyber nodes with Kanji and HUD targets
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Repel mouse
        const mdx = mouseX - node.x;
        const mdy = mouseY - node.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 140) {
          node.x -= (mdx / mdist) * 2.5;
          node.y -= (mdy / mdist) * 2.5;
        }

        if (node.pulse > 0) node.pulse -= 0.05;

        // Node Glow Circle
        const glowRadius = node.radius + Math.sin(Date.now() * 0.003 + node.pulse) * 4;
        ctx.beginPath();
        ctx.arc(node.x, node.y, Math.max(2, glowRadius), 0, Math.PI * 2);

        if (node.kind === 'meta') {
          ctx.fillStyle = '#00ffb3';
          ctx.shadowColor = '#00ffb3';
        } else if (node.kind === 'vtable') {
          ctx.fillStyle = '#ff2a5f';
          ctx.shadowColor = '#ff2a5f';
        } else if (node.kind === 'agent') {
          ctx.fillStyle = '#c084fc';
          ctx.shadowColor = '#c084fc';
        } else {
          ctx.fillStyle = '#ffb703';
          ctx.shadowColor = '#ffb703';
        }
        ctx.shadowBlur = 18;
        ctx.fill();

        // Draw Kanji & English Annotations
        ctx.shadowBlur = 0;
        ctx.font = 'bold 11px "Inter", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillText(node.kanji, node.x + 12, node.y - 2);

        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(0, 255, 179, 0.75)';
        ctx.fillText(node.en, node.x + 12, node.y + 10);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto cursor-crosshair opacity-90"
    />
  );
};
