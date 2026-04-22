"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Balatro from "@/components/Balatro";
import PartySlideshow from "@/components/PartySlideshow";

gsap.registerPlugin(ScrollTrigger);

export default function InsidePage() {
  const titleRef   = useRef<HTMLHeadingElement>(null);
  const subRef     = useRef<HTMLParagraphElement>(null);
  const chevronRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (titleRef.current) {
      tl.fromTo(titleRef.current,
        { opacity: 0, y: 60, scale: 0.94 },
        { opacity: 1, y: 0,  scale: 1, duration: 0.9 },
        0.05
      );
    }
    if (subRef.current) {
      tl.fromTo(subRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0,  duration: 0.7 },
        0.4
      );
    }
    if (chevronRef.current) {
      tl.fromTo(chevronRef.current,
        { opacity: 0, y: -10 },
        { opacity: 0.4, y: 0, duration: 0.6 },
        0.7
      );
      gsap.to(chevronRef.current, {
        y: 10, opacity: 0.2, duration: 1.2,
        ease: "sine.inOut", repeat: -1, yoyo: true,
        delay: 1.2,
      });
    }

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <main style={{ background: "#000", color: "#fff", minHeight: "100vh" }}>

      {/* ── Balatro bg ── */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <Balatro
          mouseInteraction={false}
          spinSpeed={3.0}
          spinRotation={1.2}
          color1="#ed761a"
          color2="#f5bd6e"
          color3="#653000"
          contrast={3.5}
          lighting={0.25}
          spinAmount={0.15}
          pixelFilter={2000}
        />
      </div>

      {/* ── Back button ── */}
      <Link
        href="/"
        style={{
          position:      "fixed",
          top:           "2rem",
          left:          "2rem",
          zIndex:        10,
          fontFamily:    "'Jost', sans-serif",
          fontWeight:    300,
          fontSize:      "0.85rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color:         "rgba(255,255,255,0.55)",
          textDecoration:"none",
          display:       "flex",
          alignItems:    "center",
          gap:           "0.5em",
          transition:    "color 0.2s",
        }}
        onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
        onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
      >
        <span style={{ fontSize: "1em" }}>←</span> NOX
      </Link>

      {/* ── Hero ── */}
      <section
        style={{
          position:       "relative",
          zIndex:         1,
          height:         "100vh",
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          justifyContent: "center",
          textAlign:      "center",
          padding:        "0 2rem",
        }}
      >
        <h1
          ref={titleRef}
          style={{
            fontFamily:    "'Jost', sans-serif",
            fontWeight:    200,
            fontSize:      "clamp(5rem, 22vw, 22rem)",
            letterSpacing: "-0.02em",
            lineHeight:    0.88,
            margin:        0,
            opacity:       0,
          }}
        >
          INSIDE
        </h1>

        <p
          ref={subRef}
          style={{
            fontFamily:    "'Cormorant Garamond', serif",
            fontStyle:     "italic",
            fontWeight:    300,
            fontSize:      "clamp(1rem, 2.2vw, 1.6rem)",
            letterSpacing: "0.12em",
            color:         "rgba(255,255,255,0.6)",
            marginTop:     "2.5rem",
            opacity:       0,
          }}
        >
          Espacios que definen la noche
        </p>

        {/* Scroll hint */}
        <div
          ref={chevronRef}
          style={{
            position:  "absolute",
            bottom:    "3rem",
            left:      "50%",
            transform: "translateX(-50%)",
            opacity:   0,
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </section>

      {/* ── Joby-style Scroll Slideshow ── */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <PartySlideshow />
      </div>

      {/* ── Footer ── */}
      <footer
        style={{
          position:      "relative",
          zIndex:        1,
          padding:       "4rem clamp(1.5rem, 6vw, 6rem)",
          borderTop:     "1px solid rgba(255,255,255,0.06)",
          display:       "flex",
          alignItems:    "center",
          justifyContent:"space-between",
          flexWrap:      "wrap",
          gap:           "1rem",
        }}
      >
        <span
          style={{
            fontFamily:    "'Jost', sans-serif",
            fontWeight:    200,
            fontSize:      "1.6rem",
            letterSpacing: "-0.01em",
            color:         "rgba(255,255,255,0.8)",
          }}
        >
          NOX group
        </span>
        <span
          style={{
            fontFamily:    "'Jost', sans-serif",
            fontWeight:    300,
            fontSize:      "0.75rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color:         "rgba(255,255,255,0.2)",
          }}
        >
          © 2025 — All rights reserved
        </span>
      </footer>
    </main>
  );
}
