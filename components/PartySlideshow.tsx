"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Slide data ─────────────────────────────────────────────────────────────
const SLIDES = [
  {
    img: "/images/inside-parties/489009784_18023127818681417_3864332976154896011_n.jpg",
    headline: "Nowhere to go\nbut Inside.",
    sub: "Deja el ruido de la ciudad atrás y entra a un mundo diferente.",
    cta: "Descubre la experiencia",
    position: "center 40%",
  },
  {
    img: "/images/inside-parties/489346504_18023127845681417_3813804041524227092_n.jpg",
    headline: "Relájate\ny disfruta.",
    sub: "Vistas y sonidos que no encontrarás en ningún otro lugar.",
    cta: "Descubre la experiencia",
    position: "center 30%",
  },
  {
    img: "/images/inside-parties/489382044_18023127827681417_746488291568448453_n.jpg",
    headline: "El ritmo\nlo define todo.",
    sub: "Música curada para los que realmente saben escuchar.",
    cta: "Descubre la experiencia",
    position: "center 25%",
  },
  {
    img: "/images/inside-parties/489436378_18023127857681417_2319611417508104459_n.jpg",
    headline: "Una noche\nque recuerdas.",
    sub: "Cada detalle diseñado para que la noche sea perfecta.",
    cta: "Descubre la experiencia",
    position: "center 35%",
  },
  {
    img: "/images/inside-parties/489972803_18023127836681417_3456619330557082824_n.jpg",
    headline: "El set\ncomienza aquí.",
    sub: "Los mejores DJs. El espacio que lo merece.",
    cta: "Descubre la experiencia",
    position: "center 30%",
  },
] as const;

const N = SLIDES.length;

const SCREENS_PER_SLIDE = 1.6;

// ─── Component ───────────────────────────────────────────────────────────────
export default function PartySlideshow() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [hintVisible, setHintVisible] = useState(true);

  const wrapperRef  = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const imgRefs  = useRef<(HTMLDivElement | null)[]>(Array(N).fill(null));
  const headRefs = useRef<(HTMLHeadingElement | null)[]>(Array(N).fill(null));
  const subRefs  = useRef<(HTMLParagraphElement | null)[]>(Array(N).fill(null));
  const ctaRefs  = useRef<(HTMLAnchorElement | null)[]>(Array(N).fill(null));
  const numRefs  = useRef<(HTMLSpanElement | null)[]>(Array(N).fill(null));

  useEffect(() => {
    const wrapper  = wrapperRef.current;
    const viewport = viewportRef.current;
    if (!wrapper || !viewport) return;

    // ─── The scroll end is calculated in REAL PIXELS, not vh strings.
    // GSAP ScrollTrigger ignores 'vh' units and reads only the number.
    // window.innerHeight converts vh → px correctly.
    const totalScrollPx = N * SCREENS_PER_SLIDE * window.innerHeight;

    // Match wrapper height so CSS sticky releases exactly when animation ends
    wrapper.style.height = `${totalScrollPx + window.innerHeight}px`;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger:  wrapper,
          start:    "top top",
          // px offset from trigger start — this is what GSAP actually uses
          end:      () => `+=${N * SCREENS_PER_SLIDE * window.innerHeight}`,
          scrub:    2,
          // NO pin here — CSS position:sticky handles keeping the viewport fixed
          invalidateOnRefresh: true,
          onUpdate(self) {
            const idx = Math.min(Math.floor(self.progress * N), N - 1);
            setActiveSlide(idx);
            if (self.progress > 0.03) setHintVisible(false);
            if (progressRef.current) {
              progressRef.current.style.transform = `scaleX(${self.progress})`;
            }
          },
        },
      });

      // ── Per-slide animations ────────────────────────────────────────────
      // Timeline spans N units (0→N). Slide i occupies [i, i+1].
      // Keyframes within each segment are fractions of 1 unit.
      //
      //  i+0.00  image fades/scales in
      //  i+0.10  counter appears
      //  i+0.14  headline slides from left
      //  i+0.22  subtitle drifts up
      //  i+0.28  CTA fades in
      //  i+0.62  text starts to exit
      //  i+0.75  image starts to fade out → next slide crossfade

      SLIDES.forEach((_, i) => {
        const img  = imgRefs.current[i];
        const head = headRefs.current[i];
        const sub  = subRefs.current[i];
        const cta  = ctaRefs.current[i];
        const num  = numRefs.current[i];
        if (!img || !head || !sub || !cta || !num) return;

        const isFirst = i === 0;
        const isLast  = i === N - 1;
        const s = i; // absolute timeline position for this slide

        // Image IN
        if (!isFirst) {
          tl.fromTo(img,
            { opacity: 0, scale: 1.1 },
            { opacity: 1, scale: 1, ease: "power2.out", duration: 0.38 },
            s
          );
        } else {
          tl.fromTo(img,
            { scale: 1.07 },
            { scale: 1, ease: "power1.out", duration: 0.40 },
            s
          );
        }

        // Text IN — staggered
        tl.fromTo(num,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, ease: "power3.out", duration: 0.20 },
          s + 0.10
        );
        tl.fromTo(head,
          { opacity: 0, x: -90, skewX: 5 },
          { opacity: 1, x: 0,   skewX: 0, ease: "expo.out", duration: 0.30 },
          s + 0.14
        );
        tl.fromTo(sub,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, ease: "power3.out", duration: 0.26 },
          s + 0.22
        );
        tl.fromTo(cta,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, ease: "power3.out", duration: 0.20 },
          s + 0.28
        );

        // Text + Image OUT (skip on last slide — stays visible)
        if (!isLast) {
          const out = s + 0.62;
          tl.to([num, cta], { opacity: 0, duration: 0.12, ease: "power2.in" }, out);
          tl.to(head, { opacity: 0, x: 80, skewX: -3, ease: "power3.in", duration: 0.16 }, out);
          tl.to(sub,  { opacity: 0, y: -22, ease: "power2.in", duration: 0.14 }, out + 0.04);
          tl.to(img,  { opacity: 0, scale: 0.96, ease: "power2.in", duration: 0.24 }, s + 0.75);
        }
      });
    }, wrapper);

    // Also update wrapper height if window resizes
    const onResize = () => {
      const px = N * SCREENS_PER_SLIDE * window.innerHeight;
      wrapper.style.height = `${px + window.innerHeight}px`;
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    return () => {
      ctx.revert();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>

      {/* ── Sticky viewport: CSS keeps it pinned, GSAP animates inside it ── */}
      <div
        ref={viewportRef}
        style={{
          position: "sticky",
          top:      0,
          height:   "100vh",
          width:    "100%",
          overflow: "hidden",
          background: "#000",
        }}
      >
        {/* ── Images ── */}
        {SLIDES.map((slide, i) => (
          <div
            key={slide.img}
            ref={(el) => { imgRefs.current[i] = el; }}
            style={{
              position:   "absolute",
              inset:      0,
              opacity:    i === 0 ? 1 : 0,
              transform:  i === 0 ? "scale(1.07)" : "scale(1.1)",
              willChange: "transform, opacity",
            }}
          >
            <Image
              src={slide.img}
              alt={slide.headline.replace("\n", " ")}
              fill
              priority={i === 0}
              sizes="100vw"
              style={{ objectFit: "cover", objectPosition: slide.position }}
            />
            {/* Gradient overlays for legibility */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: `
                linear-gradient(to right, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.10) 52%, transparent 100%),
                linear-gradient(to top,   rgba(0,0,0,0.55) 0%, transparent 38%),
                linear-gradient(to bottom,rgba(0,0,0,0.22) 0%, transparent 22%)
              `,
            }} />
          </div>
        ))}

        {/* ── Text layers ── */}
        {SLIDES.map((slide, i) => (
          <div
            key={`text-${i}`}
            style={{
              position:       "absolute",
              inset:          0,
              display:        "flex",
              flexDirection:  "column",
              justifyContent: "center",
              padding:        "0 clamp(2.5rem, 9vw, 9rem)",
              pointerEvents:  "none",
            }}
          >
            {/* Counter */}
            <span
              ref={(el) => { numRefs.current[i] = el; }}
              style={{
                fontFamily:    "'Jost', sans-serif",
                fontWeight:    300,
                fontSize:      "clamp(0.58rem, 0.85vw, 0.78rem)",
                letterSpacing: "0.36em",
                textTransform: "uppercase",
                color:         "rgba(255,255,255,0.45)",
                marginBottom:  "1.4rem",
                opacity:       i === 0 ? 1 : 0,
                display:       "flex",
                alignItems:    "center",
                gap:           "0.8em",
              }}
            >
              <span style={{
                display:       "inline-block",
                width:         "1.8em",
                height:        "1px",
                background:    "rgba(255,255,255,0.3)",
                verticalAlign: "middle",
              }} />
              {String(i + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
            </span>

            {/* Headline */}
            <h2
              ref={(el) => { headRefs.current[i] = el; }}
              style={{
                fontFamily:    "'Jost', sans-serif",
                fontWeight:    200,
                fontSize:      "clamp(3.2rem, 8vw, 10rem)",
                letterSpacing: "-0.025em",
                lineHeight:    0.95,
                color:         "#fff",
                margin:        0,
                marginBottom:  "1.6rem",
                whiteSpace:    "pre-line",
                maxWidth:      "13ch",
                opacity:       i === 0 ? 1 : 0,
                willChange:    "transform, opacity",
              }}
            >
              {slide.headline}
            </h2>

            {/* Subtitle */}
            <p
              ref={(el) => { subRefs.current[i] = el; }}
              style={{
                fontFamily:    "'Cormorant Garamond', serif",
                fontStyle:     "italic",
                fontWeight:    300,
                fontSize:      "clamp(1rem, 1.8vw, 1.45rem)",
                letterSpacing: "0.03em",
                lineHeight:    1.55,
                color:         "rgba(255,255,255,0.65)",
                margin:        0,
                marginBottom:  "2.4rem",
                maxWidth:      "36ch",
                opacity:       i === 0 ? 1 : 0,
                willChange:    "transform, opacity",
              }}
            >
              {slide.sub}
            </p>

            {/* CTA */}
            <a
              ref={(el) => { ctaRefs.current[i] = el; }}
              href="#experience"
              style={{
                display:        "inline-flex",
                alignItems:     "center",
                gap:            "0.65em",
                fontFamily:     "'Jost', sans-serif",
                fontWeight:     300,
                fontSize:       "clamp(0.65rem, 1vw, 0.85rem)",
                letterSpacing:  "0.22em",
                textTransform:  "uppercase",
                color:          "rgba(255,255,255,0.8)",
                textDecoration: "none",
                opacity:        i === 0 ? 1 : 0,
                pointerEvents:  "auto",
                width:          "fit-content",
                paddingBottom:  "0.3em",
                borderBottom:   "1px solid rgba(255,255,255,0.22)",
                transition:     "color 0.22s, border-color 0.22s",
                willChange:     "opacity",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#fff";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.75)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.8)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.22)";
              }}
            >
              {slide.cta}
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                <path
                  d="M2 6.5h9M8 3l3.5 3.5L8 10"
                  stroke="currentColor" strokeWidth="1.1"
                  strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        ))}

        {/* ── Right-side dot nav (active via React state) ── */}
        <div style={{
          position:      "absolute",
          right:         "clamp(1.5rem, 3.5vw, 3.5rem)",
          top:           "50%",
          transform:     "translateY(-50%)",
          display:       "flex",
          flexDirection: "column",
          alignItems:    "center",
          gap:           "0.6rem",
        }}>
          {SLIDES.map((_, i) => (
            <div key={`dot-${i}`} style={{
              width:        "3px",
              height:       activeSlide === i ? "30px" : "5px",
              borderRadius: "2px",
              background:   activeSlide === i ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.22)",
              transition:   "height 0.4s cubic-bezier(0.4,0,0.2,1), background 0.4s ease",
            }} />
          ))}
        </div>

        {/* ── Progress bar ── */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: "1.5px", background: "rgba(255,255,255,0.08)",
        }}>
          <div ref={progressRef} style={{
            height: "100%", background: "rgba(255,255,255,0.45)",
            transformOrigin: "left center", transform: "scaleX(0)",
            willChange: "transform",
          }} />
        </div>

        {/* ── Scroll hint ── */}
        <div style={{
          position:      "absolute",
          bottom:        "2.8rem",
          left:          "50%",
          transform:     "translateX(-50%)",
          display:       "flex",
          flexDirection: "column",
          alignItems:    "center",
          gap:           "0.55rem",
          opacity:       hintVisible ? 1 : 0,
          transition:    "opacity 0.7s ease",
          pointerEvents: "none",
        }}>
          <span style={{
            fontFamily: "'Jost', sans-serif", fontWeight: 300,
            fontSize: "0.58rem", letterSpacing: "0.32em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.32)",
          }}>Scroll</span>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none"
            aria-hidden="true" style={{ opacity: 0.32 }}>
            <rect x="1" y="1" width="14" height="22" rx="7" stroke="white" strokeWidth="1.1" />
            <circle cx="8" cy="7" r="2" fill="white">
              <animateTransform attributeName="transform" type="translate"
                values="0 0; 0 9; 0 0" dur="2s" repeatCount="indefinite"
                calcMode="spline" keySplines="0.42 0 0.58 1; 0.42 0 0.58 1" />
            </circle>
          </svg>
        </div>
      </div>
    </div>
  );
}
