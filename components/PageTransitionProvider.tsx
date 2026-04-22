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
import Balatro from "./Balatro";

// ─── Types ─────────────────────────────────────────────────────────────────

interface TransitionOptions {
  color?:        string;
  showLabel?:    boolean;
  balatroProps?: Record<string, unknown>;
}

interface PageTransitionCtxType {
  triggerTransition: (pillRect: DOMRect, href: string, label: string, opts?: TransitionOptions) => void;
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
  const [transOpts,  setTransOpts]  = useState<TransitionOptions>({});

  const overlayRef   = useRef<HTMLDivElement>(null);
  const labelRef     = useRef<HTMLDivElement>(null);
  const pendingRect  = useRef<DOMRect | null>(null);
  const pendingHref  = useRef<string>("");

  // Stable trigger — just stores args + flips visible
  const triggerTransition = useCallback(
    (pillRect: DOMRect, href: string, label: string, opts: TransitionOptions = {}) => {
      pendingRect.current = pillRect;
      pendingHref.current = href;
      setTransLabel(label);
      setTransOpts(opts);
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
    const { color = "#000", showLabel = true, balatroProps } = transOpts;
    if (!overlay || !labelEl || !rect) return;

    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;

    overlay.style.background = balatroProps ? "transparent" : color;
    overlay.style.opacity    = "1";

    const tl = gsap.timeline();

    // Circle iris expand from click center → covers screen
    tl.fromTo(
      overlay,
      { clipPath: `circle(0% at ${cx}px ${cy}px)` },
      { clipPath: `circle(150% at ${cx}px ${cy}px)`, duration: 0.65, ease: "power3.inOut" },
      0
    );

    // Navigate once circle covers screen
    tl.add(() => router.push(href, { scroll: false }), 0.5);

    // Circle iris collapse — new page bleeds through from same point
    tl.to(overlay, {
      clipPath: `circle(0% at ${cx}px ${cy}px)`,
      duration: 0.7,
      ease: "power3.inOut",
    }, 0.75);

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
            position:      "fixed",
            inset:         0,
            zIndex:        200,
            background:    "#000",
            display:       "flex",
            alignItems:    "center",
            justifyContent:"center",
            pointerEvents: "none",
            overflow:      "hidden",
          }}
        >
          {transOpts.balatroProps && (
            <div style={{ position: "absolute", inset: 0 }}>
              <Balatro {...(transOpts.balatroProps as Parameters<typeof Balatro>[0])} />
            </div>
          )}

          <div
            ref={labelRef}
            style={{
              position:      "relative",
              zIndex:        1,
              fontFamily:    "'Jost', sans-serif",
              fontWeight:    200,
              fontSize:      "clamp(5rem, 22vw, 22rem)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color:         "#fff",
              lineHeight:    1,
              userSelect:    "none",
              opacity:       0,
            }}
          >
            {transLabel}
          </div>
        </div>
      )}
    </PageTransitionCtx.Provider>
  );
}
