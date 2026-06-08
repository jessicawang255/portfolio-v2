export type Project = {
  slug: string
  title: string
  org: string
  status: string
  year: number
  disciplines: string[]
  bg: string
  image?: string
}

export const projects: Project[] = [
  {
    slug: "hack-western",
    title: "Designing an inviting application experience for 2,000 hackers",
    org: "Hack Western",
    status: "Shipped 2025",
    year: 2025,
    disciplines: ["Visual design", "User testing"],
    bg: "#eae6f4",
  },
  {
    slug: "capsule-cabinet",
    title: "A digital time capsule to capture memories with friends",
    org: "Retrospect",
    status: "Demoed 2025",
    year: 2025,
    disciplines: ["Interaction design", "Prototyping"],
    bg: "#0d1240",
  },
  {
    slug: "grief-support",
    title: "Boosting discovery for a grief support platform",
    org: "Autumn",
    status: "Shipped 2024",
    year: 2024,
    disciplines: ["Business strategy", "UX design"],
    bg: "#c8cfc0",
  },
  {
    slug: "gluca",
    title: "Easing the daily burdens of diabetes management",
    org: "gluCal",
    status: "Showcased 2024",
    year: 2024,
    disciplines: ["User research", "Mobile design"],
    bg: "linear-gradient(160deg, #f9dede 0%, #fce8e8 100%)",
  },
]
