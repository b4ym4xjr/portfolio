import {ImageResponse} from "next/og";

export const alt = "S.R. Oli — Security Analyst | Software Engineer | Penetration Tester";
export const size = {width: 1200, height: 630};
export const contentType = "image/png";

const INK = "#111111";
const PAPER = "#F8F7F4";
const ACCENT = "#FF5A1F";
const MIST = "#E8E7E3";

export default function OpengraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    background: PAPER,
                    color: INK,
                    padding: 56,
                    position: "relative",
                    fontFamily: "sans-serif",
                }}
            >
                {/* geometry */}
                <div
                    style={{
                        position: "absolute",
                        right: -60,
                        top: 70,
                        width: 520,
                        height: 520,
                        borderRadius: 9999,
                        background: MIST,
                        display: "flex",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        right: 150,
                        top: 120,
                        width: 250,
                        height: 250,
                        borderRadius: 9999,
                        background: ACCENT,
                        display: "flex",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        right: 56,
                        bottom: 56,
                        width: 150,
                        height: 150,
                        background: INK,
                        borderTopLeftRadius: 150,
                        display: "flex",
                    }}
                />

                {/* top bar */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: `2px solid ${INK}`,
                        paddingBottom: 20,
                        fontSize: 22,
                        letterSpacing: 4,
                        textTransform: "uppercase",
                    }}
                >
                    <div style={{display: "flex", fontSize: 40, fontWeight: 800, letterSpacing: -2}}>
                        S<span style={{color: ACCENT}}>/</span>O
                    </div>
                    <div style={{display: "flex"}}>Portfolio {new Date().getFullYear()}</div>
                </div>

                {/* name */}
                <div style={{display: "flex", flexDirection: "column"}}>
                    <div style={{display: "flex", fontSize: 38, fontStyle: "italic", marginBottom: 6}}>Hi, I’m</div>
                    <div
                        style={{
                            display: "flex",
                            fontSize: 190,
                            fontWeight: 800,
                            lineHeight: 0.85,
                            letterSpacing: -10,
                        }}
                    >
                        S.R. Oli
                        <span style={{color: ACCENT}}>.</span>
                    </div>
                </div>

                {/* footer line */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 18,
                        fontSize: 26,
                        letterSpacing: 3,
                        textTransform: "uppercase",
                    }}
                >
                    <div style={{width: 16, height: 16, background: ACCENT, display: "flex"}}/>
                    Software Engineering · Cybersecurity
                </div>
            </div>
        ),
        {...size},
    );
}
