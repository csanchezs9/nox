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
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

interface BubbleMenuProps {
  logo?: React.ReactNode;
  onMenuClick?: (open: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
  showTopNav?: boolean;
  showBottomBubble?: boolean;
  menuAriaLabel?: string;
  menuBg?: string;
  menuContentColor?: string;
  useFixedPosition?: boolean;
  items?: MenuItem[];
  animationEase?: string;
  animationDuration?: number;
  staggerDelay?: number;
  forceOpen?: boolean;
}

const DEFAULT_ITEMS: MenuItem[] = [
  { label: "home",     href: "#" },
  { label: "about",    href: "#" },
  { label: "projects", href: "#" },
  { label: "blog",     href: "#" },
  { label: "contact",  href: "#" },
];

export default function BubbleMenu({
  logo,
  onMenuClick,
  className,
  style,
  showTopNav       = true,
  showBottomBubble = true,
  menuAriaLabel     = "Toggle menu",
  menuBg            = "#0d0d0d",
  menuContentColor  = "#ffffff",
  useFixedPosition  = false,
  items,
  animationEase     = "power3.out",
  animationDuration = 0.55,
  staggerDelay      = 0.09,
  forceOpen,
}: BubbleMenuProps) {
  const [isMenuOpen,  setIsMenuOpen]  = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const overlayRef  = useRef<HTMLDivElement>(null);
  const circlesRef  = useRef<SVGSVGElement>(null);
  const itemRefs    = useRef<HTMLAnchorElement[]>([]);
  const closeRef    = useRef<HTMLButtonElement>(null);

  const menuItems = items?.length ? items : DEFAULT_ITEMS;
  const posClass  = useFixedPosition ? "fixed" : "absolute";

  // ── External open/close control ──────────────────────────────────────────
  useEffect(() => {
    if (forceOpen === undefined) return;
    if (forceOpen) {
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

  // ── GSAP animations ───────────────────────────────────────────────────────
  useEffect(() => {
    const overlay = overlayRef.current;
    const circles = circlesRef.current;
    const links   = itemRefs.current.filter(Boolean);
    const closeBtn = closeRef.current;

    if (!overlay) return;

    if (isMenuOpen) {
      gsap.set(overlay, { display: "flex" });
      gsap.killTweensOf([overlay, circles, ...links, closeBtn]);

      gsap.fromTo(overlay,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.35, ease: "power2.out" }
      );

      if (circles) {
        gsap.fromTo(circles,
          { scale: 0, transformOrigin: "50% 50%" },
          { scale: 1, duration: 0.75, ease: "back.out(1.1)", delay: 0.05 }
        );
      }

      gsap.fromTo(
        [...links, closeBtn].filter(Boolean),
        { y: 28, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: animationDuration, ease: animationEase, stagger: staggerDelay, delay: 0.18 }
      );

    } else if (showOverlay) {
      gsap.killTweensOf([overlay, circles, ...links, closeBtn]);

      gsap.to([...links, closeBtn].filter(Boolean), {
        y: 20, autoAlpha: 0, duration: 0.18, ease: "power2.in", stagger: 0.04,
      });

      if (circles) {
        gsap.to(circles, {
          scale: 0, transformOrigin: "50% 50%", duration: 0.28, ease: "power2.in", delay: 0.1,
        });
      }

      gsap.to(overlay, {
        autoAlpha: 0, duration: 0.32, ease: "power2.in", delay: 0.2,
        onComplete: () => {
          gsap.set(overlay, { display: "none" });
          setShowOverlay(false);
        },
      });
    }
  }, [isMenuOpen, showOverlay, animationEase, animationDuration, staggerDelay]);

  return (
    <>
      {/* ── Nav bar ── */}
      <nav
        className={["nox-nav", posClass, !showTopNav ? "nox-nav-hidden" : "", className].filter(Boolean).join(" ")}
        style={style}
        aria-label="Main navigation"
      >
        <div className="nox-nav-logo">{logo}</div>

        <button
          type="button"
          className={`nox-nav-toggle ${isMenuOpen ? "open" : ""}`}
          onClick={handleToggle}
          aria-label={menuAriaLabel}
          aria-pressed={isMenuOpen}
        >
          <span className="toggle-line" />
          <span className="toggle-line" />
        </button>
      </nav>

      {showBottomBubble && (
        <button
          type="button"
          className={`nox-bottom-bubble ${posClass} ${isMenuOpen ? "open" : ""}`}
          onClick={handleToggle}
          aria-label={menuAriaLabel}
          aria-pressed={isMenuOpen}
        >
          <span className="nox-bottom-bubble-core" aria-hidden="true">
            <svg
              className="nox-bottom-bubble-icon"
              viewBox="0 0 64 64"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="6" />
              <circle cx="32" cy="32" r="14" stroke="currentColor" strokeWidth="6" />
              <circle cx="32" cy="32" r="4" fill="currentColor" />
            </svg>
          </span>
        </button>
      )}

      {/* ── Full-screen overlay ── */}
      {showOverlay && (
        <div
          ref={overlayRef}
          className={`nox-overlay ${posClass}`}
          aria-hidden={!isMenuOpen}
          style={{ background: menuBg }}
        >
          {/* Concentric circles */}
          <svg
            ref={circlesRef}
            className="nox-circles"
            viewBox="0 0 600 600"
            aria-hidden="true"
          >
            {[285, 228, 171, 114, 57].map((r, i) => (
              <circle
                key={i}
                cx="300"
                cy="300"
                r={r}
                fill="none"
                stroke={menuContentColor}
                strokeWidth="1"
                opacity={0.08 + i * 0.055}
              />
            ))}
          </svg>

          {/* Items */}
          <ul className="nox-menu-list" role="menu">
            {menuItems.map((item, idx) => (
              <li key={idx} role="none">
                <a
                  role="menuitem"
                  href={item.href}
                  aria-label={item.ariaLabel || item.label}
                  className="nox-menu-link"
                  style={{ color: menuContentColor }}
                  ref={(el) => { if (el) itemRefs.current[idx] = el; }}
                  onClick={item.onClick ? (e) => { e.preventDefault(); item.onClick!(e); } : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* X close button */}
          <button
            ref={closeRef}
            className="nox-close-btn"
            onClick={handleToggle}
            aria-label="Close menu"
            style={{ color: menuContentColor, borderColor: menuContentColor }}
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
