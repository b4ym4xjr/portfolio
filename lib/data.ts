export const profile = {
    name: "S.R. Oli",
    first: "S.R.",
    last: "Oli",
    role: "Security Analyst | Software Engineer | Penetration Tester",
    intro:
        "I build secure, scalable, and user-centric digital solutions at the intersection of software engineering and cybersecurity.",
    location: "Sudbury, ON",
    country: "Canada",
    timeZone: "America/Toronto",
    email: "baymaxjr@proton.me",
    cv: "/Sitaram-Oli-CV.pdf",
} as const;

export const socials = [
    {id: "github", label: "GitHub", href: "https://github.com/b4ym4xjr"},
    {id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/sita-ram-oli-a35740208/"},
    {id: "youtube", label: "YouTube", href: "https://www.youtube.com/@MrBaymaxx"},
] as const;

export const navItems = [
    {label: "Home", id: "home"},
    {label: "About", id: "about"},
    {label: "Projects", id: "work"},
    {label: "Expertise", id: "expertise"},
    {label: "Experience", id: "experience"},
    {label: "Contact", id: "contact"},
] as const;

/** Sections that have no nav item of their own highlight a neighbor. */
export const navAlias: Record<string, string> = {
    education: "experience",
};

export const disciplines = [
    "Software Engineering",
    "Cybersecurity"
] as const;

export const about = {
    lead:
        "I'm a software engineer and MSc Computational Science student who designs systems that are fast, secure and quietly beautiful — from full-stack products to security assessments and penetration tests.",
    story:
        "I started out breaking things to understand them — first code, then networks. Today I build them back stronger: secure by default, scalable by design, and shaped around the people who use them.",
    facts: [
        {k: "Focus", v: "Software engineering & cybersecurity"},
        {k: "Toolkit", v: "JavaScript, Python, Java, Bash, PostgreSQL"},
        {k: "Approach", v: "Threat-model first, ship small, measure"},
    ],
} as const;

export type CredentialItem = {
    title: string;
    meta: string;
    href?: string;
};

export const credentials: {
    show: boolean;
    availability: { open: boolean; status: string; response: string };
    groups: { label: string; items: CredentialItem[] }[];
} = {
    show: true,
    availability: {
        open: true,
        status: "Open to opportunities",
        response: "Usually replies within 48 hours",
    },
    groups: [
        {
            label: "Certifications",
            items: [
                {title: "Jr Penetration Tester", meta: "TryHackMe · 2026"},
            ],
        },
        {
            label: "Writing",
            items: [],
        },
    ],
};

export type Project = {
    index: string;
    title: string;
    kind: string;
    year: string;
    role: string;
    /** Optional outcome / metric, shown on the card. */
    result?: string;
    /** Label for the card link, e.g. "Case study" or "Source". Defaults to "View project". */
    linkLabel?: string;
    blurb: string;
    stack: string[];
    /** Optional screenshot from /public (e.g. "/projects/sentinel.jpg"). When set, it replaces the generated halftone scene. */
    image?: string;
    scene: "orb" | "ridges" | "arch" | "parcels";
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
        result: "Cut alert volume by 70% while keeping every true positive", // PLACEHOLDER
        linkLabel: "Case study",
        blurb:
            "A real-time threat detection and log-correlation platform that turns noisy telemetry into a short list of things worth waking up for.",
        stack: ["Rust", "Kafka", "Elasticsearch", "React"],
        // Drop a screenshot in /public/projects and uncomment to replace the generated scene.
        // image: "/projects/sentinel.jpg",
        scene: "orb",
        tone: "mist",
        accentClass: "right-[9%] top-[12%] aspect-square w-[20%]",
        accentShape: "circle",
        href: "https://github.com/b4ym4xjr",
    },
    {
        index: "02",
        title: "Meridian",
        kind: "Cybersecurity",
        year: "2025",
        role: "Security engineering",
        result: "Cut vulnerability triage from hours to minutes", // PLACEHOLDER
        linkLabel: "Source",
        blurb:
            "A vulnerability triage dashboard that ranks scanner findings by exploitability and exposure, so remediation starts with what matters most.",
        stack: ["Python", "FastAPI", "PostgreSQL", "React"],
        // image: "/projects/meridian.jpg",
        scene: "ridges",
        tone: "paper",
        accentClass: "left-[10%] top-[8%] h-[26%] w-[2.5%]",
        accentShape: "bar",
        href: "https://github.com/b4ym4xjr",
    },
    {
        index: "03",
        title: "Halcyon",
        kind: "Software Engineering",
        year: "2025",
        role: "Architecture & backend",
        result: "Replaced long-lived credentials with 15-minute access", // PLACEHOLDER
        linkLabel: "Case study",
        blurb:
            "A zero-trust access gateway for internal tools: short-lived credentials, policy as code and an audit trail that reads like a sentence.",
        stack: ["TypeScript", "Go", "PostgreSQL", "Docker"],
        // image: "/projects/halcyon.jpg",
        scene: "arch",
        tone: "ink",
        accentClass: "left-[8%] bottom-[14%] aspect-square w-[11%]",
        accentShape: "square",
        href: "https://github.com/b4ym4xjr",
    },
    {
        index: "04",
        title: "Cartograph",
        kind: "Software Engineering",
        year: "2025",
        role: "Backend & data",
        result: "Serves a full tile query in under a second", // PLACEHOLDER
        linkLabel: "Source",
        blurb:
            "A scientific data service that ingests large geospatial datasets, normalises them and serves them through a fast, typed API.",
        stack: ["Python", "NumPy", "PostgreSQL", "Docker"],
        // image: "/projects/cartograph.jpg",
        scene: "parcels",
        tone: "mist",
        accentClass: "right-0 bottom-0 aspect-square w-[34%]",
        accentShape: "half",
        href: "https://github.com/b4ym4xjr",
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
        tags: ["TypeScript", "JavaScript", "React", "Next.js", "Node.js", "Python", "Java", "Bash", "PostgreSQL", "MySQL"],
        shape: "square",
    },
    {
        index: "02",
        title: "Cybersecurity",
        lead:
            "Threat modelling, secure-by-design engineering and detection. I think like an attacker so I can build like a defender.",
        tags: ["AppSec", "Pentesting", "SIEM", "Zero Trust", "OWASP", "Cryptography"],
        shape: "ring",
    }
];

export type Job = {
    period: string;
    role: string;
    org: string;
    place: string;
    blurb: string;
    current?: boolean;
};

export const experience: Job[] = [
    {
        period: "May 2024 — Apr 2025",
        role: "Software Engineer",
        org: "Cedargate",
        place: "Nepal",
        // PLACEHOLDER blurb — describe what you actually built and owned here.
        blurb:
            "Analyzed software requirements to develop robust applications and write industrystandard code. I focused on performing unit tests to" +
            " validate functionality and ensure high standards of software\n" +
            "quality. My role involved conducting code reviews to maintain coding efficiency and debug software defects,\n" +
            "resulting in improved system performance. I also produced detailed technical documentation to support\n" +
            "development processes and collaborated on various related tasks to drive project success.",
    },
    {
        period: "May 2023 — May 2024",
        role: "Associate Software Engineer",
        org: "Cedargate",
        place: "Nepal",
        blurb:
            "Developed software solutions in Java, following object-oriented design principles and industry standards. My\n" +
            "role involved implementing UI/UX designs with HTML and CSS, analyzing existing systems, and producing\n" +
            "estimates for enhancements. I worked with SQL databases to create tables, stored procedures, and functions. I\n" +
            "conducted requirement analyses, maintained communication with subject matter experts, documented software\n" +
            "functionality, and explored new APIs to integrate innovative features into our applications, ensuring longevity and\n" +
            "facilitating upgrades.",
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
        period: "2025 — Now",
        title: "MSc, Computational Science",
        org: "Laurentian University · Sudbury, Canada",
        blurb:
            "Graduate study in computational science, alongside my software engineering and security practice.",
        big: true,
    },
    {
        period: "Completed 2021",
        title: "Bachelor's, Computer Engineering",
        org: "Tribhuvan University · Nepal",
        blurb: "Foundations in programming, computer systems, networks and software design.",
    },
];

export const stats = [
    {big: "2", count: 2, suffix: "", label: "Years of Experience", icon: null},
    {big: "10+", count: 10, suffix: "+", label: "Projects Delivered", icon: null},
    {big: "MSc", count: null, suffix: "", label: "Computational Science", icon: "cap"},
    {big: "Sudbury, ON", count: null, suffix: "", label: "Canada", icon: "pin"},
] as const;
