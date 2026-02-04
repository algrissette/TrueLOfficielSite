"use client";

import { CiHeart, CiLogin, CiLogout, CiShoppingCart, CiUser } from "react-icons/ci";
import { useState, useEffect } from "react";
import { api } from "@/app/util/apicCall";
import { CartLine } from "@/app/util/datatypes";
import { redirect, useRouter } from "next/navigation";

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
    const [cartCount, setCartCount] = useState<number>(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const router = useRouter();

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

        // Check authentication status
        checkAuthStatus();

        // Fetch cart count
        fetchCartCount();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const response = await api.post("/protected/check", {});
            console.log("Auth check:", response);

            if (response.data.authenticated) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            setIsAuthenticated(false);
        } finally {
            setAuthLoading(false);
        }
    };

    const fetchCartCount = async () => {
        const cartID = sessionStorage.getItem("cartID");

        if (!cartID) {
            setCartCount(0);
            return;
        }

        try {
            const response = await api.post("/cart/getAllCartItems", {
                cartId: cartID,
            });

            if (response.data && Array.isArray(response.data)) {
                const items: CartLine[] = response.data;
                // Calculate total quantity of all items
                const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
                setCartCount(totalCount);
            }
        } catch (error) {
            console.log("Error fetching cart:", error);
            setCartCount(0);
        }
    };

    const handleLogout = async () => {
        try {
            await api.post("/protected/logout");
            setIsAuthenticated(false);

            // Clear any local storage/session storage if needed
            sessionStorage.removeItem("cartID");

            // Close mobile menu if open
            setMobileMenuOpen(false);

            // Redirect to home
            redirect("/Home");

            // Optional: reload to clear all state
            window.location.reload();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const handleLogin = () => {
        setMobileMenuOpen(false);
        redirect("/Authentication/Login");
    };

    // Close mobile menu when resizing to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const navItems = [
        { label: "WHAT", href: "/What" },
        { label: "WHO", href: "/Who" },
        { label: "WHY", href: "/Why" },
    ];

    const iconLinks = [
        { icon: CiShoppingCart, href: "/Cart", label: "Cart" },
        { icon: CiUser, href: "/profile", label: "Profile" },
        { icon: CiHeart, href: "/wishlist", label: "Wishlist" },
    ];

    return (
        <>
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

                <div className="relative w-full px-4 md:px-8 lg:px-12">
                    <div className="flex justify-between items-center">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden relative z-10 p-2 text-white"
                            aria-label="Toggle menu"
                        >
                            <div className="w-6 h-5 flex flex-col justify-between">
                                <span
                                    className={`block h-0.5 w-full bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                                        }`}
                                />
                                <span
                                    className={`block h-0.5 w-full bg-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''
                                        }`}
                                />
                                <span
                                    className={`block h-0.5 w-full bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                                        }`}
                                />
                            </div>
                        </button>

                        {/* Left: Navigation Links - Desktop Only */}
                        <ul className="hidden lg:flex gap-8" style={{ fontFamily: "GFS-Dot" }}>
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
                            href="/Home"
                            className="absolute left-1/2 -translate-x-1/2 font-edwardian text-2xl md:text-3xl text-white hover:text-[#FFE735] transition-all duration-500 group"
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

                        {/* Right: Icon Links with cosmic effects */}
                        <div className="flex items-center gap-2 md:gap-4">
                            {iconLinks.map((item, idx) => {
                                const Icon = item.icon;
                                const colors = ['#4C9AFF', '#FF3333', '#FFE735'];
                                const iconColor = colors[idx % colors.length];

                                return (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        className="relative group p-2 md:p-3 rounded-full transition-all duration-300"
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

                                        {/* Sparkle particles on hover - Desktop only */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 hidden md:block">
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
                                            className="relative md:w-[26px] md:h-[26px] z-10 text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                                            style={{
                                                filter: hoveredItem === item.label ? `drop-shadow(0 0 8px ${iconColor})` : '',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.color = iconColor;
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.color = 'white';
                                            }}
                                            size={22}

                                        />

                                        {/* Tooltip with star - Desktop only */}
                                        <div className="hidden md:block absolute -bottom-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                                            <div className="relative px-3 py-1 bg-black/90 backdrop-blur-sm text-white text-xs rounded-lg whitespace-nowrap border border-white/10">
                                                {item.label}
                                                {/* Tooltip arrow */}
                                                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/90 border-l border-t border-white/10 rotate-45"></div>
                                            </div>
                                        </div>

                                        {/* Notification badge with pulse - Only show if cart has items */}
                                        {item.label === "Cart" && cartCount > 0 && (
                                            <div className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-[#FF3333] rounded-full flex items-center justify-center text-white text-[10px] md:text-xs font-bold border-2 border-black animate-pulse">
                                                {cartCount > 9 ? '9+' : cartCount}
                                            </div>
                                        )}
                                    </a>
                                );
                            })}

                            {/* Login/Logout Button */}
                            {!authLoading && (
                                isAuthenticated ? (
                                    <button
                                        onClick={handleLogout}
                                        className="relative group p-2 md:p-3 rounded-full transition-all duration-300"
                                        aria-label="Logout"
                                        onMouseEnter={() => setHoveredItem("Logout")}
                                        onMouseLeave={() => setHoveredItem(null)}
                                    >
                                        {/* Pulsing ring on hover */}
                                        <div className="absolute inset-0 rounded-full border-2 border-white/20 scale-100 group-hover:scale-150 opacity-100 group-hover:opacity-0 transition-all duration-700"></div>

                                        {/* Glowing orb background - RED for logout */}
                                        <div
                                            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"
                                            style={{ backgroundColor: '#FF333360' }}
                                        ></div>

                                        {/* Sparkle particles on hover - Desktop only */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 hidden md:block">
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

                                        {/* Logout Icon */}
                                        <CiLogout
                                            className="relative md:w-[26px] md:h-[26px] z-10 text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                                            style={{
                                                filter: hoveredItem === "Logout" ? 'drop-shadow(0 0 8px #FF3333)' : '',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.color = '#FF3333';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.color = 'white';
                                            }}
                                            size={22}
                                        />

                                        {/* Tooltip */}
                                        <div className="hidden md:block absolute -bottom-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                                            <div className="relative px-3 py-1 bg-black/90 backdrop-blur-sm text-white text-xs rounded-lg whitespace-nowrap border border-white/10">
                                                Logout
                                                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/90 border-l border-t border-white/10 rotate-45"></div>
                                            </div>
                                        </div>
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleLogin}
                                        className="relative group p-2 md:p-3 rounded-full transition-all duration-300"
                                        aria-label="Login"
                                        onMouseEnter={() => setHoveredItem("Login")}
                                        onMouseLeave={() => setHoveredItem(null)}
                                    >
                                        {/* Pulsing ring on hover */}
                                        <div className="absolute inset-0 rounded-full border-2 border-white/20 scale-100 group-hover:scale-150 opacity-100 group-hover:opacity-0 transition-all duration-700"></div>

                                        {/* Glowing orb background - PURPLE for login */}
                                        <div
                                            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"
                                            style={{ backgroundColor: '#F594FE60' }}
                                        ></div>

                                        {/* Sparkle particles on hover - Desktop only */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 hidden md:block">
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

                                        {/* Login Icon */}
                                        <CiLogin
                                            className="relative md:w-[26px] md:h-[26px] z-10 text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                                            style={{
                                                filter: hoveredItem === "Login" ? 'drop-shadow(0 0 8px #F594FE)' : '',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.color = '#F594FE';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.color = 'white';
                                            }}
                                            size={22}
                                        />

                                        {/* Tooltip */}
                                        <div className="hidden md:block absolute -bottom-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                                            <div className="relative px-3 py-1 bg-black/90 backdrop-blur-sm text-white text-xs rounded-lg whitespace-nowrap border border-white/10">
                                                Login
                                                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/90 border-l border-t border-white/10 rotate-45"></div>
                                            </div>
                                        </div>
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom cosmic gradient line */}
                <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#4C9AFF] via-[#FF3333] via-[#FFE735] to-transparent opacity-50 animate-shimmer"></div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    onClick={() => setMobileMenuOpen(false)}
                />

                {/* Menu Content */}
                <div
                    className={`absolute top-[60px] left-0 right-0 bg-gradient-to-b from-slate-950 to-black border-b border-white/10 transition-transform duration-300 ${mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
                        }`}
                >
                    {/* Floating particles in mobile menu */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
                        {particles.slice(0, 20).map((particle) => (
                            <div
                                key={particle.id}
                                className="absolute rounded-full animate-float-particle"
                                style={{
                                    left: `${particle.x}%`,
                                    top: `${particle.y}%`,
                                    width: `${particle.size}px`,
                                    height: `${particle.size}px`,
                                    backgroundColor: 'white',
                                    opacity: Math.random() * 0.4 + 0.2,
                                    animationDelay: `${particle.delay}s`,
                                    boxShadow: `0 0 ${particle.size * 4}px rgba(255, 255, 255, 0.6)`,
                                }}
                            />
                        ))}
                    </div>

                    <nav className="relative p-8 space-y-6" style={{ fontFamily: font }}>
                        {navItems.map((item, idx) => {
                            const colors = ['#4C9AFF', '#FF3333', '#FFE735'];
                            const starColor = colors[idx % colors.length];

                            return (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className="block text-2xl font-bold tracking-widest text-white/90 hover:text-white transition-all duration-300 py-3 border-b border-white/5"
                                    onClick={() => setMobileMenuOpen(false)}
                                    style={{
                                        textShadow: `0 0 10px ${starColor}40`,
                                    }}
                                >
                                    {item.label}
                                </a>
                            );
                        })}

                        {/* Mobile Menu Footer with Icon Links */}
                        <div className="pt-6 mt-6 border-t border-white/10">
                            <div className="grid grid-cols-4 gap-4">
                                {iconLinks.map((item, idx) => {
                                    const Icon = item.icon;
                                    const colors = ['#4C9AFF', '#FF3333', '#FFE735'];
                                    const iconColor = colors[idx % colors.length];

                                    return (
                                        <a
                                            key={item.label}
                                            href={item.href}
                                            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 relative"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <Icon
                                                size={28}
                                                className="text-white"
                                                style={{ color: iconColor }}
                                            />
                                            <span className="text-xs text-white/70">{item.label}</span>

                                            {/* Cart count badge in mobile menu */}
                                            {item.label === "Cart" && cartCount > 0 && (
                                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF3333] rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                    {cartCount > 9 ? '9+' : cartCount}
                                                </div>
                                            )}
                                        </a>
                                    );
                                })}

                                {/* Mobile Login/Logout Button */}
                                {!authLoading && (
                                    isAuthenticated ? (
                                        <button
                                            onClick={handleLogout}
                                            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
                                        >
                                            <CiLogout
                                                size={28}
                                                className="text-white"
                                                style={{ color: '#FF3333' }}
                                            />
                                            <span className="text-xs text-white/70">Logout</span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleLogin}
                                            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
                                        >
                                            <CiLogin
                                                size={28}
                                                className="text-white"
                                                style={{ color: '#F594FE' }}
                                            />
                                            <span className="text-xs text-white/70">Login</span>
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </>
    );
}