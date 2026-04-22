"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Balatro from "./Balatro";
import BubbleMenu, { type MenuItem } from "./BubbleMenu";
import { usePageTransition } from "./PageTransitionProvider";

gsap.registerPlugin(ScrollTrigger);

export default function HeroScroll() {
  const { triggerTransition } = usePageTransition();
  const [navOpen, setNavOpen] = useState(false);

  const spacerRef  = useRef<HTMLDivElement>(null);
  const heroRef    = useRef<HTMLDivElement>(null);
  const zoomRef    = useRef<HTMLDivElement>(null);
  const bgCoverRef = useRef<HTMLDivElement>(null);
  const oRef       = useRef<HTMLDivElement>(null);
  const blackRef   = useRef<HTMLDivElement>(null);

  // ─── "inside" click → layout-level zoom transition ───────────────────────
  const handleInsideClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      triggerTransition(e.currentTarget.getBoundingClientRect(), "/inside", "inside");
    },
    [triggerTransition]
  );

  const NOX_ITEMS = useMemo<MenuItem[]>(() => [
    { label: "inside",     href: "/inside",     ariaLabel: "Inside",     rotation: -8, hoverStyles: { bgColor: "#DE443B", textColor: "#fff" }, onClick: handleInsideClick },
    { label: "events",    href: "#events",     ariaLabel: "Events",     rotation:  8, hoverStyles: { bgColor: "#006BB4", textColor: "#fff" } },
    { label: "experience",href: "#experience", ariaLabel: "Experience", rotation: -4, hoverStyles: { bgColor: "#DE443B", textColor: "#fff" } },
    { label: "about",     href: "#about",      ariaLabel: "About NOX",  rotation:  4, hoverStyles: { bgColor: "#006BB4", textColor: "#fff" } },
    { label: "contact",   href: "#contact",    ariaLabel: "Contact",    rotation: -8, hoverStyles: { bgColor: "#DE443B", textColor: "#fff" } },
  ], [handleInsideClick]);

  // ─── Lenis smooth scroll ───
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);
    const onRaf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onRaf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onRaf);
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
            // Auto-open the nav when the portal is ~92% complete
            onUpdate: (self) => setNavOpen(self.progress > 0.92),
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

      {/* Content layer — shows above Balatro after hero fades */}
      <div className="relative z-10 min-h-screen" />

      {/* ── Navigation — fades in once portal animation completes ── */}
      <div
        style={{
          position:      "fixed",
          inset:         0,
          zIndex:        30,
          opacity:       navOpen ? 1 : 0,
          transition:    "opacity 0.9s ease",
          pointerEvents: navOpen ? "auto" : "none",
        }}
      >
        <BubbleMenu
          logo={
            <span style={{
              fontFamily:    "'Jost', sans-serif",
              fontWeight:    200,
              fontSize:      "1.5rem",
              color:         "#fff",
              letterSpacing: "-0.01em",
            }}>
              N
            </span>
          }
          forceOpen={navOpen}
          useFixedPosition={false}
          menuBg="#0d0d0d"
          menuContentColor="#ffffff"
          menuAriaLabel="Toggle navigation"
          items={NOX_ITEMS}
          animationEase="back.out(1.4)"
          animationDuration={0.45}
          staggerDelay={0.09}
        />
      </div>
    </>
  );
}
