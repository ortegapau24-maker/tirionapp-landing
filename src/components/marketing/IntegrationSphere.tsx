'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { hexToRgb, debounce } from '@/lib/utils';

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
    x: number;
    y: number;
    z: number;
    tx: number;
    ty: number;
    tz: number;
    vx: number;
    vy: number;
    vz: number;
    phi: number;
    theta: number;
    size: number;
    baseSize: number;
}

function SphereCanvas({
    radius,
    delayMs,
    isCenter,
    startIndex
}: {
    radius: number;
    delayMs: number;
    isCenter: boolean;
    startIndex: number;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [currentIndex, setCurrentIndex] = useState(startIndex);
    const currentIndexRef = useRef(startIndex);
    const morphPhaseRef = useRef<'idle' | 'wait' | 'explode' | 'reform'>('wait');
    const morphTimerRef = useRef(0);

    const currentColorRef = useRef(hexToRgb(integrations[startIndex].color));
    const targetColorRef = useRef(hexToRgb(integrations[startIndex].color));

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animId: number;
        let particles: Particle[] = [];
        const SPHERE_RADIUS = radius;
        // Scale particle count based on sphere size so it doesn't look too sparse or dense
        const PARTICLE_COUNT = isCenter ? 700 : 350;
        let rotationAngle = 0;
        let isVisible = true;

        const observer = new IntersectionObserver(
            ([entry]) => { isVisible = entry.isIntersecting; },
            { threshold: 0.05 }
        );
        observer.observe(canvas);

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
                const goldenAngle = Math.PI * (3 - Math.sqrt(5));
                const y = 1 - (i / (PARTICLE_COUNT - 1)) * 2;
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

        const IDLE_DURATION = 2400; // Increased to give room for 3 spheres to cycle rhythmically
        const EXPLODE_DURATION = 350;
        const REFORM_DURATION = 450;
        const TOTAL_CYCLE = IDLE_DURATION + EXPLODE_DURATION + REFORM_DURATION;
        let lastTime = performance.now();

        const triggerMorph = () => {
            morphPhaseRef.current = 'explode';
            morphTimerRef.current = 0;

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

            const goldenAngle = Math.PI * (3 - Math.sqrt(5));
            const offset = Math.random() * Math.PI * 2;
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
            const dt = Math.min(now - lastTime, 32);
            lastTime = now;

            const dpr = window.devicePixelRatio || 1;
            const w = canvas.width / dpr;
            const h = canvas.height / dpr;
            ctx.clearRect(0, 0, w, h);

            const cx = w / 2;
            const cy = h / 2;

            const cc = currentColorRef.current;
            const tc = targetColorRef.current;
            cc.r += (tc.r - cc.r) * 0.04;
            cc.g += (tc.g - cc.g) * 0.04;
            cc.b += (tc.b - cc.b) * 0.04;

            morphTimerRef.current += dt;

            // Simple state machine
            if (morphPhaseRef.current === 'wait') {
                if (morphTimerRef.current >= delayMs) {
                    morphPhaseRef.current = 'idle';
                    morphTimerRef.current = 0;
                }
            } else if (morphPhaseRef.current === 'idle') {
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

            rotationAngle += 0.003;
            const projected: { sx: number; sy: number; depth: number; size: number; alpha: number }[] = [];

            particles.forEach(p => {
                const dtSec = dt / 1000;

                if (morphPhaseRef.current === 'explode') {
                    p.x += p.vx * dtSec * 60;
                    p.y += p.vy * dtSec * 60;
                    p.z += p.vz * dtSec * 60;
                    p.vx *= 0.97;
                    p.vy *= 0.97;
                    p.vz *= 0.97;
                } else if (morphPhaseRef.current === 'reform') {
                    const t = Math.min(morphTimerRef.current / REFORM_DURATION, 1);
                    const ease = t * t * (3 - 2 * t);
                    p.x += (p.tx - p.x) * ease * 0.25;
                    p.y += (p.ty - p.y) * ease * 0.25;
                    p.z += (p.tz - p.z) * ease * 0.25;
                } else {
                    p.x += (p.tx - p.x) * 0.05;
                    p.y += (p.ty - p.y) * 0.05;
                    p.z += (p.tz - p.z) * 0.05;
                }

                const cos = Math.cos(rotationAngle);
                const sin = Math.sin(rotationAngle);
                const rx = p.x * cos - p.z * sin;
                const rz = p.x * sin + p.z * cos;

                const perspective = 600;
                const scale = perspective / (perspective + rz);
                const sx = cx + rx * scale;
                const sy = cy + p.y * scale;
                const depth = rz;

                const normalizedDepth = (rz + SPHERE_RADIUS) / (SPHERE_RADIUS * 2);
                const alpha = 0.25 + normalizedDepth * 0.75;
                const size = p.baseSize * scale * 1.5;

                projected.push({ sx, sy, depth, size, alpha });
            });

            projected.sort((a, b) => a.depth - b.depth);

            projected.forEach(pt => {
                ctx.beginPath();
                ctx.arc(pt.sx, pt.sy, pt.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${Math.round(cc.r)}, ${Math.round(cc.g)}, ${Math.round(cc.b)}, ${pt.alpha})`;
                ctx.fill();
            });

            animId = requestAnimationFrame(draw);
            if (!isVisible) return;
        };

        window.addEventListener('resize', debounce(resize, 150));
        resize();
        initParticles();
        morphTimerRef.current = 0;
        morphPhaseRef.current = 'wait'; // Start by waiting for initial delay
        animId = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener('resize', resize);
            observer.disconnect();
            cancelAnimationFrame(animId);
        };
    }, [radius, delayMs, isCenter]);

    const current = integrations[currentIndex];

    return (
        <div className={`relative flex items-center justify-center shrink-0 ${isCenter
            ? 'w-full md:w-[700px] h-[300px] md:h-[750px] z-10'
            : 'w-full md:w-[320px] h-[180px] md:h-[450px] flex opacity-60'
            }`}>
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
            />

            {/* Display the integration name */}
            <div className="relative z-10 flex flex-col items-center pointer-events-none select-none">
                <AnimatePresence mode="wait">
                    <motion.span
                        key={current.name}
                        initial={{ opacity: 0, scale: 0.8, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 1.1, filter: 'blur(8px)' }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className={`font-bold font-outfit tracking-[-0.03em] ${isCenter ? 'text-[clamp(1.5rem,2.5vw,2.2rem)]' : 'text-[clamp(1rem,1.5vw,1.3rem)]'
                            }`}
                        style={{ color: current.color }}
                    >
                        {current.name}
                    </motion.span>
                </AnimatePresence>
                {isCenter && (
                    <span className="text-agency-text-muted text-[1rem] mt-2 font-light">
                        and {integrations.length - 1} more
                    </span>
                )}
            </div>
        </div>
    );
}

export default function IntegrationSphere() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className="w-full my-8 md:my-24 px-4 md:px-0">
            <div className="bg-agency-bg-surface rounded-[2.5rem] md:rounded-[6rem] py-12 md:py-24 flex flex-col items-center relative z-10 w-full overflow-hidden">
                <div className="text-[0.8rem] md:text-[0.9rem] uppercase tracking-[0.15em] text-agency-text-muted mb-8 font-semibold text-center font-inter relative z-20">
                    Native Integrations
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center w-full gap-8 md:gap-4 lg:gap-8 xl:gap-8">
                    {/* Top/Left Sphere */}
                    <div className="relative z-30 w-full flex justify-center">
                        <SphereCanvas radius={isMobile ? 45 : 110} delayMs={0} isCenter={false} startIndex={5} />
                    </div>

                    {/* Center Sphere */}
                    <div className="relative z-40 w-full flex justify-center">
                        <SphereCanvas radius={isMobile ? 80 : 220} delayMs={1000} isCenter={true} startIndex={0} />
                    </div>

                    {/* Bottom/Right Sphere */}
                    <div className="relative z-20 w-full flex justify-center">
                        <SphereCanvas radius={isMobile ? 45 : 110} delayMs={2000} isCenter={false} startIndex={10} />
                    </div>
                </div>
            </div>
        </div>
    );
}
