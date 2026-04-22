"use client";

import { useEffect } from "react";
import Link from "next/link";
import Balatro from "@/components/Balatro";
import PartySlideshow from "@/components/PartySlideshow";

export default function InsidePage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

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


{/* ── Joby-style Scroll Slideshow ── */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <PartySlideshow />
      </div>

    </main>
  );
}
