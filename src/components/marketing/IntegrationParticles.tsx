'use client';

import { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
}

interface Props {
    activeColor: string;
    radius: number;
    intensity?: 'normal' | 'high';
}

export function IntegrationParticles({ activeColor, radius, intensity = 'normal' }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Parse hex to rgb
    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    };

    const targetRgbRef = useRef(hexToRgb(activeColor));
    const currentRgbRef = useRef(hexToRgb(activeColor));

    useEffect(() => {
        targetRgbRef.current = hexToRgb(activeColor);
    }, [activeColor]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];

        const INSET = 40; // matches -inset-10 (2.5rem = 40px)

        const resize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                // Canvas resolution must match its CSS display size (parent + 2×inset)
                canvas.width = parent.clientWidth + INSET * 2;
                canvas.height = parent.clientHeight + INSET * 2;
                initParticles();
            }
        };

        const getCircleSDF = (x: number, y: number, cx: number, cy: number, r: number) => {
            const dx = x - cx;
            const dy = y - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Normalize gradient
            const nx = dist > 0 ? dx / dist : 1;
            const ny = dist > 0 ? dy / dist : 0;

            return { dist: dist - r, nx, ny };
        };

        const initParticles = () => {
            particles = [];
            const particleCount = intensity === 'high' ? 80 : 40;
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            for (let i = 0; i < particleCount; i++) {
                // Spawn in a ring outside the radius
                const angle = Math.random() * Math.PI * 2;
                const spawnRadius = radius + 5 + Math.random() * 20;
                particles.push({
                    x: cx + Math.cos(angle) * spawnRadius,
                    y: cy + Math.sin(angle) * spawnRadius,
                    vx: (Math.random() - 0.5) * 1.5,
                    vy: (Math.random() - 0.5) * 1.5,
                    size: Math.random() * 1.5 + 0.5,
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            // Interpolate global color smoothly
            const tc = targetRgbRef.current;
            const cc = currentRgbRef.current;
            cc.r += (tc.r - cc.r) * 0.05;
            cc.g += (tc.g - cc.g) * 0.05;
            cc.b += (tc.b - cc.b) * 0.05;
            const fillStyle = `rgba(${Math.round(cc.r)}, ${Math.round(cc.g)}, ${Math.round(cc.b)}, 0.9)`;

            particles.forEach((p, index) => {
                p.x += p.vx;
                p.y += p.vy;

                // Moderate random wandering
                p.vx += (Math.random() - 0.5) * 0.8;
                p.vy += (Math.random() - 0.5) * 0.8;

                const sdf = getCircleSDF(p.x, p.y, cx, cy, radius);

                // 1. STRICT COLLISION PREVENTION against the circle
                if (sdf.dist < 2) {
                    // Project strictly outwards
                    p.x += sdf.nx * (-sdf.dist + 3);
                    p.y += sdf.ny * (-sdf.dist + 3);

                    // Reflect velocity rigorously
                    const dot = p.vx * sdf.nx + p.vy * sdf.ny;
                    if (dot < 0) {
                        p.vx -= 1.8 * dot * sdf.nx;
                        p.vy -= 1.8 * dot * sdf.ny;
                    }
                }

                // 2. PATHING & SWARMING
                const d = sdf.dist;
                const nx = sdf.nx;
                const ny = sdf.ny;

                // Keep particles tightly bound to the circle edge
                if (d > 25) {
                    // Aggressively seek the target
                    p.vx -= nx * 0.5;
                    p.vy -= ny * 0.5;
                } else {
                    // Swirl rapidly along the edge
                    p.vx += -ny * 0.6;
                    p.vy += nx * 0.6;
                    p.vx -= nx * 0.1;
                    p.vy -= ny * 0.1;
                }

                // Small collision repel to prevent clumping
                for (let j = index + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx2 = p.x - p2.x;
                    const dy2 = p.y - p2.y;
                    const distSq = dx2 * dx2 + dy2 * dy2;
                    if (distSq < 40) {
                        p.vx += dx2 * 0.03;
                        p.vy += dy2 * 0.03;
                        p2.vx -= dx2 * 0.03;
                        p2.vy -= dy2 * 0.03;
                    }
                }

                // Apply drag to limit speeds
                const maxSpeed = 3.5;
                const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                if (speed > maxSpeed) {
                    p.vx = (p.vx / speed) * maxSpeed;
                    p.vy = (p.vy / speed) * maxSpeed;
                }

                // Apply drag
                p.vx *= 0.88;
                p.vy *= 0.88;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = fillStyle;
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        window.addEventListener('resize', resize);
        resize();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [radius]);

    return (
        <canvas
            ref={canvasRef}
            // We give it an extra absolute inset so the particles can safely orbit OUTSIDE the bounding box of the text/logo
            className="absolute -inset-10 w-[calc(100%+80px)] h-[calc(100%+80px)] pointer-events-none z-10 opacity-75"
        />
    );
}
