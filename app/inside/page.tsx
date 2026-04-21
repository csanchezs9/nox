"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Balatro from "@/components/Balatro";

gsap.registerPlugin(ScrollTrigger);

const SPACES = [
  {
    name: "ECLIPSE",
    area: "Zona T",
    capacity: "800 personas",
    vibe: "Dark & Intimate",
    desc: "El corazón oscuro de la ciudad. Un espacio diseñado para perderse.",
  },
  {
    name: "NOIR",
    area: "Chapinero Alto",
    capacity: "1,200 personas",
    vibe: "Underground",
    desc: "Sonido sin filtros, luces que desafían la vista. Experiencia pura.",
  },
  {
    name: "SOLSTICE",
    area: "Usaquén",
    capacity: "600 personas",
    vibe: "Rooftop",
    desc: "La ciudad a tus pies. La noche comienza aquí arriba.",
  },
];

export default function InsidePage() {
  const titleRef   = useRef<HTMLHeadingElement>(null);
  const subRef     = useRef<HTMLParagraphElement>(null);
  const cardsRef   = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

    // Cards — stagger in as they enter viewport
    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll<HTMLElement>(".inside-card");
      gsap.fromTo(cards,
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: "power3.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
          }
        }
      );
    }

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <main style={{ background: "#000", color: "#fff", minHeight: "100vh" }}>

      {/* ── Balatro bg (red/dark tones for "inside" feel) ── */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <Balatro
          mouseInteraction={false}
          spinSpeed={3.0}
          spinRotation={1.2}
          color1="#DE443B"
          color2="#1a0005"
          color3="#0d0005"
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
          position:        "relative",
          zIndex:          1,
          height:          "100vh",
          display:         "flex",
          flexDirection:   "column",
          alignItems:      "center",
          justifyContent:  "center",
          textAlign:       "center",
          padding:         "0 2rem",
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

      {/* ── Spaces ── */}
      <section
        style={{
          position: "relative",
          zIndex:   1,
          padding:  "clamp(4rem, 10vw, 10rem) clamp(1.5rem, 6vw, 6rem)",
        }}
      >
        <p
          style={{
            fontFamily:    "'Jost', sans-serif",
            fontWeight:    300,
            fontSize:      "0.75rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color:         "rgba(255,255,255,0.35)",
            marginBottom:  "4rem",
          }}
        >
          Nuestros Espacios
        </p>

        <div
          ref={cardsRef}
          style={{
            display:             "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
            gap:                 "1.5rem",
          }}
        >
          {SPACES.map((space) => (
            <div
              key={space.name}
              className="inside-card"
              style={{
                background:   "rgba(255,255,255,0.04)",
                border:       "1px solid rgba(255,255,255,0.08)",
                borderRadius: "1.2rem",
                padding:      "clamp(2rem, 4vw, 3.5rem)",
                backdropFilter: "blur(12px)",
                opacity:      0,
                cursor:       "default",
                transition:   "background 0.3s, border-color 0.3s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background     = "rgba(222,68,59,0.1)";
                (e.currentTarget as HTMLElement).style.borderColor    = "rgba(222,68,59,0.25)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background     = "rgba(255,255,255,0.04)";
                (e.currentTarget as HTMLElement).style.borderColor    = "rgba(255,255,255,0.08)";
              }}
            >
              <div
                style={{
                  fontFamily:    "'Jost', sans-serif",
                  fontWeight:    200,
                  fontSize:      "clamp(2.5rem, 7vw, 5rem)",
                  letterSpacing: "-0.02em",
                  lineHeight:    1,
                  marginBottom:  "1.5rem",
                }}
              >
                {space.name}
              </div>

              <div style={{ display: "flex", gap: "1rem", marginBottom: "1.2rem", flexWrap: "wrap" }}>
                {[space.area, space.capacity, space.vibe].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily:    "'Jost', sans-serif",
                      fontWeight:    300,
                      fontSize:      "0.7rem",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color:         "rgba(255,255,255,0.4)",
                      border:        "1px solid rgba(255,255,255,0.12)",
                      borderRadius:  "999px",
                      padding:       "0.3em 0.85em",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p
                style={{
                  fontFamily:    "'Cormorant Garamond', serif",
                  fontStyle:     "italic",
                  fontWeight:    300,
                  fontSize:      "clamp(1rem, 1.8vw, 1.2rem)",
                  color:         "rgba(255,255,255,0.55)",
                  lineHeight:    1.6,
                  margin:        0,
                }}
              >
                {space.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          position:   "relative",
          zIndex:     1,
          padding:    "4rem clamp(1.5rem, 6vw, 6rem)",
          borderTop:  "1px solid rgba(255,255,255,0.06)",
          display:    "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap:   "wrap",
          gap:        "1rem",
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
