"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Balatro from "@/components/Balatro";

const ownerImage = "/images/owners/490300441_18505615783036380_1886890642787923809_n.jpg";

export default function NosotrosPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main style={{ background: "#000", color: "#fff", minHeight: "100vh", position: "relative" }}>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <Balatro
          mouseInteraction={false}
          spinSpeed={2.2}
          spinRotation={-0.65}
          color1="#121212"
          color2="#060606"
          color3="#000000"
          contrast={2.6}
          lighting={0.15}
          spinAmount={0.12}
          pixelFilter={2000}
        />
      </div>

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 15% 15%, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 35%), radial-gradient(circle at 85% 80%, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 40%)",
        }}
      />

      <Link
        href="/"
        style={{
          position: "fixed",
          top: "2rem",
          left: "2rem",
          zIndex: 10,
          fontFamily: "'Jost', sans-serif",
          fontWeight: 300,
          fontSize: "0.85rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.62)",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: "0.5em",
          transition: "color 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.62)")}
      >
        <span style={{ fontSize: "1em" }}>&#8592;</span> NOX
      </Link>

      <section
        style={{
          position: "relative",
          zIndex: 2,
          minHeight: "100vh",
          padding: "clamp(6rem, 10vw, 8rem) clamp(1.2rem, 5vw, 5rem) clamp(2.5rem, 4vw, 4rem)",
          display: "grid",
          gap: "clamp(1.5rem, 3vw, 3rem)",
          alignItems: "center",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.58)",
              marginBottom: "1rem",
            }}
          >
            Nosotros
          </p>

          <h1
            style={{
              fontFamily: "'Jost', sans-serif",
              fontWeight: 200,
              lineHeight: 0.92,
              letterSpacing: "-0.02em",
              fontSize: "clamp(2.2rem, 7vw, 6rem)",
              marginBottom: "1.25rem",
            }}
          >
            Laboratorio de
            <br />
            experiencias
          </h1>

          <p
            style={{
              maxWidth: "46ch",
              fontFamily: "'Jost', sans-serif",
              fontWeight: 300,
              color: "rgba(255,255,255,0.86)",
              lineHeight: 1.6,
              fontSize: "clamp(0.95rem, 1.6vw, 1.08rem)",
            }}
          >
            NOX es una empresa de eventos de discotecas. Dise&#241;amos noches con narrativa, sonido y energ&#237;a:
            eventos, m&#250;sica y momentos que se quedan contigo mucho despu&#233;s del &#250;ltimo beat.
          </p>
        </div>

        <div
          style={{
            justifySelf: "center",
            width: "min(460px, 100%)",
            position: "relative",
            borderRadius: "24px",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.2)",
            boxShadow: "0 30px 90px rgba(0,0,0,0.55)",
            aspectRatio: "4 / 5",
          }}
        >
          <Image src={ownerImage} alt="Owners NOX" fill style={{ objectFit: "cover" }} priority />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0) 40%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "1rem",
              right: "1rem",
              bottom: "1rem",
              fontFamily: "'Jost', sans-serif",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.6rem",
            }}
          >
            <span style={{ fontSize: "0.82rem", letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.9 }}>
              Owners
            </span>
            <span style={{ fontSize: "0.82rem", opacity: 0.75 }}>NOX Group</span>
          </div>
        </div>
      </section>

      <section
        style={{
          position: "relative",
          zIndex: 2,
          padding: "0 clamp(1.2rem, 5vw, 5rem) clamp(4rem, 6vw, 6rem)",
        }}
      >
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: "24px",
            background: "rgba(10,10,10,0.55)",
            backdropFilter: "blur(8px)",
            padding: "clamp(1.25rem, 3vw, 2.4rem)",
            display: "grid",
            gap: "1.2rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          }}
        >
          {[
            {
              title: "Experiencias",
              text: "Conceptualizamos cada fecha como un universo propio: sonido, visuales y atmósfera alineados.",
            },
            {
              title: "Eventos",
              text: "Producimos fiestas que conectan comunidad, artistas y audiencia con una identidad clara.",
            },
            {
              title: "Música y momentos",
              text: "Curamos line-ups y ritmos para que cada noche tenga memoria emocional real.",
            },
          ].map((item) => (
            <article
              key={item.title}
              style={{
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "16px",
                padding: "1rem",
                background: "rgba(0,0,0,0.45)",
              }}
            >
              <h2
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "1.08rem",
                  fontWeight: 400,
                  marginBottom: "0.55rem",
                }}
              >
                {item.title}
              </h2>
              <p
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "0.95rem",
                  lineHeight: 1.55,
                  color: "rgba(255,255,255,0.78)",
                }}
              >
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        style={{
          position: "relative",
          zIndex: 2,
          padding: "0 clamp(1.2rem, 5vw, 5rem) clamp(5rem, 7vw, 7rem)",
        }}
      >
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.18)",
            paddingTop: "2rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.9rem",
            alignItems: "end",
            justifyContent: "space-between",
          }}
        >
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "clamp(1.6rem, 4.5vw, 3rem)",
              lineHeight: 1,
            }}
          >
            La noche nos pertenece.
          </p>
          <span
            style={{
              fontFamily: "'Jost', sans-serif",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              fontSize: "0.72rem",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            NOX IG bio
          </span>
        </div>
      </section>
    </main>
  );
}
