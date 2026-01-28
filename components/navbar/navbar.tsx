"use client";

import { CiHeart, CiLogin, CiShoppingCart, CiUser } from "react-icons/ci";
import { useState, useEffect } from "react";

type navBarProps = {
    font: string;
    color: string;
};

type Particle = {
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    delay: number;
};

export default function NavBar({ font, color }: navBarProps) {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        // Generate floating particles for navbar - MORE and WHITE
        const newParticles: Particle[] = [];
        for (let i = 0; i < 60; i++) {
            newParticles.push({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 2 + 0.5,
                color: 'rgba(255, 255, 255, 0.8)',
                delay: Math.random() * 8,
            });
        }
        setParticles(newParticles);
    }, []);

    const navItems = [
        { label: "WHAT", href: "/What" },
        { label: "WHO", href: "/Who" },
        { label: "WHY", href: "/Why" },
    ];

    const iconLinks = [
        { icon: CiShoppingCart, href: "/cart", label: "Cart" },
        { icon: CiUser, href: "/profile", label: "Profile" },
        { icon: CiHeart, href: "/wishlist", label: "Wishlist" },
        { icon: CiLogin, href: "/Authentication/Login", label: "Login" },
    ];

    return (
        <nav className="sticky top-0 z-50 backdrop-blur-xl py-2 bg-black border-b border-white/10 shadow-2xl overflow-hidden">
            {/* Floating particles background - MORE GLOWY WHITE STARS */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {particles.map((particle) => (
                    <div
                        key={particle.id}
                        className="absolute rounded-full animate-float-particle"
                        style={{
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            backgroundColor: 'white',
                            opacity: Math.random() * 0.6 + 0.3,
                            animationDelay: `${particle.delay}s`,
                            boxShadow: `0 0 ${particle.size * 6}px rgba(255, 255, 255, 0.8), 0 0 ${particle.size * 3}px rgba(255, 255, 255, 0.6)`,
                        }}
                    />
                ))}
            </div>



            <div className="relative w-full px-12">
                <div className="flex justify-between items-center">
                    {/* Left: Navigation Links - FAR FROM CENTER */}
                    <ul className="flex gap-8" style={{ fontFamily: font }}>
                        {navItems.map((item, idx) => {
                            const colors = ['#4C9AFF', '#FF3333', '#FFE735'];
                            const starColor = colors[idx % colors.length];

                            return (
                                <li
                                    key={item.label}
                                    className="relative group"
                                    onMouseEnter={() => setHoveredItem(item.label)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                >
                                    <a
                                        href={item.href}
                                        className="relative block px-6 py-3 text-lg font-bold tracking-widest text-white/90 transition-all duration-500"
                                        style={{
                                            color: hoveredItem === item.label ? starColor : '',
                                            textShadow: hoveredItem === item.label
                                                ? `0 0 20px ${starColor}, 0 0 40px ${starColor}80, 0 0 60px ${starColor}40`
                                                : 'none',
                                        }}
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Center: Logo with stars */}
                    <a
                        href="/"
                        className="absolute left-1/2 -translate-x-1/2 font-edwardian text-3xl text-white hover:text-[#FFE735] transition-all duration-500 group"
                    >
                        <span className="relative inline-block">
                            Trucé
                            {/* Orbiting stars */}
                            <div className="absolute -top-2 -right-3 w-2 h-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <svg viewBox="0 0 24 24" className="animate-spin-slow" style={{ animationDuration: '4s' }}>
                                    <path d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10L12 2Z" fill="#FFE735" />
                                </svg>
                            </div>
                            <div className="absolute -bottom-2 -left-3 w-2 h-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ transitionDelay: '0.2s' }}>
                                <svg viewBox="0 0 24 24" className="animate-spin-slow" style={{ animationDuration: '5s' }}>
                                    <path d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10L12 2Z" fill="#4C9AFF" />
                                </svg>
                            </div>
                        </span>
                    </a>

                    {/* Right: Icon Links with cosmic effects - FAR FROM CENTER */}
                    <div className="flex items-center gap-4">
                        {iconLinks.map((item, idx) => {
                            const Icon = item.icon;
                            const colors = ['#4C9AFF', '#FF3333', '#FFE735', '#F594FE'];
                            const iconColor = colors[idx % colors.length];

                            return (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className="relative group p-3 rounded-full transition-all duration-300"
                                    aria-label={item.label}
                                    onMouseEnter={() => setHoveredItem(item.label)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                >
                                    {/* Pulsing ring on hover */}
                                    <div className="absolute inset-0 rounded-full border-2 border-white/20 scale-100 group-hover:scale-150 opacity-100 group-hover:opacity-0 transition-all duration-700"></div>

                                    {/* Glowing orb background */}
                                    <div
                                        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"
                                        style={{ backgroundColor: `${iconColor}60` }}
                                    ></div>

                                    {/* Sparkle particles on hover */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100">
                                        {[...Array(6)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="absolute w-1 h-1 bg-white rounded-full animate-sparkle-out"
                                                style={{
                                                    top: '50%',
                                                    left: '50%',
                                                    animationDelay: `${i * 0.1}s`,
                                                    '--angle': `${i * 60}deg`,
                                                } as React.CSSProperties}
                                            ></div>
                                        ))}
                                    </div>

                                    {/* Icon */}
                                    <Icon
                                        className="relative z-10 text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                                        style={{
                                            filter: hoveredItem === item.label ? `drop-shadow(0 0 8px ${iconColor})` : '',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = iconColor;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color = 'white';
                                        }}
                                        size={26}
                                    />

                                    {/* Tooltip with star */}
                                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                                        <div className="relative px-3 py-1 bg-black/90 backdrop-blur-sm text-white text-xs rounded-lg whitespace-nowrap border border-white/10">
                                            {item.label}
                                            {/* Tooltip arrow */}
                                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/90 border-l border-t border-white/10 rotate-45"></div>
                                        </div>
                                    </div>

                                    {/* Notification badge with pulse */}
                                    {item.label === "Cart" && (
                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF3333] rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-black animate-pulse">
                                            3
                                        </div>
                                    )}
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Bottom cosmic gradient line */}
            <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#4C9AFF] via-[#FF3333] via-[#FFE735] to-transparent opacity-50 animate-shimmer"></div>
            </div>
        </nav>
    );
}