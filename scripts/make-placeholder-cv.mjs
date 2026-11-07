// Generates a one-page placeholder CV (plain PDF, no dependencies).
// Replace public/Sitaram-Oli-CV.pdf with your real CV; this script is optional.
import { writeFileSync, mkdirSync } from "node:fs";

const lines = [
  ["F2", 26, "Sitaram Oli"],
  ["F1", 12, "Software Engineer  |  Sudbury, ON, Canada"],
  ["F1", 10, "hello@sitaramoli.dev"],
  [null],
  ["F2", 11, "PROFILE"],
  ["F1", 10, "Builds secure, scalable, user-centric digital solutions at the intersection of"],
  ["F1", 10, "software engineering and cybersecurity. 3+ years of experience, 10+ projects delivered."],
  [null],
  ["F2", 11, "FOCUS"],
  ["F1", 10, "Software Engineering  /  Cybersecurity  /  AI-ML  /  Full-Stack Development"],
  [null],
  ["F2", 11, "EDUCATION"],
  ["F1", 10, "MSc, Computational Science  (2024 - 2026)"],
  [null],
  ["F2", 11, "NOTE"],
  ["F1", 10, "This is a placeholder CV. Replace public/Sitaram-Oli-CV.pdf with your own."],
];

let y = 780;
let stream = "";
for (const l of lines) {
  if (l[0] === null) {
    y -= 12;
    continue;
  }
  const [font, size, text] = l;
  const esc = text.replace(/[\\()]/g, "\\$&");
  stream += `BT /${font} ${size} Tf 56 ${y} Td (${esc}) Tj ET\n`;
  y -= size + 8;
}
// thin orange rule under the name
stream += "1 0.353 0.122 RG 2 w 56 745 m 180 745 l S\n";

const objs = [
  "<< /Type /Catalog /Pages 2 0 R >>",
  "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
  "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>",
  `<< /Length ${stream.length} >>\nstream\n${stream}endstream`,
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
];

let pdf = "%PDF-1.4\n";
const offsets = [];
objs.forEach((o, i) => {
  offsets.push(pdf.length);
  pdf += `${i + 1} 0 obj\n${o}\nendobj\n`;
});
const xref = pdf.length;
pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
for (const off of offsets) pdf += `${String(off).padStart(10, "0")} 00000 n \n`;
pdf += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;

mkdirSync("public", { recursive: true });
writeFileSync("public/Sitaram-Oli-CV.pdf", pdf, "latin1");
console.log("wrote public/Sitaram-Oli-CV.pdf");
