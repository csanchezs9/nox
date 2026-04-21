"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import "./BubbleMenu.css";

interface HoverStyles {
  bgColor?: string;
  textColor?: string;
}

export interface MenuItem {
  label: string;
  href: string;
  ariaLabel?: string;
  rotation?: number;
  hoverStyles?: HoverStyles;
  /** If provided, called instead of following href */
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

interface BubbleMenuProps {
  logo?: React.ReactNode;
  onMenuClick?: (open: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
  menuAriaLabel?: string;
  menuBg?: string;
  menuContentColor?: string;
  useFixedPosition?: boolean;
  items?: MenuItem[];
  animationEase?: string;
  animationDuration?: number;
  staggerDelay?: number;
  /**
   * When provided, controls open/close from the outside — no click needed.
   * true = open, false = close. Passing undefined = uncontrolled (manual click).
   */
  forceOpen?: boolean;
}

const DEFAULT_ITEMS: MenuItem[] = [
  { label: "home",     href: "#", ariaLabel: "Home",     rotation: -8, hoverStyles: { bgColor: "#3b82f6", textColor: "#ffffff" } },
  { label: "about",    href: "#", ariaLabel: "About",    rotation:  8, hoverStyles: { bgColor: "#10b981", textColor: "#ffffff" } },
  { label: "projects", href: "#", ariaLabel: "Projects", rotation:  8, hoverStyles: { bgColor: "#f59e0b", textColor: "#ffffff" } },
  { label: "blog",     href: "#", ariaLabel: "Blog",     rotation:  8, hoverStyles: { bgColor: "#ef4444", textColor: "#ffffff" } },
  { label: "contact",  href: "#", ariaLabel: "Contact",  rotation: -8, hoverStyles: { bgColor: "#8b5cf6", textColor: "#ffffff" } },
];

export default function BubbleMenu({
  logo,
  onMenuClick,
  className,
  style,
  menuAriaLabel     = "Toggle menu",
  menuBg            = "#fff",
  menuContentColor  = "#111",
  useFixedPosition  = false,
  items,
  animationEase     = "back.out(1.5)",
  animationDuration = 0.5,
  staggerDelay      = 0.12,
  forceOpen,
}: BubbleMenuProps) {
  const [isMenuOpen,  setIsMenuOpen]  = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const overlayRef  = useRef<HTMLDivElement>(null);
  const bubblesRef  = useRef<HTMLAnchorElement[]>([]);
  const labelRefs   = useRef<HTMLSpanElement[]>([]);

  const menuItems      = items?.length ? items : DEFAULT_ITEMS;
  const posClass       = useFixedPosition ? "fixed" : "absolute";
  const containerClass = ["bubble-menu", posClass, className].filter(Boolean).join(" ");

  // ── External open/close control ──────────────────────────────────────────
  useEffect(() => {
    if (forceOpen === undefined) return; // uncontrolled mode — manual click only
    if (forceOpen) {
      // React 18 auto-batches these two setState calls → single re-render
      setShowOverlay(true);
      setIsMenuOpen(true);
    } else {
      setIsMenuOpen(false);
    }
  }, [forceOpen]);

  // ── Manual toggle ─────────────────────────────────────────────────────────
  const handleToggle = () => {
    const next = !isMenuOpen;
    if (next) setShowOverlay(true);
    setIsMenuOpen(next);
    onMenuClick?.(next);
  };

  // ── GSAP open / close animations ─────────────────────────────────────────
  useEffect(() => {
    const overlay = overlayRef.current;
    const bubbles = bubblesRef.current.filter(Boolean);
    const labels  = labelRefs.current.filter(Boolean);

    if (!overlay || !bubbles.length) return;

    if (isMenuOpen) {
      gsap.set(overlay, { display: "flex" });
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.set(bubbles, { scale: 0, transformOrigin: "50% 50%" });
      gsap.set(labels,  { y: 24, autoAlpha: 0 });

      bubbles.forEach((bubble, i) => {
        const delay = i * staggerDelay + gsap.utils.random(-0.05, 0.05);
        const tl    = gsap.timeline({ delay });

        tl.to(bubble, {
          scale:    1,
          duration: animationDuration,
          ease:     animationEase,
        });

        if (labels[i]) {
          tl.to(
            labels[i],
            { y: 0, autoAlpha: 1, duration: animationDuration, ease: "power3.out" },
            `-=${animationDuration * 0.9}`
          );
        }
      });
    } else if (showOverlay) {
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.to(labels,  { y: 24, autoAlpha: 0, duration: 0.2, ease: "power3.in" });
      gsap.to(bubbles, {
        scale:    0,
        duration: 0.2,
        ease:     "power3.in",
        onComplete: () => {
          gsap.set(overlay, { display: "none" });
          setShowOverlay(false);
        },
      });
    }
  }, [isMenuOpen, showOverlay, animationEase, animationDuration, staggerDelay]);

  // ── Keep desktop rotations correct on resize ──────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      if (!isMenuOpen) return;
      const isDesktop = window.innerWidth >= 900;
      bubblesRef.current.filter(Boolean).forEach((bubble, i) => {
        const item = menuItems[i];
        if (item) gsap.set(bubble, { rotation: isDesktop ? (item.rotation ?? 0) : 0 });
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMenuOpen, menuItems]);

  return (
    <>
      <nav className={containerClass} style={style} aria-label="Main navigation">
        {/* Logo bubble */}
        <div className="bubble logo-bubble" aria-label="Logo" style={{ background: menuBg }}>
          <span className="logo-content">
            {typeof logo === "string"
              ? <img src={logo} alt="Logo" className="bubble-logo" />
              : logo}
          </span>
        </div>

        {/* Toggle button */}
        <button
          type="button"
          className={`bubble toggle-bubble menu-btn ${isMenuOpen ? "open" : ""}`}
          onClick={handleToggle}
          aria-label={menuAriaLabel}
          aria-pressed={isMenuOpen}
          style={{ background: menuBg }}
        >
          <span className="menu-line" style={{ background: menuContentColor }} />
          <span className="menu-line short" style={{ background: menuContentColor }} />
        </button>
      </nav>

      {/* Pill overlay — only in DOM when showOverlay */}
      {showOverlay && (
        <div
          ref={overlayRef}
          className={`bubble-menu-items ${posClass}`}
          aria-hidden={!isMenuOpen}
        >
          <ul className="pill-list" role="menu" aria-label="Menu links">
            {menuItems.map((item, idx) => (
              <li key={idx} role="none" className="pill-col">
                <a
                  role="menuitem"
                  href={item.href}
                  aria-label={item.ariaLabel || item.label}
                  className="pill-link"
                  style={{
                    "--item-rot":   `${item.rotation ?? 0}deg`,
                    "--pill-bg":    menuBg,
                    "--pill-color": menuContentColor,
                    "--hover-bg":   item.hoverStyles?.bgColor   || "#f3f4f6",
                    "--hover-color":item.hoverStyles?.textColor || menuContentColor,
                  } as React.CSSProperties}
                  ref={(el) => { if (el) bubblesRef.current[idx] = el; }}
                  onClick={item.onClick ? (e) => { e.preventDefault(); item.onClick!(e); } : undefined}
                >
                  <span
                    className="pill-label"
                    ref={(el) => { if (el) labelRefs.current[idx] = el; }}
                  >
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
