"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

// ─── Types ─────────────────────────────────────────────────────────────────

interface PageTransitionCtxType {
  /** Call this to trigger a zoom-in transition from a pill to a new route */
  triggerTransition: (pillRect: DOMRect, href: string, label: string) => void;
}

// ─── Context ────────────────────────────────────────────────────────────────

const PageTransitionCtx = createContext<PageTransitionCtxType>({
  triggerTransition: () => {},
});

export function usePageTransition() {
  return useContext(PageTransitionCtx);
}

// ─── Provider + persistent overlay ─────────────────────────────────────────

export function PageTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [visible,    setVisible]    = useState(false);
  const [transLabel, setTransLabel] = useState("");

  const overlayRef   = useRef<HTMLDivElement>(null);
  const labelRef     = useRef<HTMLDivElement>(null);
  const pendingRect  = useRef<DOMRect | null>(null);
  const pendingHref  = useRef<string>("");

  // Stable trigger — just stores args + flips visible
  const triggerTransition = useCallback(
    (pillRect: DOMRect, href: string, label: string) => {
      pendingRect.current = pillRect;
      pendingHref.current = href;
      setTransLabel(label);
      setVisible(true);
    },
    []
  );

  // Runs AFTER the overlay div mounts in the DOM
  useEffect(() => {
    if (!visible) return;

    const overlay = overlayRef.current;
    const labelEl = labelRef.current;
    const rect    = pendingRect.current;
    const href    = pendingHref.current;
    if (!overlay || !labelEl || !rect) return;

    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;

    // The entire overlay scales from the pill's center outward
    overlay.style.transformOrigin = `${cx}px ${cy}px`;

    const tl = gsap.timeline();

    // Phase 1 — overlay pops from pill, fills screen (fast, 0.28s)
    tl.fromTo(
      overlay,
      { scale: 0.01, opacity: 1 },
      { scale: 1,    duration: 0.28, ease: "power4.in" },
      0
    );

    // Phase 2 — label text appears while overlay covers everything (0.2s)
    tl.fromTo(
      labelEl,
      { scale: 0.4, opacity: 0 },
      { scale: 1,   opacity: 1, duration: 0.2, ease: "power2.out" },
      0.15
    );

    // Phase 3 — navigate at 0.32s (screen is black, transition invisible)
    tl.add(() => router.push(href, { scroll: false }), 0.32);

    // Phase 4 — VERY SLOWLY fade the overlay out (0.9s).
    // As opacity drops, the new page's content bleeds through —
    // the red Balatro on /inside gradually replaces the black.
    tl.to(overlay, {
      opacity: 0,
      duration: 0.9,
      ease: "power1.inOut",
    }, 0.52);

    // Phase 5 — unmount overlay once fully transparent
    tl.add(() => setVisible(false), 1.5);

    return () => { tl.kill(); };
  }, [visible, router]);

  return (
    <PageTransitionCtx.Provider value={{ triggerTransition }}>
      {children}

      {/* Persistent overlay — survives route changes because it lives in layout */}
      {visible && (
        <div
          ref={overlayRef}
          style={{
            position:       "fixed",
            inset:          0,
            zIndex:         200,
            background:     "#000",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            pointerEvents:  "none",
          }}
        >
          <div
            ref={labelRef}
            style={{
              fontFamily:    "'Jost', sans-serif",
              fontWeight:    200,
              fontSize:      "clamp(5rem, 22vw, 22rem)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color:         "#fff",
              lineHeight:    1,
              userSelect:    "none",
              opacity:       0,       // GSAP brings it to 1
            }}
          >
            {transLabel}
          </div>
        </div>
      )}
    </PageTransitionCtx.Provider>
  );
}
