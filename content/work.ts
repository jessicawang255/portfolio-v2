export type Project = {
  slug: string
  title: string
  name?: string
  status?: string
  year?: number
  disciplines?: string[]
  bg: string
  accent?: string
  image?: string
  // Case study detail fields
  role?: string
  timeline?: string
  team?: string
  skills?: string
  toc?: string[]
}

export const discoverItems: Project[] = [
  {
    slug: "google-calendar",
    title: "Google Calendar Enhanced Task Management",
    bg: "#e8e4f0",
  },
  {
    slug: "hack-western",
    title: "Hack Western",
    bg: "#e4ede8",
  },
  {
    slug: "snippets",
    title: "Snippets",
    bg: "#f0ece4",
  },
  {
    slug: "syllabud",
    title: "Syllabud",
    bg: "#eceaf4",
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
    bg: "#eae6f4",
    accent: "hack-western",
    role: "Product Designer",
    timeline: "Sep – Dec 2024",
    team: "1 design lead, 2 designers",
    skills: "Visual design, User testing, Prototyping",
    toc: ["Overview", "Challenge", "Theme", "App. Portal Ideation", "Designing for Mobile", "Stickerbook", "Final Product"],
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
    role: "Product Designer",
    timeline: "Aug 2024 - Feb 2025",
    team: "1 product manager, 2 designers, 4 engineers",
    skills: "Interaction design, Prototyping, User testing",
    toc: ["Overview", "Inspiration", "Research", "Core App Flows", "Final Product"],
  },
  {
    slug: "autumn",
    title: "Boosting discovery for a grief support platform",
    name: "Autumn",
    status: "Shipped 2024",
    year: 2024,
    disciplines: ["Business strategy", "UX design"],
    bg: "#c8cfc0",
    accent: "autumn",
    role: "Product Designer",
    timeline: "Jun - Aug 2024",
    team: "1 founder, 1 product designer, 2 product managers, 2 developers",
    skills: "Product design, User research, Prototyping",
    toc: ["Overview", "Problem", "Understanding the Market", "User Touchpoints", "Design Challenges", "Final Product"],
  },
  {
    slug: "glucal",
    title: "Easing the daily burdens of diabetes management",
    name: "gluCal",
    status: "Showcased 2024",
    year: 2024,
    disciplines: ["User research", "Mobile design"],
    bg: "linear-gradient(160deg, #f9dede 0%, #fce8e8 100%)",
    accent: "glucal",
    role: "Sole designer, Developer",
    timeline: "Mar - Apr 2024",
    team: "1 designer, 1 developer",
    skills: "User research, Prototyping, Mobile dev",
    toc: ["Problem", "Solution", "Research", "Competitive Analysis", "Design Decisions", "Final Product"],
  },
]
