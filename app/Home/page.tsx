"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NavBar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";

export default function Home() {
  const animationBar = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);

  const image1 = useRef<HTMLImageElement>(null);
  const image2 = useRef<HTMLImageElement>(null);
  const [isVisibile, setIsVisible] = useState(false);

  // fashionWords.ts
  const wordList: string[] = [
    "Muse",        // 0
    "Aura",        // 1
    "Form",        // 2
    "Flow",        // 3
    "Edge",        // 4
    "Line",        // 5
    "Shade",       // 6
    "Tone",        // 7
    "Drift",       // 8
    "Frame",       // 9
    "Spark",       // 10
    "Pulse",       // 11
    "Truc",        // 12 - middle word
    "Loom",        // 13
    "Wander",      // 14
    "Twist",       // 15
    "Mark",        // 16
    "Peace",       // 17
    "Impress",     // 18
    "Unisex",      // 19
    "Martyr",      // 20
    "Take",        // 21
    "Plan",        // 22
    "Alleviate",   // 23
    // 24
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // ---------------------------
    // 1. Bar animation + image clip
    // ---------------------------
    if (animationBar.current && image1.current && image2.current) {
      gsap.to(animationBar.current, {
        scrollTrigger: {
          trigger: ".imageContainer",
          start: "-100px",
          end: "+=1000px",
          scrub: true,
          pin: true,
          markers: false,
          toggleActions: "restart pause reverse pause",
        },
        x: "-100vw",
        duration: 4,
        ease: "none",
        onUpdate: () => {
          const barRect = animationBar.current?.getBoundingClientRect();
          const image1Rect = image1.current?.getBoundingClientRect();
          const image2Rect = image2.current?.getBoundingClientRect();

          if (barRect && image1Rect) {
            const clip1 = Math.max(0, image1Rect.right - barRect.x);
            image1.current!.style.clipPath = `inset(0px ${clip1}px 0px 0px)`;
          }

          if (barRect && image2Rect) {
            const clip2 = Math.max(0, image2Rect.right - barRect.x);
            image2.current!.style.clipPath = `inset(0px ${clip2}px 0px 0px)`;
          }
        },
      });
    }

    // ---------------------------
    // 2. IntersectionObserver for words
    // ---------------------------
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setIsVisible(true); // trigger once
      }
    };

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    if (container.current) observer.observe(container.current);

    return () => observer.disconnect(); // cleanup
  }, []);

  return (
    <div className="maindiv">
      {/* Video section */}
      <div className="overflow-x-hidden w-full h-[100dvh]">
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-10">
          <h1 className="text-5xl sm:text-7xl lg:text-9xl font-edwardian text-black drop-shadow-2xl text-center px-4">
            Trucé L'Officiel
          </h1>

          {/* Animated particles */}
          <div className="relative h-[30px] w-full max-w-[600px] mx-auto flex items-center justify-around gap-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-[#4C9AFF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-[#FF3333] rounded-full animate-bounce" style={{ animationDelay: '100ms' }}></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-[#FFE735] rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-[#F594FE] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-[#4C9AFF] rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-[#FF3333] rounded-full animate-bounce" style={{ animationDelay: '500ms' }}></div>
          </div>
        </div>

        <video
          className="w-full h-[100dvh] object-cover"
          width="100%"
          height="100%"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/Media/Videos/IntroductionVideo.mp4" type="video/mp4" />
        </video>
      </div>

      <NavBar font="GFS-Dot" color="#ffffff" />

      {/* Image reveal section - HIDDEN ON SMALL AND MEDIUM SCREENS */}
      <div className="imageContainer mx-[8%] mt-0 pt-2 h-[100dvh] w-[92%] hidden lg:block relative">
        {/* Base layer images */}
        <div className="flex justify-between items-start">
          <div className="aspect-square w-[40%] relative overflow-hidden border-6 border-black">
            <img className="w-full h-full object-cover" src="/Media/Images/Home/HomeImage1.jpg" alt="Home" />
          </div>

          <div className="aspect-square w-[40%] relative overflow-hidden border-6 border-black">
            <img className="w-full h-full object-cover" src="/Media/Images/Home/HomePhoto2.jpg" alt="Home" />
          </div>

          <div ref={animationBar} className="w-2 h-[20vh] xs:h-[25vh] sm:h-[40vh] md:h-[35vh] lg:h-[45vh] xl:h-[60vh] 2xl:h-[727px] relative bottom-3 rounded-full bg-black border-1 border-white shadow-lg z-1"></div>
        </div>

        {/* Overlay layer images (reveal effect) */}
        <div className="flex absolute top-2 left-0 justify-between items-start w-full">
          <div className="aspect-square w-[40%] relative overflow-hidden border-6 border-black">
            <img ref={image1} className="w-full h-full object-cover" src="/Media/Images/Home/HomeImage3.jpg" alt="Home" />
          </div>

          <div className="aspect-square w-[40%] relative overflow-hidden border-6 border-black">
            <img ref={image2} className="w-full h-full object-cover" src="/Media/Images/Home/HomeImage4.jpg" alt="Home" />
          </div>

          <div className="w-2 h-210 relative bottom-3 rounded-full bg-white shadow-lg z-1"></div>
        </div>
      </div>

      {/* Word effect section - needs wrapper for sticky to work */}
      <div className="relative">
        <div
          ref={container}
          className="
          wordEffect
          pl-[3%] sm:pl-[5%] lg:pl-[7%]
          h-[150svh]
          perspective-[1000px]
          [transform-style:preserve-3d]
          grid
          grid-rows-[repeat(4,25dvh)]
          grid-cols-[repeat(4,25dvw)]
          sticky
          relative
          top-0
          overflow-clip 
          bg-black
        "
        >
          {wordList.map((word, key) => {
            const fontSize = 50 + Math.random() * 30;
            const colors = ["#F594FE", "#FF3333", "#FFE735", "#4C9AFF"];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];

            return (
              <div
                key={key}
                className={`[transform-style:preserve-3d] ${isVisibile ? "animate-zoom-in" : ""}`}
                style={{
                  fontSize: `${fontSize}px`,
                  fontFamily: "Edwardian Script ITC",
                  color: randomColor,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              >
                {word}
              </div>
            );
          })}
        </div>

        <div className="bg-black flex justify-center lg:justify-end relative h-20 py-40 sm:py-10 lg:py-20 px-4 sm:px-10 lg:px-20">
          <h1 className=" bg-white font-edwardian text-4xl sm:text-6xl lg:text-8xl text-red-500 animate-pulse">
            <a href="/What">Visit Shop</a>
          </h1>
        </div>
      </div>

      <Footer />
    </div>
  );
}