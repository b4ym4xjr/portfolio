import fs from "node:fs";
import path from "node:path";
import {About} from "@/components/About";
import {Contact} from "@/components/Contact";
import {Education} from "@/components/Education";
import {Experience} from "@/components/Experience";
import {Expertise} from "@/components/Expertise";
import {Header} from "@/components/Header";
import {Hero} from "@/components/Hero";
import {Marquee} from "@/components/Marquee";
import {Work} from "@/components/Work";

/**
 * Looks for a user-supplied portrait in /public. Drop in `portrait.jpg`
 * (or .jpeg / .png / .webp) and it replaces the halftone placeholder.
 */
function findPortrait(): string | null {
    for (const file of ["portrait.jpg", "portrait.jpeg", "portrait.png", "portrait.webp"]) {
        if (fs.existsSync(path.join(process.cwd(), "public", file))) return `/${file}`;
    }
    return null;
}

export default function Home() {
    return (
        <>
            <Header/>
            <main id="main" tabIndex={-1} className="outline-none">
                <Hero portraitSrc={findPortrait()}/>
                <Marquee className="mt-6 border-y border-ink/20 py-5 text-[clamp(2rem,4.6vw,4.4rem)] font-bold uppercase tracking-tighter"/>
                <About/>
                <Work/>
                <Expertise/>
                <Experience/>
                <Education/>
                <Contact/>
            </main>
        </>
    );
}
