'use client';

import { useEffect, useRef } from 'react';

interface Dot {
    lx: number; ly: number; lz: number;
    shade: number;
    size: number;
}

const cos = Math.cos, sin = Math.sin;

const ISO_COS = cos(Math.PI / 6);
const ISO_SIN = sin(Math.PI / 6);

function generateFace(
    n: number, shade: number,
    transform: (u: number, v: number) => { lx: number; ly: number; lz: number }
): Dot[] {
    const dots: Dot[] = new Array(n);
    for (let i = 0; i < n; i++) {
        const u = Math.random() - 0.5, v = Math.random() - 0.5;
        dots[i] = { ...transform(u, v), shade, size: Math.random() * 1.3 + 0.5 };
    }
    return dots;
}

export function HeroCube() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let animationFrameId: number;
        let angleY = 0.52, angleX = -0.55;
        const targetAngleY = 0.52;
        let targetAngleX = -0.55;
        let isVisible = true;

        // Reduced to 4500/face = 13,500 total (was 24,000)
        const N = 4500;
        const allDots: Dot[] = [
            ...generateFace(N, 0.07, (u, v) => ({ lx: u, ly: 0.5, lz: v })),
            ...generateFace(N, 0.38, (u, v) => ({ lx: 0.5, ly: v, lz: u })),
            ...generateFace(N, 0.72, (u, v) => ({ lx: u, ly: v, lz: 0.5 })),
        ];
        const total = allDots.length;

        // Pre-allocate offset arrays (TypedArrays for speed)
        const offDx = new Float32Array(total);
        const offDy = new Float32Array(total);
        const offDz = new Float32Array(total);
        const offVx = new Float32Array(total);
        const offVy = new Float32Array(total);
        const offVz = new Float32Array(total);

        // Pre-allocate projection buffer
        const projX = new Float32Array(total);
        const projY = new Float32Array(total);

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        // IntersectionObserver: only animate when visible
        const observer = new IntersectionObserver(
            ([entry]) => { isVisible = entry.isIntersecting; },
            { threshold: 0.05 }
        );
        observer.observe(canvas);



        const draw = () => {
            animationFrameId = requestAnimationFrame(draw);
            if (!isVisible) return;

            // Map scroll to vertical rotation (angleX)
            const scrollY = window.scrollY || document.documentElement.scrollTop;
            const vh = window.innerHeight;
            // Base angle is -0.55. Rotate roughly PI/2 (1.5) over 150vh.
            targetAngleX = -0.55 + (scrollY / vh) * 1.5;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            angleY += (targetAngleY - angleY) * 0.12;
            angleX += (targetAngleX - angleX) * 0.12;

            // Increase base scale on mobile (e.g. width < 768px)
            const baseScale = canvas.width < 768 ? 0.65 : 0.24;
            const scale = canvas.width * baseScale;
            const cx = canvas.width / 2;
            const cy = canvas.height * (canvas.width < 768 ? 0.95 : 0.85);

            // Precompute trig
            const caY = cos(angleY), saY = sin(angleY);
            const caX = cos(angleX), saX = sin(angleX);

            // Project all dots (no sorting — stipple doesn't need it)
            for (let i = 0; i < total; i++) {
                const d = allDots[i];

                // Apply offsets with drag + decay
                offDx[i] += offVx[i]; offDy[i] += offVy[i]; offDz[i] += offVz[i];
                offVx[i] *= 0.88; offVy[i] *= 0.88; offVz[i] *= 0.88;
                offDx[i] *= 0.96; offDy[i] *= 0.96; offDz[i] *= 0.96;

                const x = d.lx + offDx[i];
                const y = d.ly + offDy[i];
                const z = d.lz + offDz[i];

                // Inline rotateY
                const rx1 = x * caY + z * saY;
                const rz1 = -x * saY + z * caY;
                // Inline rotateX
                const ry2 = y * caX - rz1 * saX;
                const rz2 = y * saX + rz1 * caX;

                // Inline project (isometric)
                projX[i] = cx + (rx1 - rz2) * ISO_COS * scale;
                projY[i] = cy + (rx1 + rz2) * ISO_SIN * scale - ry2 * scale;
            }

            // Batch draw by shade group (3 groups instead of per-particle fillStyle)
            const shadeGroups = [0.07, 0.38, 0.72];
            const dotsPerGroup = N;

            for (let g = 0; g < 3; g++) {
                const alpha = Math.min((shadeGroups[g] + 0.05) * 0.8, 1);
                ctx.fillStyle = `rgba(5,5,5,${alpha.toFixed(2)})`;
                const start = g * dotsPerGroup;
                const end = start + dotsPerGroup;

                ctx.beginPath();
                for (let i = start; i < end; i++) {
                    const s = allDots[i].size;
                    // Use rect instead of arc — 3-5x faster
                    ctx.rect(projX[i] - s * 0.5, projY[i] - s * 0.5, s, s);
                }
                ctx.fill();
            }
        };

        window.addEventListener('resize', resize);
        resize();
        draw();

        return () => {
            window.removeEventListener('resize', resize);
            observer.disconnect();
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
        />
    );
}
