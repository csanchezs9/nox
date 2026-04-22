import type { Metadata } from "next";
import "./globals.css";
import { PageTransitionProvider } from "@/components/PageTransitionProvider";

export const metadata: Metadata = {
  title: "NOX Group",
  description: "Experiences that transcend the night.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Jost:wght@100;200;300;400&family=Cormorant+Garamond:ital,wght@1,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-black text-white">
        <PageTransitionProvider>{children}</PageTransitionProvider>
      </body>
    </html>
  );
}
