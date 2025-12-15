import React, { useState, useEffect, useCallback } from 'react';
import { motion, PanInfo, AnimatePresence } from 'framer-motion';
import { PROJECTS } from '../constants';
import * as Icons from 'lucide-react';

const RingNavigation: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [rotation, setRotation] = useState(0);
    
    // Responsive state
    const [isMobile, setIsMobile] = useState(false);
    const [radius, setRadius] = useState(200); // Default desktop radius

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            // Reduce radius to ensure spacing from top header and bottom controls
            // Mobile: 120px, Desktop: 200px
            setRadius(mobile ? 120 : 200);
        };
        
        // Initial check
        handleResize();
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const totalItems = PROJECTS.length;
    const anglePerItem = 360 / totalItems;

    // Calculate rotation to keep active item at the top (-90 degrees)
    useEffect(() => {
        const targetRotation = -90 - (activeIndex * anglePerItem);
        setRotation(targetRotation);
    }, [activeIndex, anglePerItem]);

    const nextItem = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % totalItems);
    }, [totalItems]);

    const prevItem = useCallback(() => {
        setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
    }, [totalItems]);

    // Handle Scroll to Rotate
    useEffect(() => {
        let lastScrollTime = 0;
        const handleWheel = (e: WheelEvent) => {
            const now = Date.now();
            if (now - lastScrollTime > 500) { // Debounce scroll
                if (e.deltaY > 0) {
                    nextItem();
                } else {
                    prevItem();
                }
                lastScrollTime = now;
            }
        };

        window.addEventListener('wheel', handleWheel);
        return () => window.removeEventListener('wheel', handleWheel);
    }, [nextItem, prevItem]);

    // Handle Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') nextItem();
            if (e.key === 'ArrowLeft') prevItem();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextItem, prevItem]);

    // Handle Swipe / Drag Gestures
    const onPanEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const threshold = 50;
        if (info.offset.x < -threshold) {
            nextItem();
        } else if (info.offset.x > threshold) {
            prevItem();
        }
    };

    const resetNavigation = () => {
        setActiveIndex(0);
    };

    const handleItemClick = (index: number) => {
        setActiveIndex(index);
    };

    return (
        <motion.div 
            className="relative w-full h-screen flex flex-col items-center justify-center z-10 overflow-hidden"
            // Add pan gesture handler
            onPanEnd={onPanEnd}
        >
            
            {/* 
                Main visual container shifted down to avoid header overlap 
                translate-y-12 (3rem, 48px) on mobile, translate-y-16 (4rem, 64px) on desktop
                This offset MUST match the ParticleBackground offset calculation.
            */}
            <div className="relative flex items-center justify-center translate-y-12 md:translate-y-16 transition-transform duration-500">

                {/* Central Glowing Ring Background */}
                <div className="absolute pointer-events-none flex items-center justify-center">
                    {/* Outer soft glow - scaled relative to radius */}
                    <div 
                        className="rounded-full bg-purple-900/10 blur-3xl absolute transition-all duration-500"
                        style={{ width: radius * 3, height: radius * 3 }}
                    ></div>
                    
                    {/* Main Ring Track - Matches radius diameter */}
                    <div 
                        className="rounded-full border border-white/5 shadow-[0_0_40px_rgba(139,92,246,0.1)] relative transition-all duration-500"
                        style={{ width: radius * 2, height: radius * 2 }}
                    >
                        {/* Inner faint ring */}
                        <div 
                            className="absolute inset-0 m-auto rounded-full border border-white/5"
                            style={{ width: radius * 1.4, height: radius * 1.4 }}
                        ></div>
                        
                        {/* Center light refraction */}
                        <div className="absolute inset-0 m-auto w-[100px] h-[100px] bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-xl"></div>
                    </div>
                </div>

                {/* Rotating Container */}
                <motion.div 
                    className="absolute w-0 h-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
                    animate={{ rotate: rotation }}
                    transition={{ type: "spring", stiffness: 40, damping: 18, mass: 1 }}
                >
                    {PROJECTS.map((project, index) => {
                        const angleDeg = index * anglePerItem;
                        const isActive = index === activeIndex;
                        
                        // Dynamic sizing classes based on mobile state
                        const activeSize = isMobile ? 'w-28 h-28' : 'w-40 h-40';
                        const inactiveSize = isMobile ? 'w-20 h-20' : 'w-32 h-32';
                        const currentSize = isActive ? activeSize : inactiveSize;

                        const fontSizeTitle = isMobile ? (isActive ? 'text-sm' : 'text-[10px]') : (isActive ? 'text-lg' : 'text-sm');
                        const fontSizeSub = isMobile ? 'text-[8px]' : 'text-[10px]';
                        const fontSizeNumber = isMobile ? 'text-[30px]' : 'text-[60px]';

                        return (
                            <div
                                key={project.id}
                                className="absolute flex items-center justify-center"
                                style={{
                                    transform: `rotate(${angleDeg}deg) translate(${radius}px) rotate(-${angleDeg}deg)`, 
                                }}
                            >
                                <motion.div 
                                    onClick={() => handleItemClick(index)}
                                    className={`
                                        relative flex flex-col items-center justify-center text-center rounded-full
                                        cursor-pointer backdrop-blur-sm transition-all duration-500 border
                                        ${currentSize}
                                        ${isActive 
                                            ? 'bg-white/5 border-purple-400/30 shadow-[0_0_30px_rgba(139,92,246,0.2)] z-20' 
                                            : 'bg-black/20 border-white/10 hover:bg-white/5 hover:border-white/20 z-10'
                                        }
                                    `}
                                    animate={{ 
                                        rotate: -rotation,
                                        // Floating animation for "alive" feel
                                        y: isActive ? [0, -8, 0] : [0, -4, 0],
                                    }} 
                                    transition={{ 
                                        rotate: { type: "spring", stiffness: 40, damping: 18, mass: 1 },
                                        y: {
                                            repeat: Infinity,
                                            duration: isActive ? 4 : 5,
                                            ease: "easeInOut",
                                            delay: index * 0.2 // Staggered float
                                        }
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    {/* Number background - subtle */}
                                    <span className={`absolute ${fontSizeNumber} font-bold opacity-5 pointer-events-none select-none ${isActive ? 'text-purple-400' : 'text-white'}`}>
                                        0{project.id}
                                    </span>

                                    {/* Content */}
                                    <div className="z-10 flex flex-col items-center gap-1 px-2">
                                        <h3 className={`font-display font-bold tracking-wider leading-tight uppercase transition-colors duration-300 ${fontSizeTitle} ${isActive ? 'text-white' : 'text-white/60'}`}>
                                            {project.title}
                                        </h3>
                                        <span className={`${fontSizeSub} uppercase tracking-widest font-medium ${isActive ? 'text-purple-300' : 'text-white/30'}`}>
                                            {project.subtitle}
                                        </span>
                                    </div>

                                    {/* Active Indicator Glow Ring */}
                                    {isActive && (
                                        <motion.div 
                                            layoutId="outline"
                                            className="absolute inset-0 rounded-full border border-purple-500/50"
                                            transition={{ duration: 0.3 }}
                                        />
                                    )}
                                </motion.div>
                            </div>
                        );
                    })}
                </motion.div>
            </div>
            
            {/* Description Text (Active Project) */}
            <div className="absolute bottom-24 md:bottom-32 w-full px-8 flex justify-center pointer-events-none">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={activeIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="text-center text-white/50 text-xs md:text-sm tracking-wider font-light max-w-md"
                    >
                        {PROJECTS[activeIndex].description}
                    </motion.p>
                </AnimatePresence>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-8 md:bottom-12 flex items-center gap-4 md:gap-6 z-30">
                 <button 
                    onClick={prevItem}
                    className="w-12 h-12 flex items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all text-white/70 hover:text-white backdrop-blur-sm"
                    aria-label="Previous"
                 >
                    <Icons.ArrowLeft size={20} />
                 </button>
                 
                 <button 
                    onClick={nextItem}
                    className="w-12 h-12 flex items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all text-white/70 hover:text-white backdrop-blur-sm"
                    aria-label="Next"
                 >
                    <Icons.ArrowRight size={20} />
                 </button>

                 <button 
                    onClick={resetNavigation}
                    className="px-6 h-12 flex items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all text-sm text-white/70 hover:text-white uppercase tracking-wider backdrop-blur-sm"
                 >
                    Reset
                 </button>
            </div>
        </motion.div>
    );
};

export default RingNavigation;