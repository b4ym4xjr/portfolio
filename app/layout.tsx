import type {Metadata, Viewport} from "next";
import {Inter_Tight, Instrument_Serif, JetBrains_Mono} from "next/font/google";
import {Shell} from "@/components/Shell";
import {siteUrl} from "@/lib/site";
import "./globals.css";
import React from "react";

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
    metadataBase: new URL(siteUrl),
    title: "S.R. Oli — Security Analyst | Software Engineer | Penetration Tester",
    description:
        "Portfolio of Sitaram Oli, a software engineer building secure, scalable and user-centric digital solutions across software engineering" +
        " and cybersecurity",
    openGraph: {
        title: "Sitaram Oli — Security Analyst | Software Engineer | Penetration Tester",
        description:
            "Secure, scalable and user-centric digital solutions at the intersection of software engineering and cybersecurity.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Sitaram Oli — Security Analyst | Software Engineer | Penetration Tester",
        description:
            "Secure, scalable and user-centric digital solutions at the intersection of software engineering and cybersecurity.",
    },
};

export const viewport: Viewport = {
    themeColor: "#F8F7F4",
};

export default function RootLayout({children}: { children: React.ReactNode; }) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={`${sans.variable} ${serif.variable} ${mono.variable}`}
        >
        <head>
            <script
                dangerouslySetInnerHTML={{
                    __html: `try{if(sessionStorage.getItem("preloaded")==="1")document.documentElement.setAttribute("data-visited","")}catch(e){}`,
                }}
            />
        </head>
        <body className="grain bg-paper text-ink antialiased">
        <Shell>{children}</Shell>
        </body>
        </html>
    );
}
