'use client';

import React, { useEffect, useRef, useCallback } from 'react';

interface ParticleCardProps {
    width: number;
    height: number;
    borderRadius: number;
    particleCount?: number;
    className?: string;
}

interface Particle {
    x: number;
    y: number;
    tx: number;
    ty: number;
    size: number;
    alpha: number;
    speed: number;
}

export function ParticleCard({
    width,
    height,
    borderRadius,
    particleCount = 400,
    className = '',
}: ParticleCardProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animIdRef = useRef(0);
    const initRef = useRef(false);

    const initParticles = useCallback(() => {
        if (initRef.current) return;
        initRef.current = true;

        const particles: Particle[] = [];
        for (let i = 0; i < particleCount; i++) {
            // Distribute particles only along the border
            let tx: number, ty: number;

            // Place on edges with rounded corner awareness
            const side = Math.floor(Math.random() * 4);
            const margin = 2; // Close to edge
            switch (side) {
                case 0: // top
                    tx = margin + Math.random() * (width - margin * 2);
                    ty = margin + Math.random() * 8;
                    break;
                case 1: // bottom
                    tx = margin + Math.random() * (width - margin * 2);
                    ty = height - margin - Math.random() * 8;
                    break;
                case 2: // left
                    tx = margin + Math.random() * 8;
                    ty = margin + Math.random() * (height - margin * 2);
                    break;
                case 3: // right
                default:
                    tx = width - margin - Math.random() * 8;
                    ty = margin + Math.random() * (height - margin * 2);
                    break;
            }

            particles.push({
                x: width / 2 + (Math.random() - 0.5) * 40,
                y: height / 2 + (Math.random() - 0.5) * 40,
                tx,
                ty,
                size: 1.0 + Math.random() * 1.5,
                alpha: 0.3 + Math.random() * 0.5,
                speed: 0.02 + Math.random() * 0.04,
            });
        }
        particlesRef.current = particles;
    }, [width, height, particleCount]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        initParticles();

        let time = 0;
        const draw = () => {
            ctx.clearRect(0, 0, width, height);
            time += 0.01;

            particlesRef.current.forEach(p => {
                // Drift toward target
                p.x += (p.tx - p.x) * p.speed;
                p.y += (p.ty - p.y) * p.speed;

                // Subtle floating oscillation
                const ox = Math.sin(time * 2 + p.tx * 0.05) * 1.5;
                const oy = Math.cos(time * 2.5 + p.ty * 0.05) * 1.5;

                ctx.beginPath();
                ctx.arc(p.x + ox, p.y + oy, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 0, 0, ${p.alpha})`;
                ctx.fill();
            });

            animIdRef.current = requestAnimationFrame(draw);
        };

        animIdRef.current = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(animIdRef.current);
    }, [width, height, initParticles]);

    return (
        <canvas
            ref={canvasRef}
            className={className}
            style={{ borderRadius: `${borderRadius}px` }}
        />
    );
}
