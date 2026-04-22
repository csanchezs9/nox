"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Link from "next/link";
import Image from "next/image";
import Balatro from "@/components/Balatro";

gsap.registerPlugin(ScrollTrigger);

const SPICY = [
  "/images/spicy/652775500_17958825516079006_5884347453373111210_n.jpg",
  "/images/spicy/658173934_17961672135079006_3063236057858194697_n.jpg",
  "/images/spicy/658901470_17961672096079006_5932720919516168708_n.jpg",
  "/images/spicy/660790704_17961672105079006_1724440840243422888_n.jpg",
  "/images/spicy/662421599_17961672114079006_2667928899873963787_n.jpg",
  "/images/spicy/662817394_17961672123079006_8824472561308150164_n.jpg",
  "/images/spicy/663113464_17961672144079006_4103667065463808391_n.jpg",
  "/images/spicy/669432383_17961672153079006_8877585650959849499_n.jpg",
];

const SPICY_EVENTS = [
  { title: "SPICY VOL. 1",   date: "SAB — 26 ABR", time: "10PM → 4AM",  tag: "SOLD OUT" },
  { title: "NIGHT RITUALS",  date: "SAB — 03 MAY", time: "11PM → 5AM",  tag: "TICKETS"  },
  { title: "SPICY VOL. 2",   date: "SAB — 10 MAY", time: "10PM → 4AM",  tag: "PRÓXIMO"  },
  { title: "DARK PARADE",    date: "VIE — 16 MAY", time: "11PM → 6AM",  tag: "TICKETS"  },
  { title: "SPICY VOL. 3",   date: "SAB — 24 MAY", time: "10PM → 5AM",  tag: "PRÓXIMO"  },
  { title: "SOLSTICE",       date: "SAB — 31 MAY", time: "10PM → 6AM",  tag: "PRÓXIMO"  },
  { title: "ECLIPSE NIGHT",  date: "SAB — 07 JUN", time: "11PM → 5AM",  tag: "PRÓXIMO"  },
  { title: "SPICY FINALE",   date: "SAB — 14 JUN", time: "10PM → 4AM",  tag: "PRÓXIMO"  },
];

export default function SpicyPage() {
  const titleRef    = useRef<HTMLHeadingElement>(null);
  const subRef      = useRef<HTMLParagraphElement>(null);
  const chevronRef  = useRef<HTMLDivElement>(null);
  const galleryRef  = useRef<HTMLElement>(null);
  const trackRef    = useRef<HTMLDivElement>(null);
  const counterRef  = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    // ── Lenis smooth scroll ───────────────────────────────────────────────────
    const lenis = new Lenis();
    const tick = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // ── Hero entrance (mirrors inside page) ───────────────────────────────────
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (titleRef.current) {
      tl.fromTo(titleRef.current,
        { opacity: 0, y: 60, scale: 0.94 },
        { opacity: 1, y: 0,  scale: 1,    duration: 0.9 },
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
        ease: "sine.inOut", repeat: -1, yoyo: true, delay: 1.2,
      });
    }

    // ── Gallery ───────────────────────────────────────────────────────────────
    const gallery = galleryRef.current;
    const track   = trackRef.current;
    if (!gallery || !track) return;

    const cards = gsap.utils.toArray<HTMLElement>(".ev-card");

    // Cards crash in from alternating directions with rotation
    gsap.set(cards, {
      opacity: 0,
      y:        (i) => i % 2 === 0 ? -110 : 110,
      rotation: (i) => [-7, 5, -4, 7, -6, 4, -5, 6][i] ?? 0,
    });

    gsap.to(cards, {
      opacity: 1, y: 0, rotation: 0,
      stagger: 0.065, duration: 0.9, ease: "power3.out",
      scrollTrigger: {
        trigger: gallery,
        start:   "top 78%",
        once:    true,
      },
    });

    // Horizontal scroll
    const totalScroll = track.scrollWidth - window.innerWidth;

    const hTween = gsap.to(track, {
      x:    -totalScroll,
      ease: "none",
      scrollTrigger: {
        trigger:      gallery,
        start:        "top top",
        end:          () => `+=${totalScroll}`,
        scrub:        1,
        pin:          true,
        anticipatePin: 1,
        onUpdate(self) {
          const idx = Math.min(
            SPICY_EVENTS.length - 1,
            Math.round(self.progress * (SPICY_EVENTS.length - 1))
          );
          if (counterRef.current) {
            counterRef.current.textContent =
              `${String(idx + 1).padStart(2, "0")} / ${String(SPICY_EVENTS.length).padStart(2, "0")}`;
          }
          if (progressRef.current) {
            progressRef.current.style.transform = `scaleX(${self.progress})`;
          }
        },
      },
    });

    // Inner image parallax per card
    cards.forEach((card) => {
      const imgParallax = card.querySelector<HTMLElement>(".img-parallax");
      if (!imgParallax) return;
      gsap.fromTo(
        imgParallax,
        { xPercent: 9 },
        {
          xPercent: -9,
          ease:     "none",
          scrollTrigger: {
            trigger:           card,
            containerAnimation: hTween,
            start:             "left right",
            end:               "right left",
            scrub:             true,
          },
        }
      );
    });

    // 3-D tilt on hover
    cards.forEach((card) => {
      const onMove = (e: MouseEvent) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        gsap.to(card, {
          rotationY: x * 9, rotationX: -y * 9,
          transformPerspective: 900, duration: 0.35, ease: "power2.out",
        });
      };
      const onLeave = () => {
        gsap.to(card, {
          rotationY: 0, rotationX: 0, duration: 0.55, ease: "power3.out",
        });
      };
      card.addEventListener("mousemove",  onMove);
      card.addEventListener("mouseleave", onLeave);
    });

    return () => {
      lenis.destroy();
      gsap.ticker.remove(tick);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <main style={{ background: "#000", color: "#fff", minHeight: "100vh" }}>

      {/* ── Balatro bg (fiery orange / deep violet) ─────────────────────────── */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <Balatro
          mouseInteraction={false}
          spinSpeed={2.8}
          spinRotation={-1.0}
          color1="#FF5722"
          color2="#7B1FA2"
          color3="#08000f"
          contrast={4.0}
          lighting={0.18}
          spinAmount={0.13}
          pixelFilter={1600}
        />
      </div>

      {/* ── Back button ──────────────────────────────────────────────────────── */}
      <Link
        href="/"
        style={{
          position: "fixed", top: "2rem", left: "2rem", zIndex: 10,
          fontFamily: "'Jost', sans-serif", fontWeight: 300,
          fontSize: "0.85rem", letterSpacing: "0.12em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.55)", textDecoration: "none",
          display: "flex", alignItems: "center", gap: "0.5em", transition: "color 0.2s",
        }}
        onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
        onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
      >
        <span>←</span> NOX
      </Link>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section style={{
        position: "relative", zIndex: 1, height: "100vh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "0 2rem",
      }}>
        <h1
          ref={titleRef}
          style={{
            fontFamily: "'Jost', sans-serif", fontWeight: 200,
            fontSize: "clamp(5rem, 22vw, 22rem)",
            letterSpacing: "-0.02em", lineHeight: 0.88,
            margin: 0, opacity: 0,
          }}
        >
          Spicy
        </h1>

        <p
          ref={subRef}
          style={{
            fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
            fontWeight: 300, fontSize: "clamp(1rem, 2.2vw, 1.6rem)",
            letterSpacing: "0.12em", color: "rgba(255,255,255,0.6)",
            marginTop: "2.5rem", opacity: 0,
          }}
        >
          La noche en su forma más pura
        </p>

        <div
          ref={chevronRef}
          style={{
            position: "absolute", bottom: "3rem", left: "50%",
            transform: "translateX(-50%)", opacity: 0,
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </section>

      {/* ── Gallery (horizontal scroll, pinned) ─────────────────────────────── */}
      <section ref={galleryRef} style={{ position: "relative", zIndex: 1 }}>

        {/* Static label */}
        <div style={{
          position: "absolute", top: "2.4rem",
          left: "clamp(1.5rem, 5vw, 5rem)", zIndex: 2,
          fontFamily: "'Jost', sans-serif", fontWeight: 300,
          fontSize: "0.68rem", letterSpacing: "0.32em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.28)",
        }}>
          Proximos Spicy
        </div>

        {/* Counter */}
        <div
          ref={counterRef}
          style={{
            position: "absolute", top: "2.4rem",
            right: "clamp(1.5rem, 5vw, 5rem)", zIndex: 2,
            fontFamily: "'Jost', sans-serif", fontWeight: 200,
            fontSize: "0.85rem", letterSpacing: "0.15em",
            color: "rgba(255,255,255,0.38)",
          }}
        >
          01 / 08
        </div>

        {/* Sliding track */}
        <div
          ref={trackRef}
          style={{
            display: "flex", alignItems: "center", height: "100vh",
            padding: "0 clamp(1.5rem, 5vw, 5rem)",
            gap: "clamp(1rem, 2vw, 2.2rem)",
            willChange: "transform",
          }}
        >
          {SPICY_EVENTS.map((ev, i) => (
            <div
              key={i}
              className="ev-card"
              style={{
                position: "relative", flexShrink: 0,
                width:  "clamp(270px, 34vw, 460px)",
                height: "clamp(370px, 74vh, 640px)",
                borderRadius: "1.3rem", overflow: "hidden",
                cursor: "pointer",
                transformStyle: "preserve-3d",
                willChange: "transform",
              }}
              onMouseEnter={e => {
                const ov = e.currentTarget.querySelector<HTMLElement>(".ev-overlay");
                if (ov) gsap.to(ov, { y: 0, duration: 0.38, ease: "power2.out" });
              }}
              onMouseLeave={e => {
                const ov = e.currentTarget.querySelector<HTMLElement>(".ev-overlay");
                if (ov) gsap.to(ov, { y: "100%", duration: 0.32, ease: "power2.in" });
              }}
            >
              {/* Image with parallax wrapper */}
              <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: "1.3rem" }}>
                <div
                  className="img-parallax"
                  style={{
                    position: "absolute",
                    top: "-6%", bottom: "-6%",
                    left: "-8%", right: "-8%",
                    width: "116%",
                  }}
                >
                  <Image
                    src={SPICY[i]}
                    alt={ev.title}
                    fill
                    sizes="(max-width: 768px) 270px, 460px"
                    style={{ objectFit: "cover" }}
                    priority={i < 3}
                  />
                </div>
              </div>

              {/* Gradient fade */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: "1.3rem",
                background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 45%, transparent 100%)",
              }} />

              {/* Bottom info */}
              <div style={{
                position: "absolute", bottom: "1.8rem",
                left: "1.8rem", right: "1.8rem",
              }}>
                <div style={{
                  fontFamily: "'Jost', sans-serif", fontWeight: 300,
                  fontSize: "0.62rem", letterSpacing: "0.32em", textTransform: "uppercase",
                  color: "rgba(255,255,255,0.48)", marginBottom: "0.55rem",
                }}>
                  {ev.date} · {ev.time}
                </div>
                <div style={{
                  fontFamily: "'Jost', sans-serif", fontWeight: 200,
                  fontSize: "clamp(1.3rem, 2.8vw, 1.9rem)",
                  letterSpacing: "-0.01em", lineHeight: 1,
                }}>
                  {ev.title}
                </div>
              </div>

              {/* Hover overlay — slides up */}
              <div
                className="ev-overlay"
                style={{
                  position: "absolute", inset: 0, borderRadius: "1.3rem",
                  background: "rgba(0,0,0,0.78)",
                  backdropFilter: "blur(6px)",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  gap: "1.4rem",
                  transform: "translateY(100%)",
                }}
              >
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
                  fontWeight: 300, fontSize: "clamp(1.5rem, 2.8vw, 2rem)",
                  letterSpacing: "0.06em", textAlign: "center",
                  padding: "0 1.5rem",
                }}>
                  {ev.title}
                </div>

                <div style={{
                  fontFamily: "'Jost', sans-serif", fontWeight: 300,
                  fontSize: "0.68rem", letterSpacing: "0.28em", textTransform: "uppercase",
                  color: "rgba(255,255,255,0.55)", textAlign: "center", lineHeight: 2,
                }}>
                  {ev.date}<br />{ev.time}
                </div>

                <span style={{
                  fontFamily: "'Jost', sans-serif", fontWeight: 300,
                  fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase",
                  border: `1px solid ${ev.tag === "SOLD OUT" ? "rgba(255,87,34,0.6)" : "rgba(255,255,255,0.35)"}`,
                  borderRadius: "999px", padding: "0.45em 1.3em",
                  color: ev.tag === "SOLD OUT" ? "#FF5722" : "rgba(255,255,255,0.75)",
                }}>
                  {ev.tag}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: "1.5px", background: "rgba(255,255,255,0.07)", zIndex: 2,
        }}>
          <div
            ref={progressRef}
            style={{
              height: "100%",
              background: "linear-gradient(to right, #FF5722, #7B1FA2)",
              transformOrigin: "left center", transform: "scaleX(0)",
            }}
          />
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer style={{
        position: "relative", zIndex: 1,
        padding: "4rem clamp(1.5rem, 6vw, 6rem)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", flexWrap: "wrap", gap: "1rem",
      }}>
        <span style={{
          fontFamily: "'Jost', sans-serif", fontWeight: 200,
          fontSize: "1.6rem", letterSpacing: "-0.01em",
          color: "rgba(255,255,255,0.8)",
        }}>
          NOX group
        </span>
        <span style={{
          fontFamily: "'Jost', sans-serif", fontWeight: 300,
          fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.2)",
        }}>
          © 2025 — All rights reserved
        </span>
      </footer>
    </main>
  );
}
