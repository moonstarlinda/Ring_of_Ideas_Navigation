import React, { useEffect, useRef } from 'react';

const ParticleBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const particles: Array<{
            x: number;
            y: number;
            radius: number;
            angle: number;
            speed: number;
            distance: number;
            color: string;
            alpha: number;
        }> = [];

        // Match the vertical offset in RingNavigation (translate-y-12 for mobile, translate-y-16 for desktop)
        // 12 * 4px = 48px, 16 * 4px = 64px
        const getVerticalOffset = () => width < 768 ? 48 : 64;

        const createParticle = () => {
            const yOffset = getVerticalOffset();
            // Create particles that orbit the center
            const distance = Math.random() * (Math.min(width, height) / 1.5) + 50;
            return {
                x: width / 2,
                y: (height / 2) + yOffset,
                radius: Math.random() * 1.5,
                angle: Math.random() * Math.PI * 2,
                speed: (Math.random() * 0.002) + 0.0005, // Slower, more elegant
                distance: distance,
                color: Math.random() > 0.5 ? '#8b5cf6' : '#3b82f6', // Purple and Blue
                alpha: Math.random() * 0.4 + 0.05
            };
        };

        // Initialize particles
        for (let i = 0; i < 100; i++) {
            particles.push(createParticle());
        }

        const animate = () => {
            // Clear with a trail effect
            ctx.fillStyle = 'rgba(10, 10, 20, 0.1)'; // Dark blue/purple tint
            ctx.fillRect(0, 0, width, height);

            const cx = width / 2;
            const cy = (height / 2) + getVerticalOffset(); // Apply Offset to center

            particles.forEach(p => {
                p.angle += p.speed;
                p.x = cx + Math.cos(p.angle) * p.distance;
                p.y = cy + Math.sin(p.angle) * p.distance;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha;
                ctx.fill();
                ctx.globalAlpha = 1.0;
            });

            requestAnimationFrame(animate);
        };

        const animationId = requestAnimationFrame(animate);

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
        />
    );
};

export default ParticleBackground;