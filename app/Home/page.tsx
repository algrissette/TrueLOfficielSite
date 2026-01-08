"use client";

import {useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NavBar from "@/components/navbar/navbar";

export default function Home() {


 const animationBar = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null);
   const wordRef = useRef<HTMLDivElement>(null);


  const image1 = useRef<HTMLImageElement>(null);
  const image2 = useRef<HTMLImageElement>(null);
  const [isVisibile, setIsVisible] = useState(false)

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
  "Truce",       // 12 - middle word
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
  "Paint",       // 24
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
        markers: true,
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
        <div className=" maindiv">
         <div className="overflow-x-hidden w-full h-[100dvh]  "> 
            <div className="absolute top-[50%] left-[50%]">
                <h1 className="text-9xl font-edwardian text-black relative top-10 ">Truce L'officiel</h1>
                <div className="bg-white rounded-full h-[30px] w-[600px]"> </div>
            </div>
            
            <video className="w-full h-[100dvh] object-cover "
             width="100%" height="100%" autoPlay muted loop>
                <source src="/Media/Videos/IntroductionVideo.mp4" type="video/mp4" />
                Hello
            </video>
            </div>

               <NavBar
                font= "sans"
                color="#ffffff"
                />


            <div className=" imageContainer mx-[8%] mt-0 pt-2 h-[100dvh] w-[92%]  "> 
                <div className="  flex justify-between">
                    <div className="w-[800px] h-[800px] relative overflow-hidden border-6 border-black"> 
                 <img  className=" w-full object-fit " src="/Media/Images/Home/HomeImage1.jpg" alt="Home" />
                 </div>
                 
                 <div className="w-[800px] h-[800px] border-6 border-black overflow-hidden ">
                  <img className=" w-full object-fit " src="/Media/Images/Home/HomePhoto2.jpg" alt="Home" />
                   </div>
                  <div ref={animationBar} className="w-2 h-210 relative bottom-3 rounded-full bg-[#00FF44] border-1 border-[46B8FF] shadow-lg z-1"> </div>

                        
             </div>
             <div className="flex relative top-[-840px] justify-between  " > 
             <div id="Image-Dupe-1" className="border-6 border-black w-[800px] h-[800px] relative overflow-hidden"> 
                 <img ref={image1} className="  w-full object-fit " src="/Media/Images/Home/HomeImage3.jpg" alt="Home" />
                 </div>
             <div className="w-[800px] h-[800px] border-6 border-black overflow-hidden ">
                  <img  ref={image2} className="w-full object-fit" src="/Media/Images/Home/HomeImage4.jpg" alt="Home" />
                   </div>
                    <div  className="w-2 h-210 relative bottom-3 rounded-full bg-[#B2BEB5] border-1 border-[#B2BEB5] shadow-lg z-1"> </div>

                   </div>

            </div>

           <div className="wordEffect"> 
 <div
  ref={container}
  className="
   pl-[5%]
    h-[100svh]
    perspective-[1000px]
    [transform-style:preserve-3d]
    grid
    grid-rows-[repeat(4,25dvh)]
    grid-cols-[repeat(4,25dvw)]
    sticky
    top-0
    overflow-clip 
    bg-black
    wordEffect
  "
>
  {wordList.map((word, key) => {
    const fontSize = 75 + Math.random() * 30;
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
    animationDelay: `${Math.random()*1.5}s`
  }}
>
  {word}
</div>

    );
  })}
</div>
<h1 className="font-edwardian text-8xl text-red-500 relative left-[75%] bottom-50 animate-pulse"> <a href="/Home">  Visit Shop </a>  </h1>
</div>



        </div>
    )
}
