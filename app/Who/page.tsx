"use client";

import { useState } from 'react';
import Footer from "@/components/footer/footer";
import NavBar from "@/components/navbar/navbar";

export default function Who() {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 3;

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#0a0a0f] overflow-x-hidden">
            <NavBar font="sans" color="#ffffff" />

            <div className="flex-1 flex">
                {/* Vertical Text Sidebar - Hidden on mobile */}
                <div className="hidden lg:flex w-28 bg-gradient-to-b from-[#1a1a2e] to-[#0a0a0f] items-center justify-center relative border-r border-white/5">
                    {/* Subtle space dots background */}
                    <div className="absolute inset-0 opacity-20" style={{
                        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                        backgroundSize: '30px 30px'
                    }}></div>

                    <div className="flex flex-col items-center justify-center gap-10 text-3xl font-light text-white tracking-[0.4em] select-none relative z-10">
                        <span className="transition-all duration-300 hover:text-white hover:tracking-[0.5em]">T</span>
                        <span className="transition-all duration-300 hover:text-white hover:tracking-[0.5em]">R</span>
                        <span className="border-b-2 border-white/80 pl-[5px] transition-all duration-300 hover:text-white hover:tracking-[0.5em]">A</span>
                        <span className="transition-all duration-300 hover:text-white hover:tracking-[0.5em]">C</span>
                        <span className="transition-all duration-300 hover:text-white hover:tracking-[0.5em]">Y</span>

                        <div className="h-8 w-px bg-gradient-to-b from-white/40 via-white/20 to-transparent"></div>

                        <span className="transition-all duration-300 hover:text-white hover:tracking-[0.5em]">P</span>
                        <span className="transition-all duration-300 hover:text-white hover:tracking-[0.5em]">E</span>
                        <span className="transition-all duration-300 hover:text-white hover:tracking-[0.5em]">N</span>
                        <span className="transition-all duration-300 hover:text-white hover:tracking-[0.5em]">D</span>
                        <span className="transition-all duration-300 hover:text-white hover:tracking-[0.5em]">L</span>
                        <span className="transition-all duration-300 hover:text-white hover:tracking-[0.5em]">E</span>
                        <span className="transition-all duration-300 hover:text-white hover:tracking-[0.5em]">T</span>
                        <span className="transition-all duration-300 hover:text-white hover:tracking-[0.5em]">O</span>
                        <span className="transition-all duration-300 hover:text-white hover:tracking-[0.5em]">N</span>

                        <div className="h-8 w-px bg-gradient-to-b from-white/40 via-white/20 to-transparent"></div>

                        <span className="transition-all duration-300 hover:text-white hover:tracking-[0.5em]">I</span>
                        <span className="transition-all duration-300 hover:text-white hover:tracking-[0.5em]">I</span>
                        <span className="transition-all duration-300 hover:text-white hover:tracking-[0.5em]">I</span>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col py-8 lg:py-16 px-4 lg:px-20">
                    {/* Mobile Title - Only visible on mobile */}
                    <div className="lg:hidden text-center mb-6">
                        <h1 className="text-2xl font-light text-white tracking-[0.3em]">
                            TRACY PENDLETON III
                        </h1>
                    </div>

                    {/* Large PDF View with Navigation on Top */}
                    <div className="w-full max-w-6xl mx-auto mb-8 lg:mb-12">
                        {/* Navigation Controls - Now on top */}
                        <div className="flex items-center justify-center gap-4 lg:gap-8 mb-6">
                            {/* Previous Arrow */}
                            <button
                                onClick={prevPage}
                                disabled={currentPage === 1}
                                className="w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center text-white/70 hover:text-white disabled:text-white/10 disabled:cursor-not-allowed transition-all duration-300 text-xl lg:text-2xl font-extralight"
                                aria-label="Previous page"
                            >
                                ←
                            </button>

                            {/* Page Indicator */}
                            <div className="text-white/60 text-sm lg:text-base font-light tracking-widest">
                                {currentPage} / {totalPages}
                            </div>

                            {/* Thumbnail Row - Hidden on small mobile */}
                            <div className="hidden sm:flex gap-3 lg:gap-5">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`relative transition-all duration-300 ${currentPage === page
                                            ? 'scale-105'
                                            : 'opacity-40 hover:opacity-70'
                                            }`}
                                        aria-label={`Go to page ${page}`}
                                    >
                                        {/* Thumbnail container */}
                                        <div className="w-12 h-16 lg:w-20 lg:h-24 bg-[#13131a] rounded-sm overflow-hidden border border-white/10 relative">
                                            <iframe
                                                src={`/Media/sample-local-pdf.pdf#page=${page}&toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                                                className="w-[400%] h-[400%] border-0 pointer-events-none scale-[0.25] origin-top-left bg-white"
                                                title={`Page ${page} thumbnail`}
                                            />
                                        </div>

                                        {/* Active indicator line */}
                                        {currentPage === page && (
                                            <div className="absolute -bottom-2 left-0 right-0 h-px bg-white"></div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Next Arrow */}
                            <button
                                onClick={nextPage}
                                disabled={currentPage === totalPages}
                                className="w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center text-white/70 hover:text-white disabled:text-white/10 disabled:cursor-not-allowed transition-all duration-300 text-xl lg:text-2xl font-extralight"
                                aria-label="Next page"
                            >
                                →
                            </button>
                        </div>

                        {/* PDF Viewer */}
                        <div className="w-full bg-[#13131a] rounded-sm overflow-hidden relative group border border-white/10 shadow-2xl shadow-black/50" style={{ aspectRatio: '8.5/11' }}>
                            <iframe
                                key={`main-${currentPage}`}
                                src={`/Media/sample-local-pdf.pdf#page=${currentPage}&toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                                className="w-full h-full border-0 bg-white"
                                style={{ overflow: 'hidden' }}

                                scrolling="no"
                                title="Portfolio"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}