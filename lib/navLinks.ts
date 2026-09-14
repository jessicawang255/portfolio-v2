export type NavLink = { label: string; href: string; target?: string }

// Shared across Nav.tsx, CaseStudyLayout.tsx, MobileNav.tsx, and Footer.tsx
// — single source so the three links can't drift between the site's nav
// renderings.
export const navLinks: NavLink[] = [
  { label: "Work",   href: "/" },
  { label: "About",  href: "/about" },
  { label: "Resume", href: "/JessicaWang_Resume.pdf", target: "_blank" },
]
