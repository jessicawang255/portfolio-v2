export type Project = {
  slug: string
  title: string
  name: string
  status: string
  year: number
  disciplines: string[]
  bg: string
  image?: string
  // Case study detail fields
  role?: string
  timeline?: string
  team?: string
  skills?: string
  toc?: string[]
}

export type DiscoverItem = {
  slug: string
  title: string
  bg: string
  image?: string
  height: number
}

export const discoverItems: DiscoverItem[] = [
  {
    slug: "google-calendar",
    title: "Google Calendar Enhanced Task Management",
    bg: "#e8e4f0",
    height: 200
  },
  {
    slug: "hack-western",
    title: "Hack-Western",
    bg: "#e4ede8",
    height: 250
  },
  {
    slug: "snippets",
    title: "Snippets",
    bg: "#f0ece4",
    height: 287
  },
  {
    slug: "syllabud",
    title: "Syllabud",
    bg: "#f0ece4",
    height: 220
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
    role: "Product Designer",
    timeline: "Sep – Dec 2024",
    team: "1 design lead, 2 designers",
    skills: "Visual design, User testing, Prototyping",
    toc: ["Overview", "Challenge", "The theme", "App. portal ideation", "Designing for mobile", "The stickerbook", "Final product"],
  },
  {
    slug: "capsule-cabinet",
    title: "A digital time capsule to capture memories with friends",
    name: "Retrospect",
    status: "Demoed 2025",
    year: 2025,
    disciplines: ["Interaction design", "Prototyping"],
    bg: "#0d1240",
  },
  {
    slug: "grief-support",
    title: "Boosting discovery for a grief support platform",
    name: "Autumn",
    status: "Shipped 2024",
    year: 2024,
    disciplines: ["Business strategy", "UX design"],
    bg: "#c8cfc0",
  },
  {
    slug: "gluca",
    title: "Easing the daily burdens of diabetes management",
    name: "gluCal",
    status: "Showcased 2024",
    year: 2024,
    disciplines: ["User research", "Mobile design"],
    bg: "linear-gradient(160deg, #f9dede 0%, #fce8e8 100%)",
  },
]
