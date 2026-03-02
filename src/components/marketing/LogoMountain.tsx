"use client"

import React, { useEffect, useRef, useState } from "react"
import Matter from "matter-js"
import { IntegrationParticles } from "./IntegrationParticles"

interface Logo {
    id: string
    name: string
    svgPath: string | React.ReactNode
    color: string
    radius?: number
}

const logos: Logo[] = [
    {
        id: "salesforce",
        name: "Salesforce",
        color: "#00a1e0",
        svgPath: "M10.006 5.415a4.2 4.2 0 0 1 3.045-1.306c1.56 0 2.954.9 3.69 2.205c.63-.3 1.35-.45 2.1-.45c2.85 0 5.159 2.34 5.159 5.22s-2.31 5.22-5.176 5.22c-.345 0-.69-.044-1.02-.104a3.75 3.75 0 0 1-3.3 1.95c-.6 0-1.155-.15-1.65-.375A4.31 4.31 0 0 1 8.88 20.4a4.3 4.3 0 0 1-4.05-2.82c-.27.062-.54.076-.825.076c-2.204 0-4.005-1.8-4.005-4.05c0-1.5.811-2.805 2.01-3.51c-.255-.57-.39-1.2-.39-1.846c0-2.58 2.1-4.65 4.65-4.65c1.53 0 2.85.705 3.72 1.8"
    },
    {
        id: "hubspot",
        name: "HubSpot",
        color: "#ff7a59",
        svgPath: (
            <>
                <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
                <line x1="12" y1="9" x2="12" y2="4" stroke="currentColor" strokeWidth="2" />
                <line x1="12" y1="20" x2="12" y2="15" stroke="currentColor" strokeWidth="2" />
                <line x1="9" y1="12" x2="4" y2="12" stroke="currentColor" strokeWidth="2" />
                <line x1="20" y1="12" x2="15" y2="12" stroke="currentColor" strokeWidth="2" />
                <line x1="10.82" y1="8.82" x2="6.5" y2="4.5" stroke="currentColor" strokeWidth="2" />
                <line x1="17.5" y1="19.5" x2="13.18" y2="15.18" stroke="currentColor" strokeWidth="2" />
                <line x1="10.82" y1="15.18" x2="6.5" y2="19.5" stroke="currentColor" strokeWidth="2" />
                <line x1="17.5" y1="4.5" x2="13.18" y2="8.82" stroke="currentColor" strokeWidth="2" />
            </>
        )
    },
    {
        id: "gohighlevel",
        name: "GoHighLevel",
        color: "#0550B3",
        svgPath: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
    },
    {
        id: "stripe",
        name: "Stripe",
        color: "#635bff",
        svgPath: "M12.001 8c-2.3 0-3.9 1.4-3.9 3.4 0 2.2 2.1 2.8 4 3 1.5.2 2.3.8 2.3 1.6 0 1.1-1.2 1.9-2.8 1.9-1.5 0-2.8-.8-3.3-1.8l-3.3.6C5.9 19.3 8.8 21 11.9 21c3.1 0 5.4-1.6 5.4-4 0-2.5-2.2-3.1-4-3.2-1.4-.2-2.3-.6-2.3-1.5 0-.9 1-1.6 2.3-1.6 1.3 0 2.4.6 2.9 1.4l3.1-.9C18.6 9 15.6 8 12.001 8z"
    },
    {
        id: "twilio",
        name: "Twilio",
        color: "#F22F46",
        svgPath: "M12 0C5.381-.008.008 5.352 0 11.971V12c0 6.64 5.359 12 12 12c6.64 0 12-5.36 12-12c0-6.641-5.36-12-12-12m0 20.801c-4.846.015-8.786-3.904-8.801-8.75V12a8.777 8.777 0 0 1 8.75-8.801H12a8.776 8.776 0 0 1 8.801 8.75V12c.015 4.847-3.904 8.786-8.75 8.801zm5.44-11.76a2.49 2.49 0 0 1-2.481 2.479a2.49 2.49 0 0 1-2.479-2.479a2.49 2.49 0 0 1 2.479-2.481a2.493 2.493 0 0 1 2.481 2.481m0 5.919c0 1.36-1.12 2.48-2.481 2.48a2.49 2.49 0 0 1-2.479-2.48a2.49 2.49 0 0 1 2.479-2.479a2.49 2.49 0 0 1 2.481 2.479m-5.919 0c0 1.36-1.12 2.48-2.479 2.48a2.49 2.49 0 0 1-2.481-2.48a2.49 2.49 0 0 1 2.481-2.479a2.49 2.49 0 0 1 2.479 2.479m0-5.919a2.49 2.49 0 0 1-2.479 2.479a2.49 2.49 0 0 1-2.481-2.479A2.493 2.493 0 0 1 9.042 6.56a2.493 2.493 0 0 1 2.479 2.481"
    },
    {
        id: "zendesk",
        name: "Zendesk",
        color: "#03363D",
        svgPath: "M10.19 13.91l4.4-4.8c-1.42 1.64-5.32 6.13-5.32 6.13l.92.83zm3.74-.75h.01c-.01.01-1.87-2.16-1.87-2.16l2.36-2.58a17.25 17.25 0 00-3.38-2.61L8.53 8.35v1.23l1.83.6c.06.01.12.08.13.14-.14 1.32-.27 2.64-.42 3.96l.89.8z"
    },
    {
        id: "intercom",
        name: "Intercom",
        color: "#188FFF",
        svgPath: (
            <>
                <rect x="5.17" y="5.17" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -4.9706 12)" width="13.66" height="13.66" rx="2.5" />
                <rect x="8.59" y="8.59" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -4.9706 12)" width="6.83" height="6.83" rx="1" />
            </>
        )
    },
    {
        id: "notion",
        name: "Notion",
        color: "#000000",
        svgPath: "M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"
    },
    {
        id: "slack",
        name: "Slack",
        color: "#4A154B",
        svgPath: "M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"
    },
    {
        id: "openai",
        name: "OpenAI",
        color: "#000000",
        svgPath: "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"
    },
    {
        id: "whatsapp",
        name: "WhatsApp",
        color: "#25D366",
        svgPath: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
    },
    {
        id: "calendly",
        name: "Calendly",
        color: "#006BFF",
        svgPath: "M19.655 14.262c.281 0 .557.023.828.064 0 .005-.005.01-.005.014-.105.267-.234.534-.381.786l-1.219 2.106c-1.112 1.936-3.177 3.127-5.411 3.127h-2.432c-2.23 0-4.294-1.191-5.412-3.127l-1.218-2.106a6.251 6.251 0 0 1 0-6.252l1.218-2.106C6.736 4.832 8.8 3.641 11.035 3.641h2.432c2.23 0 4.294 1.191 5.411 3.127l1.219 2.106c.147.252.271.519.381.786 0 .004.005.009.005.014-.267.041-.543.064-.828.064-1.816 0-2.501-.607-3.291-1.306-.764-.676-1.711-1.517-3.44-1.517h-1.029c-1.251 0-2.387.455-3.2 1.278-.796.805-1.233 1.904-1.233 3.099v1.411c0 1.196.437 2.295 1.233 3.099.813.823 1.949 1.278 3.2 1.278h1.034c1.729 0 2.676-.841 3.439-1.517.791-.703 1.471-1.306 3.287-1.301Zm.005-3.237c.399 0 .794-.036 1.179-.11-.002-.004-.002-.01-.002-.014-.073-.414-.193-.823-.349-1.218.731-.12 1.407-.396 1.986-.819 0-.004-.005-.013-.005-.018-.331-1.085-.832-2.101-1.489-3.03-.649-.915-1.435-1.719-2.331-2.395-1.867-1.398-4.088-2.138-6.428-2.138-1.448 0-2.855.28-4.175.841-1.273.543-2.423 1.315-3.407 2.299S2.878 6.552 2.341 7.83c-.557 1.324-.842 2.726-.842 4.175 0 1.448.281 2.855.842 4.174.542 1.274 1.314 2.423 2.298 3.407s2.129 1.761 3.407 2.299c1.324.556 2.727.841 4.175.841 2.34 0 4.561-.74 6.428-2.137a10.815 10.815 0 0 0 2.331-2.396c.652-.929 1.158-1.949 1.489-3.03 0-.004.005-.014.005-.018-.579-.423-1.255-.699-1.986-.819.161-.395.276-.804.349-1.218.005-.009.005-.014.005-.023.869.166 1.692.506 2.404 1.035.685.505.552 1.075.446 1.416C22.184 20.437 17.619 24 12.221 24c-6.625 0-12-5.375-12-12s5.37-12 12-12c5.398 0 9.963 3.563 11.471 8.464.106.341.239.915-.446 1.421-.717.529-1.535.873-2.404 1.034.128.716.128 1.45 0 2.166-.387-.074-.782-.11-1.182-.11-4.184 0-3.968 2.823-6.736 2.823h-1.029c-1.899 0-3.15-1.357-3.15-3.095v-1.411c0-1.738 1.251-3.094 3.15-3.094h1.034c2.768 0 2.552 2.823 6.731 2.827Z"
    },
    {
        id: "zoom",
        name: "Zoom",
        color: "#2D8CFF",
        svgPath: "M5.033 14.649H.743a.74.74 0 0 1-.686-.458.74.74 0 0 1 .16-.808L3.19 10.41H1.06A1.06 1.06 0 0 1 0 9.35h3.957c.301 0 .57.18.686.458a.74.74 0 0 1-.161.808L1.51 13.59h2.464c.585 0 1.06.475 1.06 1.06zM24 11.338c0-1.14-.927-2.066-2.066-2.066-.61 0-1.158.265-1.537.686a2.061 2.061 0 0 0-1.536-.686c-1.14 0-2.066.926-2.066 2.066v3.311a1.06 1.06 0 0 0 1.06-1.06v-2.251a1.004 1.004 0 0 1 2.013 0v2.251c0 .586.474 1.06 1.06 1.06v-3.311a1.004 1.004 0 0 1 2.012 0v2.251c0 .586.475 1.06 1.06 1.06zM16.265 12a2.728 2.728 0 1 1-5.457 0 2.728 2.728 0 0 1 5.457 0zm-1.06 0a1.669 1.669 0 1 0-3.338 0 1.669 1.669 0 0 0 3.338 0zm-4.82 0a2.728 2.728 0 1 1-5.458 0 2.728 2.728 0 0 1 5.457 0zm-1.06 0a1.669 1.669 0 1 0-3.338 0 1.669 1.669 0 0 0 3.338 0z"
    },
    {
        id: "gmail",
        name: "Gmail",
        color: "#EA4335",
        svgPath: "M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"
    },
    {
        id: "linear",
        name: "Linear",
        color: "#5E6AD2",
        svgPath: "M2.886 4.18A11.982 11.982 0 0 1 11.99 0C18.624 0 24 5.376 24 12.009c0 3.64-1.62 6.903-4.18 9.105L2.887 4.18ZM1.817 5.626l16.556 16.556c-.524.33-1.075.62-1.65.866L.951 7.277c.247-.575.537-1.126.866-1.65ZM.322 9.163l14.515 14.515c-.71.172-1.443.282-2.195.322L0 11.358a12 12 0 0 1 .322-2.195Zm-.17 4.862 9.823 9.824a12.02 12.02 0 0 1-9.824-9.824Z"
    },
    {
        id: "x",
        name: "X",
        color: "#000000",
        svgPath: "M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z"
    }
]

export function LogoMountain() {
    const containerRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const engineRef = useRef<Matter.Engine | null>(null)
    const renderRef = useRef<Matter.Render | null>(null)
    const runnerRef = useRef<Matter.Runner | null>(null)

    const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 })

    // Initialize physics engine
    useEffect(() => {
        if (!containerRef.current || !canvasRef.current) return

        const container = containerRef.current
        const canvas = canvasRef.current

        // Setup dimensions
        const width = container.clientWidth
        const height = Math.max(400, container.clientHeight)

        // Setup Matter.js Engine
        const engine = Matter.Engine.create({
            enableSleeping: true // Better performance
        })
        engineRef.current = engine
        const world = engine.world

        // Setup Matter.js Render
        const render = Matter.Render.create({
            canvas: canvas,
            engine: engine,
            options: {
                width,
                height,
                background: "transparent",
                wireframes: false,
                pixelRatio: typeof window !== "undefined" ? window.devicePixelRatio : 1
            }
        })
        renderRef.current = render

        // Create boundaries
        const wallOptions = {
            isStatic: true,
            render: { fillStyle: "transparent" },
            friction: 0.8
        }

        // Bottom, left, right walls to contain the mountain
        const ground = Matter.Bodies.rectangle(width / 2, height + 50, width * 2, 100, wallOptions)
        const leftWall = Matter.Bodies.rectangle(-50, height / 2, 100, height * 2, wallOptions)
        const rightWall = Matter.Bodies.rectangle(width + 50, height / 2, 100, height * 2, wallOptions)

        Matter.World.add(world, [ground, leftWall, rightWall])

        // Create Text Pills (The Mountain)
        // Since we have 16 distinct integrations, we don't repeat them anymore per user request.
        const multipleLogos = [...logos].sort(() => Math.random() - 0.5)

        const bodies = multipleLogos.map((logo, index) => {
            // Generate a random radius between 40 and 70 to make them different sizes 
            // (slightly smaller range on mobile)
            const minRadius = width < 768 ? 35 : 45
            const maxRadius = width < 768 ? 60 : 75
            const radius = Math.floor(Math.random() * (maxRadius - minRadius + 1)) + minRadius

            // Store the radius on the logo object so React knows how big to render the DOM node
            logo.radius = radius

            // Stagger initial dropped positions
            const x = width / 2 + (Math.random() * 200 - 100)
            const y = -100 - (index * 80) // drop them sequentially

            return Matter.Bodies.circle(x, y, radius, {
                restitution: 0.6, // Bounciness
                friction: 0.5,
                density: 0.04,
                plugin: {
                    logo: logo // Custom data payload for React rendering
                },
                render: {
                    fillStyle: "transparent", // Handled by React
                    strokeStyle: "transparent",
                    lineWidth: 0
                }
            })
        })

        Matter.World.add(world, bodies)

        // Add Mouse Interaction
        const mouse = Matter.Mouse.create(render.canvas)
        const mouseConstraint = Matter.MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        })

        Matter.World.add(world, mouseConstraint)

        // Keep internal mouse synced with react if needed
        render.mouse = mouse

        // Run Engine
        Matter.Render.run(render)

        const runner = Matter.Runner.create()
        runnerRef.current = runner
        Matter.Runner.run(runner, engine)

        // Handle Resize
        const handleResize = () => {
            if (!containerRef.current) return

            const newWidth = containerRef.current.clientWidth
            const newHeight = Math.max(400, containerRef.current.clientHeight)

            render.canvas.width = newWidth
            render.canvas.height = newHeight
            render.options.width = newWidth
            render.options.height = newHeight

            // Update ground position
            Matter.Body.setPosition(ground, { x: newWidth / 2, y: newHeight + 50 })
            Matter.Body.setPosition(rightWall, { x: newWidth + 50, y: newHeight / 2 })
        }

        window.addEventListener("resize", handleResize)

        // Cleanup
        return () => {
            window.removeEventListener("resize", handleResize)
            Matter.Render.stop(render)
            Matter.Runner.stop(runner)

            if (engineRef.current) {
                Matter.World.clear(engineRef.current.world, false)
                Matter.Engine.clear(engineRef.current)
            }

            render.canvas.remove()
        }
    }, [])

    // Sync React state with Matter.js bodies on every animation frame
    const [DOMBodies, setDOMBodies] = useState<Matter.Body[]>([])

    useEffect(() => {
        let frameId: number

        const tick = () => {
            if (engineRef.current) {
                // Filter out static bodies (walls) and get only our logo circles
                const dynamicBodies = engineRef.current.world.bodies.filter(b => !b.isStatic)
                setDOMBodies([...dynamicBodies])
            }
            frameId = requestAnimationFrame(tick)
        }

        frameId = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(frameId)
    }, [])

    return (
        <div
            className="py-16 bg-white flex flex-col items-center rounded-[64px] m-4 md:m-10 border border-agency-border-light shadow-[0_16px_48px_rgba(0,0,0,0.04)] relative z-10"
        >
            <div className="text-[0.9rem] uppercase tracking-[0.15em] text-agency-text-muted mb-4 font-semibold text-center font-inter relative z-20">
                Native Integrations
            </div>

            {/* Container for physics */}
            <div
                ref={containerRef}
                className="w-full h-[500px] relative cursor-pointer overflow-visible"
                onMouseMove={(e) => {
                    if (!containerRef.current) return
                    const rect = containerRef.current.getBoundingClientRect()
                    setMousePosition({
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top
                    })
                }}
            >
                {/* The hidden canvas that powers the matter-js collisions + mouse constraint */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 z-10 w-full h-full opacity-0"
                />

                {/* CSS/React Rendered Bodies mapped correctly to physics engine state */}
                {DOMBodies.map((body) => {
                    const logo = body.plugin.logo as Logo & { radius: number }
                    if (!logo) return null

                    const { x, y } = body.position
                    const angle = body.angle
                    const radius = Number(body.circleRadius)

                    return (
                        <div
                            key={body.id}
                            className="absolute flex items-center justify-center rounded-full will-change-transform cursor-grab active:cursor-grabbing transition-colors font-outfit"
                            style={{
                                width: radius * 2,
                                height: radius * 2,
                                // Apply Matter.js transforms onto DOM elements
                                transform: `translate(${x - radius}px, ${y - radius}px) rotate(${angle}rad)`,
                                color: logo.color
                            }}
                        >
                            <IntegrationParticles activeColor={logo.color} radius={radius} />
                            <span
                                className="font-bold select-none relative z-20 drop-shadow-sm"
                                style={{
                                    // Scale font size proportionally to the random radius
                                    fontSize: `${radius * 0.35}px`,
                                    padding: '0 8px',
                                    textAlign: 'center',
                                    lineHeight: 1.1
                                }}
                            >
                                {logo.name}
                            </span>
                        </div>
                    )
                })}

                {/* Subtle interactive explosion effect on mouse hover if desired */}
                <div
                    className="w-32 h-32 rounded-full absolute pointer-events-none opacity-0 transition-opacity bg-gradient-to-tr from-transparent to-blue-500/10 blur-xl"
                    style={{
                        transform: `translate(${mousePosition.x - 64}px, ${mousePosition.y - 64}px)`,
                        opacity: mousePosition.x > 0 ? 0.8 : 0
                    }}
                />
            </div>
        </div>
    )
}
