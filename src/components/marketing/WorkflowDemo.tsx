"use client";

import React, { useEffect, useRef, useCallback, useState } from 'react';

interface WorkflowDemoProps {
    step: number;
}

interface NodeDef {
    id: string;
    x: number; // percentage
    y: number;
    show: boolean;
    label: string;
    color: string;
    radius: number;
}

interface EdgeDef {
    source: string;
    target: string;
    show: boolean;
    color: string;
}

interface SphereParticle {
    // 3D coords relative to center
    px: number; py: number; pz: number;
    // target on sphere surface
    tx: number; ty: number; tz: number;
    size: number;
    phi: number;
    theta: number;
}

interface FlowParticle {
    t: number;
    speed: number;
    size: number;
}

function bezierPoint(t: number, x1: number, y1: number, cx1: number, cy1: number, cx2: number, cy2: number, x2: number, y2: number) {
    const u = 1 - t;
    return {
        x: u * u * u * x1 + 3 * u * u * t * cx1 + 3 * u * t * t * cx2 + t * t * t * x2,
        y: u * u * u * y1 + 3 * u * u * t * cy1 + 3 * u * t * t * cy2 + t * t * t * y2,
    };
}

function hexToRgb(hex: string) {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : { r: 120, g: 120, b: 120 };
}

export function WorkflowDemo({ step }: WorkflowDemoProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const sphereParticlesRef = useRef<Map<string, SphereParticle[]>>(new Map());
    const flowParticlesRef = useRef<Map<string, FlowParticle[]>>(new Map());
    const rotationRef = useRef(0);
    const animIdRef = useRef(0);
    const birthTimesRef = useRef<Map<string, number>>(new Map());

    const ANIM_DURATION = 600; // ms for node entrance animation

    // Easing function (ease-out cubic)
    function easeOutCubic(t: number) {
        return 1 - Math.pow(1 - t, 3);
    }

    // Get animation progress (0 to 1) for a node
    function getNodeProgress(nodeId: string, now: number): number {
        const birth = birthTimesRef.current.get(nodeId);
        if (birth === undefined) return 0;
        const elapsed = now - birth;
        if (elapsed >= ANIM_DURATION) return 1;
        return easeOutCubic(Math.max(0, elapsed / ANIM_DURATION));
    }

    const showTrigger = step >= 1;
    const showRouter = step >= 2;
    const showZendesk = step >= 4;
    const showSlack = step >= 4;
    const showPostgres = step >= 5;
    const showTwilio = step >= 8;

    const nodes: NodeDef[] = [
        { id: '1', x: 50, y: 15, show: showTrigger, label: 'Email Trigger', color: '#3B82F6', radius: 44 },
        { id: '2', x: 50, y: 30, show: showRouter, label: 'LLM Parser', color: '#8B5CF6', radius: 48 },
        { id: '3', x: 22, y: 50, show: showZendesk, label: 'Zendesk', color: '#EF4444', radius: 38 },
        { id: '4', x: 12, y: 72, show: showSlack, label: 'Slack', color: '#10B981', radius: 36 },
        { id: '3b', x: 28, y: 72, show: showZendesk, label: 'Jira', color: '#F59E0B', radius: 36 },
        { id: '7', x: 50, y: 52, show: showRouter, label: 'Pinecone', color: '#3B82F6', radius: 38 },
        { id: '8', x: 50, y: 74, show: showTwilio, label: 'SendGrid', color: '#06B6D4', radius: 36 },
        { id: '5', x: 78, y: 50, show: showPostgres, label: 'PostgreSQL', color: '#10B981', radius: 38 },
        { id: '6', x: 72, y: 72, show: showTwilio, label: 'Twilio', color: '#F22F46', radius: 36 },
        { id: '5b', x: 88, y: 72, show: showPostgres, label: 'HubSpot', color: '#FF7A59', radius: 36 },
    ];

    // Track birth times for newly-visible nodes
    useEffect(() => {
        const now = performance.now();
        nodes.forEach(node => {
            if (node.show && !birthTimesRef.current.has(node.id)) {
                birthTimesRef.current.set(node.id, now);
            }
        });
    }, [step]);

    const edges: EdgeDef[] = [
        { source: '1', target: '2', show: showRouter, color: '#9CA3AF' },
        { source: '2', target: '3', show: showZendesk, color: '#EF4444' },
        { source: '3', target: '4', show: showSlack, color: '#9CA3AF' },
        { source: '3', target: '3b', show: showZendesk, color: '#9CA3AF' },
        { source: '2', target: '7', show: showRouter, color: '#3B82F6' },
        { source: '7', target: '8', show: showTwilio, color: '#9CA3AF' },
        { source: '2', target: '5', show: showPostgres, color: '#10B981' },
        { source: '5', target: '6', show: showTwilio, color: '#9CA3AF' },
        { source: '5', target: '5b', show: showPostgres, color: '#9CA3AF' },
    ];

    const SPHERE_PARTICLES = 50;
    const FLOW_PARTICLES = 14;

    // Initialize sphere particles for a node
    const ensureSphere = useCallback((nodeId: string, radius: number) => {
        if (sphereParticlesRef.current.has(nodeId)) return;
        const particles: SphereParticle[] = [];
        const goldenAngle = Math.PI * (3 - Math.sqrt(5));
        for (let i = 0; i < SPHERE_PARTICLES; i++) {
            const y = 1 - (i / (SPHERE_PARTICLES - 1)) * 2;
            const rAtY = Math.sqrt(1 - y * y);
            const theta = goldenAngle * i;
            const px = Math.cos(theta) * rAtY * radius;
            const py = y * radius;
            const pz = Math.sin(theta) * rAtY * radius;
            particles.push({ px, py, pz, tx: px, ty: py, tz: pz, size: 0.8 + Math.random() * 0.8, phi: Math.acos(y), theta });
        }
        sphereParticlesRef.current.set(nodeId, particles);
    }, []);

    // Initialize flow particles for an edge
    const ensureFlow = useCallback((edgeKey: string) => {
        if (flowParticlesRef.current.has(edgeKey)) return;
        const particles: FlowParticle[] = [];
        for (let i = 0; i < FLOW_PARTICLES; i++) {
            particles.push({ t: Math.random(), speed: 0.003 + Math.random() * 0.004, size: 0.8 + Math.random() * 1.0 });
        }
        flowParticlesRef.current.set(edgeKey, particles);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = container.clientWidth * dpr;
            canvas.height = container.clientHeight * dpr;
            canvas.style.width = `${container.clientWidth}px`;
            canvas.style.height = `${container.clientHeight}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();

        const draw = () => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            ctx.clearRect(0, 0, w, h);

            // Apply global zoom to everything
            ctx.save();
            const ZOOM = 0.9;
            ctx.translate(w / 2, h / 2);
            ctx.scale(ZOOM, ZOOM);
            ctx.translate(-w / 2, -h / 2);

            rotationRef.current += 0.008;
            const cosR = Math.cos(rotationRef.current);
            const sinR = Math.sin(rotationRef.current);
            const now = performance.now();

            // --- Draw flow particles on edges ---
            const activeEdges = edges.filter(e => e.show);
            activeEdges.forEach(edge => {
                const s = nodes.find(n => n.id === edge.source);
                const t = nodes.find(n => n.id === edge.target);
                if (!s || !t) return;

                const x1 = (s.x / 100) * w, y1 = (s.y / 100) * h + 20;
                const x2 = (t.x / 100) * w, y2 = (t.y / 100) * h - 20;
                const midY = (y1 + y2) / 2;

                // Faint path  
                const rgb = hexToRgb(edge.color);
                // Animate edge alpha based on source node's birth progress
                const edgeProgress = getNodeProgress(edge.target, now);
                if (edgeProgress <= 0) return;

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.bezierCurveTo(x1, midY, x2, midY, x2, y2);
                ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.08 * edgeProgress})`;
                ctx.lineWidth = 1;
                ctx.stroke();

                const edgeKey = `${edge.source}-${edge.target}`;
                ensureFlow(edgeKey);
                const flowPs = flowParticlesRef.current.get(edgeKey);
                if (!flowPs) return;

                flowPs.forEach(fp => {
                    fp.t += fp.speed;
                    if (fp.t > 1) fp.t -= 1;
                    const pos = bezierPoint(fp.t, x1, y1, x1, midY, x2, midY, x2, y2);

                    // Glow
                    ctx.beginPath();
                    ctx.arc(pos.x, pos.y, fp.size * 2.5, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.06 * edgeProgress})`;
                    ctx.fill();

                    ctx.beginPath();
                    ctx.arc(pos.x, pos.y, fp.size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.7 * edgeProgress})`;
                    ctx.fill();
                });
            });

            // --- Draw sphere-nodes ---
            const activeNodes = nodes.filter(n => n.show);
            activeNodes.forEach(node => {
                const progress = getNodeProgress(node.id, now);
                if (progress <= 0) return;

                const scaleFactor = progress;
                const cx = (node.x / 100) * w;
                const cy = (node.y / 100) * h;
                const rgb = hexToRgb(node.color);

                ensureSphere(node.id, node.radius);
                const spherePs = sphereParticlesRef.current.get(node.id);
                if (!spherePs) return;

                // Collect projected particles for depth sort
                const projected: { sx: number; sy: number; depth: number; size: number; alpha: number }[] = [];

                spherePs.forEach(sp => {
                    // Gently drift to target
                    sp.px += (sp.tx - sp.px) * 0.05;
                    sp.py += (sp.ty - sp.py) * 0.05;
                    sp.pz += (sp.tz - sp.pz) * 0.05;

                    // Y-axis rotation
                    const rx = sp.px * cosR - sp.pz * sinR;
                    const rz = sp.px * sinR + sp.pz * cosR;

                    const perspective = 400;
                    const scale = perspective / (perspective + rz);
                    const sx = cx + rx * scale;
                    const sy = cy + sp.py * scale;
                    const normalizedDepth = (rz + node.radius) / (node.radius * 2);
                    const alpha = 0.2 + normalizedDepth * 0.8;

                    projected.push({ sx, sy, depth: rz, size: sp.size * scale * 1.2, alpha });
                });

                projected.sort((a, b) => a.depth - b.depth);

                projected.forEach(pt => {
                    ctx.beginPath();
                    ctx.arc(pt.sx, pt.sy, pt.size * scaleFactor, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${pt.alpha * progress})`;
                    ctx.fill();
                });

                // Label
                ctx.save();
                ctx.font = '600 10px Inter, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';
                ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.9 * progress})`;
                ctx.fillText(node.label, cx, cy + node.radius + 8);
                ctx.restore();
            });

            ctx.restore();
            animIdRef.current = requestAnimationFrame(draw);
        };

        window.addEventListener('resize', resize);
        animIdRef.current = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animIdRef.current);
        };
    }, [step, ensureSphere, ensureFlow]);

    return (
        <div ref={containerRef} className="w-full h-full relative">
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
            />
        </div>
    );
}
