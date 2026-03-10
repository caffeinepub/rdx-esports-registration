import { useCallback, useEffect, useRef } from "react";

interface Spark {
  x: number;
  y: number;
  angle: number;
  length: number;
  life: number;
  maxLife: number;
  speed: number;
  width: number;
  color: string;
}

const COLORS = [
  "#FFD700",
  "#FF6A00",
  "#FF3C00",
  "#FFF700",
  "#FF9500",
  "#FF4E50",
  "#FFFFFF",
];

export function ClickSpark() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const rafRef = useRef<number>(0);

  const addSparks = useCallback((x: number, y: number) => {
    const count = 12 + Math.floor(Math.random() * 8);
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = 2.5 + Math.random() * 4;
      const life = 18 + Math.floor(Math.random() * 12);
      sparksRef.current.push({
        x,
        y,
        angle,
        length: 6 + Math.random() * 10,
        life,
        maxLife: life,
        speed,
        width: 1.5 + Math.random() * 1.5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      sparksRef.current = sparksRef.current.filter((s) => s.life > 0);

      for (const s of sparksRef.current) {
        const progress = 1 - s.life / s.maxLife;
        const alpha = 1 - progress;
        const dist = s.speed * (s.maxLife - s.life);
        const x1 = s.x + Math.cos(s.angle) * dist;
        const y1 = s.y + Math.sin(s.angle) * dist;
        const x2 = x1 + Math.cos(s.angle) * s.length * (1 - progress);
        const y2 = y1 + Math.sin(s.angle) * s.length * (1 - progress);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = s.color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = s.width * (1 - progress * 0.5);
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 6;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;

        s.life--;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      addSparks(e.clientX, e.clientY);
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [addSparks]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}
