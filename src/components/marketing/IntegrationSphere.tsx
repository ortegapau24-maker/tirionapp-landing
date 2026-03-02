'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Integration {
    name: string;
    color: string;
}

const integrations: Integration[] = [
    { name: 'Salesforce', color: '#00a1e0' },
    { name: 'HubSpot', color: '#ff7a59' },
    { name: 'GoHighLevel', color: '#0550B3' },
    { name: 'Stripe', color: '#635bff' },
    { name: 'Twilio', color: '#F22F46' },
    { name: 'Zendesk', color: '#03363D' },
    { name: 'Intercom', color: '#188FFF' },
    { name: 'Notion', color: '#191919' },
    { name: 'Slack', color: '#4A154B' },
    { name: 'OpenAI', color: '#10a37f' },
    { name: 'WhatsApp', color: '#25D366' },
    { name: 'Calendly', color: '#006BFF' },
    { name: 'Zoom', color: '#2D8CFF' },
    { name: 'Gmail', color: '#EA4335' },
    { name: 'Linear', color: '#5E6AD2' },
];

interface Particle {
    // Current position
    x: number;
    y: number;
    z: number;
    // Target position on the sphere surface
    tx: number;
    ty: number;
    tz: number;
    // Velocity for explosion/reform
    vx: number;
    vy: number;
    vz: number;
    // Sphere angles (for rotation)
    phi: number;
    theta: number;
    size: number;
    baseSize: number;
}

function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
        : { r: 100, g: 100, b: 100 };
}

export function IntegrationSphere() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentIndexRef = useRef(0);
    const morphPhaseRef = useRef<'idle' | 'explode' | 'reform'>('idle');
    const morphTimerRef = useRef(0);

    // Smoothly interpolated color
    const currentColorRef = useRef(hexToRgb(integrations[0].color));
    const targetColorRef = useRef(hexToRgb(integrations[0].color));

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animId: number;
        let particles: Particle[] = [];
        const SPHERE_RADIUS = 160;
        const PARTICLE_COUNT = 600;
        let rotationAngle = 0;

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            const parent = canvas.parentElement;
            if (!parent) return;
            canvas.width = parent.clientWidth * dpr;
            canvas.height = parent.clientHeight * dpr;
            canvas.style.width = `${parent.clientWidth}px`;
            canvas.style.height = `${parent.clientHeight}px`;
            ctx.scale(dpr, dpr);
        };

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                // Fibonacci sphere distribution for even spacing
                const goldenAngle = Math.PI * (3 - Math.sqrt(5));
                const y = 1 - (i / (PARTICLE_COUNT - 1)) * 2; // -1 to 1
                const radiusAtY = Math.sqrt(1 - y * y);
                const theta = goldenAngle * i;

                const px = Math.cos(theta) * radiusAtY * SPHERE_RADIUS;
                const py = y * SPHERE_RADIUS;
                const pz = Math.sin(theta) * radiusAtY * SPHERE_RADIUS;

                const phi = Math.acos(y);

                particles.push({
                    x: px,
                    y: py,
                    z: pz,
                    tx: px,
                    ty: py,
                    tz: pz,
                    vx: 0,
                    vy: 0,
                    vz: 0,
                    phi,
                    theta,
                    size: Math.random() * 1.2 + 0.8,
                    baseSize: Math.random() * 1.2 + 0.8,
                });
            }
        };

        // Morph cycle: idle (4s) -> explode (0.6s) -> reform (0.8s) -> idle
        const IDLE_DURATION = 2000;
        const EXPLODE_DURATION = 350;
        const REFORM_DURATION = 450;
        let lastTime = performance.now();

        const triggerMorph = () => {
            morphPhaseRef.current = 'explode';
            morphTimerRef.current = 0;

            // Assign explosion velocities
            particles.forEach(p => {
                const speed = 4 + Math.random() * 6;
                const angle1 = Math.random() * Math.PI * 2;
                const angle2 = Math.random() * Math.PI - Math.PI / 2;
                p.vx = Math.cos(angle1) * Math.cos(angle2) * speed;
                p.vy = Math.sin(angle2) * speed;
                p.vz = Math.sin(angle1) * Math.cos(angle2) * speed;
            });
        };

        const advanceIntegration = () => {
            const nextIndex = (currentIndexRef.current + 1) % integrations.length;
            currentIndexRef.current = nextIndex;
            setCurrentIndex(nextIndex);
            targetColorRef.current = hexToRgb(integrations[nextIndex].color);
        };

        const startReform = () => {
            morphPhaseRef.current = 'reform';
            morphTimerRef.current = 0;

            // Reassign target positions (new distribution so it looks different)
            const goldenAngle = Math.PI * (3 - Math.sqrt(5));
            const offset = Math.random() * Math.PI * 2; // Random rotation offset
            particles.forEach((p, i) => {
                const y = 1 - (i / (PARTICLE_COUNT - 1)) * 2;
                const radiusAtY = Math.sqrt(1 - y * y);
                const theta = goldenAngle * i + offset;

                p.tx = Math.cos(theta) * radiusAtY * SPHERE_RADIUS;
                p.ty = y * SPHERE_RADIUS;
                p.tz = Math.sin(theta) * radiusAtY * SPHERE_RADIUS;
            });
        };

        const draw = (now: number) => {
            const dt = Math.min(now - lastTime, 32); // Cap delta
            lastTime = now;

            const dpr = window.devicePixelRatio || 1;
            const w = canvas.width / dpr;
            const h = canvas.height / dpr;
            ctx.clearRect(0, 0, w, h);

            const cx = w / 2;
            const cy = h / 2;

            // Interpolate color
            const cc = currentColorRef.current;
            const tc = targetColorRef.current;
            cc.r += (tc.r - cc.r) * 0.04;
            cc.g += (tc.g - cc.g) * 0.04;
            cc.b += (tc.b - cc.b) * 0.04;

            // Update morph state
            morphTimerRef.current += dt;

            if (morphPhaseRef.current === 'idle') {
                if (morphTimerRef.current >= IDLE_DURATION) {
                    triggerMorph();
                }
            } else if (morphPhaseRef.current === 'explode') {
                if (morphTimerRef.current >= EXPLODE_DURATION) {
                    advanceIntegration();
                    startReform();
                }
            } else if (morphPhaseRef.current === 'reform') {
                if (morphTimerRef.current >= REFORM_DURATION) {
                    morphPhaseRef.current = 'idle';
                    morphTimerRef.current = 0;
                }
            }

            // Slow rotation
            rotationAngle += 0.003;

            // Sort particles by z for depth ordering
            const projected: { sx: number; sy: number; depth: number; size: number; alpha: number }[] = [];

            particles.forEach(p => {
                const dtSec = dt / 1000;

                if (morphPhaseRef.current === 'explode') {
                    // Moving outward
                    p.x += p.vx * dtSec * 60;
                    p.y += p.vy * dtSec * 60;
                    p.z += p.vz * dtSec * 60;
                    // Damping
                    p.vx *= 0.97;
                    p.vy *= 0.97;
                    p.vz *= 0.97;
                } else if (morphPhaseRef.current === 'reform') {
                    // Ease back to target
                    const t = Math.min(morphTimerRef.current / REFORM_DURATION, 1);
                    const ease = t * t * (3 - 2 * t); // smoothstep
                    p.x += (p.tx - p.x) * ease * 0.25;
                    p.y += (p.ty - p.y) * ease * 0.25;
                    p.z += (p.tz - p.z) * ease * 0.25;
                } else {
                    // Idle: gently drift toward target with small oscillation
                    p.x += (p.tx - p.x) * 0.05;
                    p.y += (p.ty - p.y) * 0.05;
                    p.z += (p.tz - p.z) * 0.05;
                }

                // Apply Y-axis rotation
                const cos = Math.cos(rotationAngle);
                const sin = Math.sin(rotationAngle);
                const rx = p.x * cos - p.z * sin;
                const rz = p.x * sin + p.z * cos;

                // Simple perspective projection
                const perspective = 600;
                const scale = perspective / (perspective + rz);
                const sx = cx + rx * scale;
                const sy = cy + p.y * scale;
                const depth = rz;

                // Depth-based alpha and size
                const normalizedDepth = (rz + SPHERE_RADIUS) / (SPHERE_RADIUS * 2);
                const alpha = 0.25 + normalizedDepth * 0.75;
                const size = p.baseSize * scale * 1.5;

                projected.push({ sx, sy, depth, size, alpha });
            });

            // Sort back-to-front
            projected.sort((a, b) => a.depth - b.depth);

            // Draw
            projected.forEach(pt => {
                ctx.beginPath();
                ctx.arc(pt.sx, pt.sy, pt.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${Math.round(cc.r)}, ${Math.round(cc.g)}, ${Math.round(cc.b)}, ${pt.alpha})`;
                ctx.fill();
            });

            animId = requestAnimationFrame(draw);
        };

        window.addEventListener('resize', resize);
        resize();
        initParticles();
        morphTimerRef.current = 0;
        morphPhaseRef.current = 'idle';
        animId = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animId);
        };
    }, []);

    const current = integrations[currentIndex];

    return (
        <div className="py-16 md:py-24 bg-white flex flex-col items-center rounded-[32px] md:rounded-[64px] m-4 md:m-10 border border-agency-border-light shadow-[0_16px_48px_rgba(0,0,0,0.04)] relative z-10">

            <div className="text-[0.9rem] uppercase tracking-[0.15em] text-agency-text-muted mb-4 font-semibold text-center font-inter relative z-20">
                Native Integrations
            </div>

            <div className="relative w-full max-w-[600px] h-[350px] md:h-[450px] mx-auto flex items-center justify-center">
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                />
                {/* Central name label */}
                <div className="relative z-10 flex flex-col items-center pointer-events-none select-none">
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={current.name}
                            initial={{ opacity: 0, scale: 0.8, filter: 'blur(8px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 1.1, filter: 'blur(8px)' }}
                            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                            className="text-[clamp(1.3rem,2vw,1.8rem)] font-bold font-outfit tracking-[-0.03em]"
                            style={{ color: current.color }}
                        >
                            {current.name}
                        </motion.span>
                    </AnimatePresence>
                    <span className="text-agency-text-muted text-[0.95rem] mt-2 font-light">
                        and {integrations.length - 1} more
                    </span>
                </div>
            </div>
        </div>
    );
}
