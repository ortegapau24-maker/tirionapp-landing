'use client';

import { useEffect, useRef } from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';

interface Particle {
    x: number;
    y: number;
    z: number;
    // Scattered position (deconstructed state)
    sx: number;
    sy: number;
    sz: number;
    radius: number;
    color: string;
}

interface ParticleSphereProps {
    scrollYProgress: MotionValue<number>;
    /** 0 = fully scattered, 1 = fully formed sphere */
    constructionProgress?: MotionValue<number>;
}

export function ParticleSphere({ scrollYProgress, constructionProgress }: ParticleSphereProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Map scroll progress to the same rotation amount as the rotating library cards
    const rotationY = useTransform(scrollYProgress, [0, 1], [0, -Math.PI * 2]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];

        const numParticles = 400;
        const sphereRadius = 180;
        const scatterRadius = 600; // How far particles scatter when deconstructed

        const initParticles = () => {
            particles = [];

            const offset = 2 / numParticles;
            const increment = Math.PI * (3 - Math.sqrt(5));

            for (let i = 0; i < numParticles; i++) {
                const y = ((i * offset) - 1) + (offset / 2);
                const r = Math.sqrt(1 - Math.pow(y, 2));
                const phi = ((i + 1) % numParticles) * increment;

                const x = Math.cos(phi) * r;
                const z = Math.sin(phi) * r;

                const colorBase = 'rgba(0, 0, 0, ';
                const opacity = Math.random() * 0.5 + 0.3;

                // Random scattered positions (spread out from center)
                const scatterAngle1 = Math.random() * Math.PI * 2;
                const scatterAngle2 = Math.random() * Math.PI - Math.PI / 2;
                const scatterDist = scatterRadius * (0.5 + Math.random() * 0.5);

                particles.push({
                    x: x * sphereRadius,
                    y: y * sphereRadius,
                    z: z * sphereRadius,
                    sx: Math.cos(scatterAngle1) * Math.cos(scatterAngle2) * scatterDist,
                    sy: Math.sin(scatterAngle2) * scatterDist,
                    sz: Math.sin(scatterAngle1) * Math.cos(scatterAngle2) * scatterDist,
                    radius: Math.random() * 1.5 + 0.5,
                    color: `${colorBase}${opacity})`
                });
            }
        };

        const resize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                const size = Math.min(parent.clientWidth, parent.clientHeight);
                canvas.width = size;
                canvas.height = size;
                initParticles();
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            const currentRotation = rotationY.get();
            const cosY = Math.cos(currentRotation);
            const sinY = Math.sin(currentRotation);

            const time = Date.now() * 0.0005;
            const cosX = Math.cos(time * 0.5);
            const sinX = Math.sin(time * 0.5);

            // Get construction progress (default to 1 = fully formed)
            const cp = constructionProgress ? constructionProgress.get() : 1;

            const projectedParticles = particles.map(p => {
                // Lerp between scattered and sphere positions based on construction progress
                const px = p.sx + (p.x - p.sx) * cp;
                const py = p.sy + (p.y - p.sy) * cp;
                const pz = p.sz + (p.z - p.sz) * cp;

                // Apply Scroll Rotation (Y-axis)
                const tempX = px * cosY - pz * sinY;
                const tempZ = pz * cosY + px * sinY;
                const tempY = py;

                // Apply Ambient Rotation (X-axis)
                const finalY = tempY * cosX - tempZ * sinX;
                const finalZ = tempZ * cosX + tempY * sinX;
                const finalX = tempX;

                // Perspective projection
                const fov = 400;
                const scale = fov / (fov + finalZ + sphereRadius * 0.5);

                return {
                    ...p,
                    projectedX: finalX * scale + centerX,
                    projectedY: finalY * scale + centerY,
                    scale: scale,
                    finalZ: finalZ
                };
            });

            projectedParticles.sort((a, b) => b.finalZ - a.finalZ);

            // Draw Core Glow (fade with construction progress)
            if (cp > 0.3) {
                const glowAlpha = Math.min(1, (cp - 0.3) / 0.7);
                const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, sphereRadius * 0.8);
                gradient.addColorStop(0, `rgba(0, 0, 0, ${0.05 * glowAlpha})`);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(centerX, centerY, sphereRadius, 0, Math.PI * 2);
                ctx.fill();
            }

            // Draw Particles
            projectedParticles.forEach(p => {
                if (p.scale > 0) {
                    ctx.beginPath();
                    ctx.arc(p.projectedX, p.projectedY, Math.max(0.1, p.radius * p.scale), 0, Math.PI * 2);

                    const alphaModifier = Math.min(1, Math.max(0.2, (sphereRadius - p.finalZ) / (sphereRadius * 2)));
                    ctx.globalAlpha = alphaModifier;

                    ctx.fillStyle = p.color;
                    ctx.fill();
                }
            });
            ctx.globalAlpha = 1.0;

            animationFrameId = requestAnimationFrame(draw);
        };

        window.addEventListener('resize', resize);
        resize();
        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [rotationY, constructionProgress]);

    return (
        <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <canvas
                ref={canvasRef}
                className="w-full h-full max-w-[800px] max-h-[800px] mix-blend-screen"
            />
        </motion.div>
    );
}
