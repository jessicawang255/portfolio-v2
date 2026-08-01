export type TocSection = {
  title: string
  // Nested entries rendered indented under this section, for sections split
  // into multiple `<Section>`s in the content file (marked `primary={false}`).
  subsections?: string[]
}

export type Project = {
  slug: string
  title: string
  name?: string
  status?: string
  year?: number
  disciplines?: string[]
  bg: string
  accent?: string
  thumbnail?: string
  thumbnailWidth?: number
  thumbnailHeight?: number
  // External destination (live site, GitHub, Devpost, etc). Falls back to
  // the internal /work/{slug} case study page when omitted.
  href?: string
  // Case study detail fields
  role?: string
  timeline?: string
  team?: string[]
  skills?: string[]
  toc?: TocSection[]
}

export const discoverItems: Project[] = [
  {
    slug: "google-calendar",
    href: "https://www.figma.com/proto/bT2pWyNdvFSlDzzptTRZwG/Google-Calendar-Enhanced-Task-Management---2024-Ivey-Product-Society-Fellowship?node-id=38-346&p=f&viewport=177%2C357%2C0.08&t=YiZsyTmCXOvIMEG1-9&scaling=contain&content-scaling=fixed&starting-point-node-id=38%3A346&page-id=25%3A44&show-proto-sidebar=1",
    title: "Google Calendar enhanced task management",
    status: "Fellowship project",
    bg: "#D6F0FF",
    thumbnail: "/images/discover/gcal.svg",
    thumbnailWidth: 260,
    thumbnailHeight: 140,
  },
  {
    slug: "snippets",
    href: "https://devpost.com/software/snippets-m4sc5i",
    title: "Snippets",
    status: "Hack the 6ix 2024 project",
    bg: "#F6F0E6",
    thumbnail: "/images/discover/snippets.png",
    thumbnailWidth: 1360,
    thumbnailHeight: 900,
  },
  {
    slug: "hack-western",
    href: "https://www.hackwestern.com",
    title: "Hack Western",
    status: "Design lead",
    bg: "#ECE3FC",
    thumbnail: "/images/discover/hack-western.svg",
    thumbnailWidth: 230,
    thumbnailHeight: 200,
  },
  {
    slug: "syllabud",
    href: "https://dorahacks.io/buidl/21423",
    title: "Syllabud",
    status: "SheHacks+ 9 project",
    bg: "linear-gradient(135deg, #8ecdf0, #8ff0d4)",
    thumbnail: "/images/discover/syllabud.svg",
    thumbnailWidth: 400,
    thumbnailHeight: 250,
  },
]

export const projects: Project[] = [
  {
    slug: "hack-western",
    title: "Designing an inviting application experience for 2,000 hackers",
    name: "Hack Western",
    status: "Shipped 2025",
    year: 2025,
    disciplines: ["Visual design", "User testing"],
    bg: "#F5E8F7",
    accent: "hack-western",
    thumbnail: "/images/case-studies/hack-western/hw-thumbnail.mp4",
    thumbnailWidth: 1600,
    thumbnailHeight: 1134,
    role: "Product Designer",
    timeline: "Sep – Dec 2024",
    team: ["1 design lead", "2 designers"],
    skills: ["Visual design", "User testing", "Prototyping"],
    toc: [
      { title: "Overview" },
      { title: "Challenge" },
      { title: "Theme" },
      { title: "App. Portal Ideation", subsections: ["Revamping the User Flow", "Wireframing"] },
      { title: "Designing for Mobile" },
      { title: "Stickerbook" },
      { title: "Final Product" },
      {title: "Reflections" },
    ],
  },
  {
    slug: "retrospect",
    title: "A digital time capsule to capture memories with friends",
    name: "Retrospect",
    status: "Demoed 2025",
    year: 2025,
    disciplines: ["Interaction design", "Prototyping"],
    bg: "#0d1240",
    accent: "retrospect",
    thumbnail: "/images/case-studies/retrospect/retrospect-thumbnail.mp4",
    thumbnailWidth: 1600,
    thumbnailHeight: 932,
    role: "Product Designer",
    timeline: "Aug 2024 - Feb 2025",
    team: ["1 product manager", "2 designers", "4 engineers"],
    skills: ["Interaction design", "Prototyping", "User testing"],
    toc: [
      { title: "Overview" },
      { title: "Inspiration" },
      { title: "Research", subsections: ["Competitive Analysis"] },
      { title: "Core App Flows", subsections: ["Creating a Capsule", "Collaboration User Flow"] },
      { title: "Final Product" },
      {title: "Reflections" },
    ],
  },
  {
    slug: "autumn",
    title: "Boosting discovery for a grief support platform",
    name: "Autumn",
    status: "Shipped 2024",
    year: 2024,
    disciplines: ["Business strategy", "UX design"],
    bg: "#E8E7E1",
    accent: "autumn",
    role: "Product Designer",
    timeline: "Jun - Aug 2024",
    team: ["1 founder", "1 product designer", "2 product managers", "2 developers"],
    skills: ["Product design", "User research", "Prototyping"],
    toc: [
      { title: "Overview" },
      { title: "Problem" },
      { title: "Understanding the Market" },
      { title: "Adding User Touchpoints" },
      { title: "Design Challenges", subsections: ["Design Challenge #1", "Design Challenge #2"] },
      { title: "Final Product" },
      { title: "Reflections"}
    ],
  },
  {
    slug: "glucal",
    title: "Easing the daily burdens of diabetes management",
    name: "gluCal",
    status: "Showcased 2024",
    year: 2024,
    disciplines: ["User research", "Mobile design"],
    bg: "#FFE4E4",
    accent: "glucal",
    role: "Sole designer, Developer",
    timeline: "Mar - Apr 2024",
    team: ["1 designer", "1 developer"],
    skills: ["User research", "Prototyping", "Mobile dev"],
    toc: [
      { title: "Problem" },
      { title: "Solution" },
      { title: "Research" },
      { title: "Competitive Analysis" },
      { title: "Design Decisions" },
      { title: "Final Product" },
      { title: "Next Steps"},
      { title: "Reflections"},
    ],
  },
]
