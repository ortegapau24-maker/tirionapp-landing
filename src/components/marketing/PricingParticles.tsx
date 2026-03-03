'use client';

import { useEffect, useRef } from 'react';
import { hexToRgb, debounce } from '@/lib/utils';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
}

interface Props {
    activeColor: string;
    targetSelector?: string;
    blendMode?: string;
}

export default function PricingParticles({ activeColor, targetSelector = '.pricing-card', blendMode = 'mix-blend-multiply opacity-60' }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);



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
        const mouse = { x: -1000, y: -1000 };
        let cards: { cx: number; cy: number; width: number; height: number; }[] = [];
        let isVisible = true;

        // IntersectionObserver: only animate when visible
        const observer = new IntersectionObserver(
            ([entry]) => { isVisible = entry.isIntersecting; },
            { threshold: 0.05 }
        );
        observer.observe(canvas);

        const updateCards = () => {
            const cardElements = document.querySelectorAll(targetSelector);
            const parentRect = canvas.getBoundingClientRect();

            cards = Array.from(cardElements).map(el => {
                const rect = el.getBoundingClientRect();
                return {
                    width: rect.width,
                    height: rect.height,
                    cx: (rect.left - parentRect.left) + rect.width / 2,
                    cy: (rect.top - parentRect.top) + rect.height / 2
                };
            });
        };

        const resize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
                setTimeout(updateCards, 100);
                initParticles();
            }
        };

        const sdRoundRect = (px: number, py: number, bx: number, by: number, r: number) => {
            const qx = Math.abs(px) - bx + r;
            const qy = Math.abs(py) - by + r;
            const length = Math.sqrt(Math.max(qx, 0) ** 2 + Math.max(qy, 0) ** 2);
            return Math.min(Math.max(qx, qy), 0.0) + length - r;
        };

        const getCardSDF = (x: number, y: number, c: { cx: number; cy: number; width: number; height: number; }) => {
            const px = x - c.cx;
            const py = y - c.cy;
            const bx = c.width / 2;
            const by = c.height / 2;

            // Inflate bounds slightly to prevent them from passing over the border at all
            const dist = sdRoundRect(px, py, bx, by, 32);
            const eps = 0.1;
            const dx1 = sdRoundRect(px + eps, py, bx, by, 32);
            const dx2 = sdRoundRect(px - eps, py, bx, by, 32);
            const dy1 = sdRoundRect(px, py + eps, bx, by, 32);
            const dy2 = sdRoundRect(px, py - eps, bx, by, 32);
            let gradX = (dx1 - dx2) / (eps * 2);
            let gradY = (dy1 - dy2) / (eps * 2);

            const len = Math.sqrt(gradX * gradX + gradY * gradY);
            if (len > 0) {
                gradX /= len;
                gradY /= len;
            }
            return { dist, nx: gradX, ny: gradY };
        };

        const getNearestCardSDF = (x: number, y: number) => {
            let minDist = Infinity;
            let result = { dist: Infinity, nx: 0, ny: 0 };
            for (const c of cards) {
                const sdf = getCardSDF(x, y, c);
                if (sdf.dist < minDist) {
                    minDist = sdf.dist;
                    result = sdf;
                }
            }
            return result;
        };

        const initParticles = () => {
            particles = [];
            const particleCount = 565; // High density swarm
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 1.5,
                    vy: (Math.random() - 0.5) * 1.5,
                    size: Math.random() * 1.5 + 0.5,
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            animationFrameId = requestAnimationFrame(draw);
            if (!isVisible) return;

            if (cards.length === 0) {
                updateCards();
            }

            // Interpolate global color smoothly
            const tc = targetRgbRef.current;
            const cc = currentRgbRef.current;
            cc.r += (tc.r - cc.r) * 0.05;
            cc.g += (tc.g - cc.g) * 0.05;
            cc.b += (tc.b - cc.b) * 0.05;
            const fillStyle = `rgba(${Math.round(cc.r)}, ${Math.round(cc.g)}, ${Math.round(cc.b)}, 0.9)`;

            // Determine if a card is hovered
            let hoveredCard = null;
            if (mouse.x > -100 && mouse.y > -100) {
                for (const c of cards) {
                    if (Math.abs(mouse.x - c.cx) < c.width / 2 && Math.abs(mouse.y - c.cy) < c.height / 2) {
                        hoveredCard = c;
                        break;
                    }
                }
            }

            particles.forEach((p, index) => {
                p.x += p.vx;
                p.y += p.vy;

                // Moderate random wandering
                p.vx += (Math.random() - 0.5) * 0.8;
                p.vy += (Math.random() - 0.5) * 0.8;

                if (cards.length > 0) {
                    // 1. STRICT COLLISION PREVENTION against ALL cards
                    const nearestSdf = getNearestCardSDF(p.x, p.y);
                    if (nearestSdf.dist < 2) { // Cannot pass over card (dist < 2 is deeply inside border)
                        // Project strictly outwards
                        p.x += nearestSdf.nx * (-nearestSdf.dist + 3);
                        p.y += nearestSdf.ny * (-nearestSdf.dist + 3);

                        // Reflect velocity rigorously
                        const dot = p.vx * nearestSdf.nx + p.vy * nearestSdf.ny;
                        if (dot < 0) {
                            p.vx -= 1.8 * dot * nearestSdf.nx;
                            p.vy -= 1.8 * dot * nearestSdf.ny;
                        }
                    }

                    // 2. PATHING & SWARMING
                    let d = nearestSdf.dist;
                    let nx = nearestSdf.nx;
                    let ny = nearestSdf.ny;

                    if (hoveredCard) {
                        // Swarm the hovered card
                        const sdf = getCardSDF(p.x, p.y, hoveredCard);
                        d = sdf.dist;
                        nx = sdf.nx;
                        ny = sdf.ny;

                        if (d > 50) {
                            // Aggressively seek the target card
                            p.vx -= nx * 0.8;
                            p.vy -= ny * 0.8;
                        } else {
                            // Swirl rapidly along the edge
                            p.vx += -ny * 1.0;
                            p.vy += nx * 1.0;
                            p.vx -= nx * 0.2;
                            p.vy -= ny * 0.2;
                        }
                    } else {
                        // Ambient state: chaotically swirl around nearest cards
                        if (d > 120) {
                            p.vx -= nx * 0.2;
                            p.vy -= ny * 0.2;
                        } else {
                            p.vx += -ny * 0.4;
                            p.vy += nx * 0.4;
                        }
                    }
                }

                // Wave repel interaction from mouse
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 200;

                if (distance < maxDistance && !hoveredCard) {
                    const force = (maxDistance - distance) / maxDistance;
                    p.vx -= (dx / distance) * force * 1.5;
                    p.vy -= (dy / distance) * force * 1.5;
                }

                // Small collision repel to prevent clumping
                for (let j = index + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx2 = p.x - p2.x;
                    const dy2 = p.y - p2.y;
                    const distSq = dx2 * dx2 + dy2 * dy2;
                    if (distSq < 81) {
                        p.vx += dx2 * 0.02;
                        p.vy += dy2 * 0.02;
                        p2.vx -= dx2 * 0.02;
                        p2.vy -= dy2 * 0.02;
                    }
                }

                // Apply drag to limit speeds
                const maxSpeed = hoveredCard ? 10 : 4;
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


        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };

        const handleMouseLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
        };

        window.addEventListener('resize', debounce(resize, 150));
        const parent = canvasRef.current?.parentElement;
        if (parent) {
            parent.addEventListener('mousemove', handleMouseMove);
            parent.addEventListener('mouseleave', handleMouseLeave);
        }

        resize();
        draw();

        return () => {
            window.removeEventListener('resize', resize);
            if (parent) {
                parent.removeEventListener('mousemove', handleMouseMove);
                parent.removeEventListener('mouseleave', handleMouseLeave);
            }
            cancelAnimationFrame(animationFrameId);
            observer.disconnect();
        };
    }, [targetSelector]);

    return (
        <canvas
            ref={canvasRef}
            className={`absolute inset-0 w-full h-full pointer-events-none z-20 ${blendMode}`}
        />
    );
}
