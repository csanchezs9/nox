"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Balatro from "./Balatro";
import FlowingMenu from "./FlowingMenu";
import { usePageTransition } from "./PageTransitionProvider";

gsap.registerPlugin(ScrollTrigger);

export default function HeroScroll() {
  const { triggerTransition } = usePageTransition();
  const [balatroVisible, setBalatroVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const lenisRef   = useRef<InstanceType<typeof Lenis> | null>(null);
  const spacerRef  = useRef<HTMLDivElement>(null);
  const heroRef    = useRef<HTMLDivElement>(null);
  const zoomRef    = useRef<HTMLDivElement>(null);
  const bgCoverRef = useRef<HTMLDivElement>(null);
  const oRef       = useRef<HTMLDivElement>(null);
  const blackRef   = useRef<HTMLDivElement>(null);

  // ─── "inside" click → layout-level zoom transition ───────────────────────
  const handleInsideClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      triggerTransition(
        e.currentTarget.getBoundingClientRect(),
        "/inside",
        "inside",
        {
          showLabel: false,
          balatroProps: {
            mouseInteraction: false,
            spinSpeed:        4.0,
            spinRotation:     -1.5,
            color1:           "#ed761a",
            color2:           "#f5bd6e",
            color3:           "#653000",
            contrast:         3.0,
            lighting:         0.3,
            spinAmount:       0.2,
            pixelFilter:      2000,
          },
        }
      );
    },
    [triggerTransition]
  );

  const NOX_ITEMS = useMemo(() => [
    {
      link: "/inside", text: "inside", image: "/images/inside-parties/489009784_18023127818681417_3864332976154896011_n.jpg",
      marqueeTextColor: "#fff", onClick: handleInsideClick,
      balatroProps: { spinSpeed: 4.0, spinRotation: -1.5, color1: "#ed761a", color2: "#f5bd6e", color3: "#653000", contrast: 3.0, lighting: 0.3, spinAmount: 0.2, pixelFilter: 2000 },
    },
    {
      link: "#spicy", text: "spicy", image: "/images/spicy/652775500_17958825516079006_5884347453373111210_n.jpg",
      marqueeTextColor: "#fff",
      balatroProps: { spinSpeed: 4.0, spinRotation: 1.5, color1: "#DE443B", color2: "#ff6b6b", color3: "#6b0000", contrast: 3.0, lighting: 0.3, spinAmount: 0.25, pixelFilter: 2000 },
    },
    {
      link: "#torre-alta", text: "torre alta", image: "/images/torre-alta/503898684_17926730436079006_6127884364169973025_n.jpg",
      marqueeTextColor: "#0d0d0d",
      balatroProps: { spinSpeed: 3.0, spinRotation: -1.0, color1: "#ffffff", color2: "#cccccc", color3: "#888888", contrast: 2.5, lighting: 0.5, spinAmount: 0.15, pixelFilter: 2000 },
    },
    {
      link: "#flyers", text: "flyers", image: "/images/flyers/610213794_18436482181109762_2654311840714841503_n.jpg",
      marqueeTextColor: "#fff",
      balatroProps: { spinSpeed: 4.0, spinRotation: 1.0, color1: "#006BB4", color2: "#4da6ff", color3: "#003366", contrast: 3.0, lighting: 0.3, spinAmount: 0.2, pixelFilter: 2000 },
    },
    {
      link: "#nosotros", text: "nosotros", image: "/images/owners/490300441_18505615783036380_1886890642787923809_n.jpg",
      marqueeTextColor: "#fff",
      balatroProps: { spinSpeed: 2.0, spinRotation: -0.5, color1: "#444444", color2: "#222222", color3: "#111111", contrast: 2.0, lighting: 0.2, spinAmount: 0.1, pixelFilter: 2000 },
    },
  ], [handleInsideClick]);

  // ─── Lenis smooth scroll ───
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const onRaf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onRaf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onRaf);
      lenisRef.current = null;
      lenis.destroy();
    };
  }, []);

  // ─── Scroll-linked animation ───
  useEffect(() => {
    // Wait for fonts so we measure the O correctly
    const fontsReady = document.fonts?.ready ?? Promise.resolve();

    let ctx: gsap.Context | undefined;

    fontsReady.then(() => {
      // All refs must exist
      const o      = oRef.current;
      const zoom   = zoomRef.current;
      const black  = blackRef.current;
      const spacer = spacerRef.current;
      const cover  = bgCoverRef.current;
      const hero   = heroRef.current;
      if (!o || !zoom || !black || !spacer || !cover || !hero) return;

      // ── Measure the O ring center relative to the zoom container ──
      const oRect    = o.getBoundingClientRect();
      const zoomRect = zoom.getBoundingClientRect();

      const cx = oRect.left + oRect.width  / 2 - zoomRect.left;
      const cy = oRect.top  + oRect.height / 2 - zoomRect.top;

      const strokePx = parseFloat(getComputedStyle(o).borderTopWidth) || 0;
      const innerR   = Math.max(1, oRect.width / 2 - strokePx);

      // Transform origin = center of the O
      zoom.style.transformOrigin = `${cx}px ${cy}px`;

      // Radial-gradient background = black everywhere except a transparent
      // circle at the O center. Scales perfectly with CSS transform.
      // Sharp stops with a 0.5px feather for clean anti-aliasing at any scale.
      const r0 = Math.max(0, innerR - 0.25);
      const r1 = innerR + 0.25;
      black.style.background = `radial-gradient(circle at ${cx}px ${cy}px, transparent ${r0}px, #000 ${r1}px)`;

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: spacer,
            start:   "top top",
            end:     "bottom bottom",
            scrub:   0.3,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const inside = self.progress > 0.92;
              const show   = self.progress > 0.45;
              setBalatroVisible(show);
              if (!inside) setMenuOpen(false);
            },
          },
        });

        // Zoom from 1 → 45 (the O grows to fill the viewport, revealing Balatro)
        tl.fromTo(zoom,
          { scale: 1 },
          { scale: 45, ease: "power3.in", duration: 0.88 },
          0
        );

        // Fade out the black cover (separate from hero, sits behind)
        tl.fromTo(cover,
          { opacity: 1 },
          { opacity: 0, ease: "power1.out", duration: 0.35 },
          0.02
        );

        // At the very end (when fully zoomed in), fade out the hero so
        // the user sees pure Balatro. On reverse, it fades back in.
        tl.fromTo(hero,
          { opacity: 1 },
          { opacity: 0, ease: "none", duration: 0.08 },
          0.92
        );
      });
    });

    return () => {
      ctx?.revert(); // kills all ScrollTriggers + resets all inline styles
    };
  }, []);

  const letterStyle: React.CSSProperties = {
    fontFamily: "'Jost', sans-serif",
    fontWeight: 200,
    fontSize: "clamp(4rem, 12vw, 12rem)",
    letterSpacing: "-0.01em",
    lineHeight: 1,
    color: "white",
  };

  const oSize   = "clamp(2.9rem, 8.6vw, 8.6rem)";
  const oStroke = "clamp(0.18rem, 0.55vw, 0.55rem)";

  return (
    <>
      {/* Balatro — background, always running */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Balatro
          mouseInteraction={false}
          spinSpeed={4.0}
          spinRotation={-1.5}
          color1="#DE443B"
          color2="#006BB4"
          color3="#162325"
          contrast={3.0}
          lighting={0.3}
          spinAmount={0.2}
          pixelFilter={2000}
        />
      </div>

      {/* Black cover — sits between Balatro and Hero, fades out on scroll */}
      <div
        ref={bgCoverRef}
        className="fixed inset-0 z-[1] bg-black pointer-events-none"
      />

      {/* Scroll spacer — drives the scroll animation (180vh of scrollable area) */}
      <div ref={spacerRef} style={{ height: "180vh" }} />

      {/* Hero — fixed overlay, pointer-none so it never blocks interaction */}
      <div
        ref={heroRef}
        className="fixed inset-0 z-20 overflow-hidden pointer-events-none"
        style={{ willChange: "opacity" }}
      >
        <div
          ref={zoomRef}
          className="absolute inset-0"
          style={{
            willChange: "transform",
            backfaceVisibility: "hidden",  // GPU layer isolation — prevents text render glitches
          }}
        >
          {/* Black overlay with transparent circle at the O — the "portal" */}
          <div
            ref={blackRef}
            className="absolute inset-0"
            style={{
              background: "#000",  // will be replaced by radial-gradient on mount
            }}
          />

          {/* Wordmark: sits on top of the black overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center select-none" style={{ gap: 0 }}>
              <span style={letterStyle}>N</span>

              <div
                ref={oRef}
                style={{
                  width:        oSize,
                  height:       oSize,
                  borderRadius: "50%",
                  border:       `${oStroke} solid white`,
                  boxSizing:    "border-box",
                  flexShrink:   0,
                  margin:       "0 0.02em",
                }}
              />

              <span style={letterStyle}>X</span>

              <span
                style={{
                  fontFamily:    "'Cormorant Garamond', serif",
                  fontStyle:     "italic",
                  fontWeight:    300,
                  fontSize:      "clamp(1rem, 2.6vw, 2.6rem)",
                  color:         "white",
                  marginLeft:    "0.45em",
                  marginBottom:  "-0.45em",
                  opacity:       0.8,
                  letterSpacing: "0.04em",
                  alignSelf:     "flex-end",
                }}
              >
                group
              </span>
            </div>
          </div>
        </div>
      </div>


      {/* ── Ver menú button — aparece cuando Balatro es visible ── */}
      <div
        style={{
          position:      "fixed",
          inset:         0,
          zIndex:        30,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          opacity:       balatroVisible && !menuOpen ? 1 : 0,
          transition:    "opacity 0.6s ease",
          pointerEvents: balatroVisible && !menuOpen ? "auto" : "none",
        }}
      >
        <button
          onClick={() => setMenuOpen(true)}
          style={{
            fontFamily:      "'Jost', sans-serif",
            fontWeight:      300,
            fontSize:        "clamp(0.75rem, 1.2vw, 1rem)",
            letterSpacing:   "0.2em",
            textTransform:   "uppercase",
            color:           "#ffffff",
            background:      "transparent",
            border:          "1px solid rgba(255,255,255,0.4)",
            borderRadius:    "999px",
            padding:         "0.75em 2em",
            cursor:          "pointer",
            backdropFilter:  "blur(4px)",
            transition:      "border-color 0.3s ease, background 0.3s ease",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.9)";
            (e.currentTarget as HTMLButtonElement).style.background  = "rgba(255,255,255,0.06)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.4)";
            (e.currentTarget as HTMLButtonElement).style.background  = "transparent";
          }}
        >
          ver menú
        </button>
      </div>

      {/* ── FlowingMenu overlay ── */}
      <div
        style={{
          position:      "fixed",
          inset:         0,
          zIndex:        40,
          opacity:       menuOpen ? 1 : 0,
          transition:    "opacity 0.5s ease",
          pointerEvents: menuOpen ? "auto" : "none",
        }}
      >
        {/* Cerrar al hacer click fuera del menú / botón X */}
        <button
          onClick={() => setMenuOpen(false)}
          aria-label="Cerrar menú"
          style={{
            position:    "fixed",
            top:         "1.5rem",
            right:       "1.5rem",
            zIndex:      50,
            background:  "transparent",
            border:      "none",
            color:       "#ffffff",
            fontSize:    "1.5rem",
            cursor:      "pointer",
            lineHeight:  1,
            opacity:     menuOpen ? 1 : 0,
            transition:  "opacity 0.3s ease",
          }}
        >
          ✕
        </button>
        <FlowingMenu
          items={NOX_ITEMS}
          speed={15}
          textColor="#ffffff"
          bgColor="transparent"
          marqueeBgColor="#DE443B"
          marqueeTextColor="#ffffff"
          borderColor="rgba(255,255,255,0.15)"
        />
      </div>
    </>
  );
}
