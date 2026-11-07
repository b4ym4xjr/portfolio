/**
 * ────────────────────────────────────────────────────────────────
 *  ALL SITE CONTENT LIVES HERE.
 *
 *  Facts taken from the design brief: name, role, MSc Computational
 *  Science, Sudbury ON Canada, 3+ years, 10+ projects, focus areas.
 *
 *  Everything marked PLACEHOLDER is illustrative copy — swap in your
 *  real employers, project names, links, e-mail and socials.
 * ────────────────────────────────────────────────────────────────
 */

export const profile = {
  name: "Sitaram Oli",
  first: "Sitaram",
  last: "Oli",
  role: "Software Engineer",
  intro:
    "I build secure, scalable, and user-centric digital solutions at the intersection of software engineering and cybersecurity.",
  location: "Sudbury, ON",
  country: "Canada",
  timeZone: "America/Toronto",
  // PLACEHOLDER — replace with your real address
  email: "hello@sitaramoli.dev",
  // Drop your real CV at /public/Sitaram-Oli-CV.pdf (same filename) to replace the placeholder.
  cv: "/Sitaram-Oli-CV.pdf",
} as const;

// PLACEHOLDER URLs — point these at your real profiles.
export const socials = [
  { id: "github", label: "GitHub", href: "https://github.com/sitaramoli" },
  { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/sitaramoli" },
  { id: "youtube", label: "YouTube", href: "https://www.youtube.com/@sitaramoli" },
  { id: "x", label: "X", href: "https://x.com/sitaramoli" },
] as const;

export const navItems = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Projects", id: "work" },
  { label: "Expertise", id: "expertise" },
  { label: "Experience", id: "experience" },
  { label: "Contact", id: "contact" },
] as const;

/** Sections that have no nav item of their own highlight a neighbour. */
export const navAlias: Record<string, string> = {
  education: "experience",
};

export const disciplines = [
  "Software Engineering",
  "Cybersecurity",
  "AI / ML",
  "Full-Stack Development",
] as const;

export const about = {
  lead:
    "I'm a software engineer and MSc Computational Science researcher based in Sudbury, Canada. I design systems that are fast, secure and quietly beautiful — from full-stack products to detection pipelines and machine-learning models.",
  story:
    "I started out breaking things to understand them — first code, then networks, then models. Today I build them back stronger: secure by default, scalable by design, and shaped around the people who use them.",
  facts: [
    { k: "Based in", v: "Sudbury, ON — Canada" },
    { k: "Focus", v: "Secure systems & applied ML" },
    { k: "Studying", v: "MSc Computational Science" },
  ],
} as const;

export type Project = {
  index: string;
  title: string;
  kind: string;
  year: string;
  role: string;
  blurb: string;
  stack: string[];
  scene: "orb" | "ridges" | "arch" | "contour";
  tone: "mist" | "ink" | "paper";
  /** tailwind classes positioning the orange geometry that sits on the plate */
  accentClass: string;
  accentShape: "circle" | "square" | "bar" | "half";
  href: string;
};

// PLACEHOLDER projects — rename, re-describe and re-link to your real work.
export const projects: Project[] = [
  {
    index: "01",
    title: "Sentinel",
    kind: "Cybersecurity",
    year: "2026",
    role: "Design & engineering",
    blurb:
      "A real-time threat detection and log-correlation platform that turns noisy telemetry into a short list of things worth waking up for.",
    stack: ["Rust", "Kafka", "Elasticsearch", "React"],
    scene: "orb",
    tone: "mist",
    accentClass: "right-[9%] top-[12%] aspect-square w-[20%]",
    accentShape: "circle",
    href: "https://github.com/sitaramoli",
  },
  {
    index: "02",
    title: "Meridian",
    kind: "AI / ML",
    year: "2025",
    role: "ML engineering",
    blurb:
      "A retrieval-augmented research assistant for scientific literature — grounded answers, cited sources, evaluated against a hand-built benchmark.",
    stack: ["Python", "PyTorch", "RAG", "FastAPI"],
    scene: "ridges",
    tone: "paper",
    accentClass: "left-[10%] top-[8%] h-[26%] w-[2.5%]",
    accentShape: "bar",
    href: "https://github.com/sitaramoli",
  },
  {
    index: "03",
    title: "Halcyon",
    kind: "Software Engineering",
    year: "2025",
    role: "Architecture & backend",
    blurb:
      "A zero-trust access gateway for internal tools: short-lived credentials, policy as code and an audit trail that reads like a sentence.",
    stack: ["TypeScript", "Go", "PostgreSQL", "Docker"],
    scene: "arch",
    tone: "ink",
    accentClass: "left-[8%] bottom-[14%] aspect-square w-[11%]",
    accentShape: "square",
    href: "https://github.com/sitaramoli",
  },
  {
    index: "04",
    title: "Cartograph",
    kind: "AI / ML",
    year: "2024",
    role: "Research & pipeline",
    blurb:
      "A computer-vision pipeline detecting change in satellite imagery — born from MSc coursework in computational science, hardened for scale.",
    stack: ["Python", "NumPy", "scikit-learn", "Docker"],
    scene: "contour",
    tone: "mist",
    accentClass: "right-0 bottom-0 aspect-square w-[34%]",
    accentShape: "half",
    href: "https://github.com/sitaramoli",
  },
];

export type Discipline = {
  index: string;
  title: string;
  lead: string;
  tags: string[];
  shape: "square" | "ring" | "grid";
};

export const expertise: Discipline[] = [
  {
    index: "01",
    title: "Software Engineering",
    lead:
      "Full-stack products, resilient APIs and distributed systems. Clean architecture, typed interfaces and calm deployments.",
    tags: ["TypeScript", "React / Next.js", "Node.js", "Python", "PostgreSQL", "Docker"],
    shape: "square",
  },
  {
    index: "02",
    title: "Cybersecurity",
    lead:
      "Threat modelling, secure-by-design engineering and detection. I think like an attacker so I can build like a defender.",
    tags: ["AppSec", "Pentesting", "SIEM", "Zero Trust", "OWASP", "Cryptography"],
    shape: "ring",
  },
  {
    index: "03",
    title: "AI / ML",
    lead:
      "Applied machine learning for scientific and security data: reproducible pipelines, honest evaluation, models that actually ship.",
    tags: ["PyTorch", "scikit-learn", "LLMs & RAG", "Computer Vision", "NumPy"],
    shape: "grid",
  },
];

export type Job = {
  period: string;
  role: string;
  org: string;
  place: string;
  blurb: string;
  current?: boolean;
};

// PLACEHOLDER roles & organisations — replace with your real history.
export const experience: Job[] = [
  {
    period: "2025 — Now",
    role: "Graduate Researcher",
    org: "Computational Science Lab",
    place: "Sudbury, ON",
    blurb:
      "Researching machine learning for scientific data while building the tooling, pipelines and secure infrastructure around it.",
    current: true,
  },
  {
    period: "2024 — 2025",
    role: "Software Engineer, Security Platform",
    org: "Northline Systems",
    place: "Remote",
    blurb:
      "Shipped detection services and internal tooling used across engineering; cut alert noise by pairing rules with lightweight ML scoring.",
  },
  {
    period: "2023 — 2024",
    role: "Full-Stack Developer",
    org: "Arcadia Digital",
    place: "Remote",
    blurb:
      "Built and launched customer-facing web products end-to-end — typed APIs, accessible interfaces and security reviews before every release.",
  },
];

export type Study = {
  period: string;
  title: string;
  org: string;
  blurb: string;
  big?: boolean;
};

export const education: Study[] = [
  {
    period: "2024 — 2026",
    title: "MSc, Computational Science",
    // PLACEHOLDER institution — verify and edit.
    org: "Laurentian University · Sudbury, ON",
    blurb:
      "Scientific computing, machine learning and secure systems — the research that feeds everything I build.",
    big: true,
  },
  {
    period: "2019 — 2023",
    title: "Bachelor's, Computer Science",
    org: "Undergraduate studies",
    blurb: "Algorithms, operating systems, networks and software design — the foundations.",
  },
  {
    period: "Ongoing",
    title: "Security & ML practice",
    org: "Self-directed",
    blurb: "Capture-the-flag labs, vulnerability write-ups and applied machine-learning coursework.",
  },
];

export const stats = [
  { big: "3+", count: 3, suffix: "+", label: "Years of Experience", icon: null },
  { big: "10+", count: 10, suffix: "+", label: "Projects Delivered", icon: null },
  { big: "MSc", count: null, suffix: "", label: "Computational Science", icon: "cap" },
  { big: "Sudbury, ON", count: null, suffix: "", label: "Canada", icon: "pin" },
] as const;
