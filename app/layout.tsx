import type { Metadata, Viewport } from "next";
import { Inter_Tight, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { Shell } from "@/components/Shell";
import "./globals.css";

const sans = Inter_Tight({
  variable: "--font-sans-src",
  subsets: ["latin"],
  display: "swap",
});

const serif = Instrument_Serif({
  variable: "--font-serif-src",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono-src",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sitaram Oli — Software Engineer",
  description:
    "Portfolio of Sitaram Oli, a software engineer building secure, scalable and user-centric digital solutions across software engineering, cybersecurity and AI/ML.",
  openGraph: {
    title: "Sitaram Oli — Software Engineer",
    description:
      "Secure, scalable and user-centric digital solutions at the intersection of software engineering and cybersecurity.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#F8F7F4",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} ${mono.variable}`}
    >
      <body className="grain bg-paper text-ink antialiased">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
