// Shared "below `lg`" (phone + tablet) hero height — a flat, viewport-
// relative value rather than one derived from any hero's own aspect ratio
// (see CaseStudyHero's doc comment). CaseStudyLayout sizes the outer hero
// frame to this; HeroForeground sizes its own crop box to the same value so
// the two agree on where the compact tier's "real" content area ends.
export const COMPACT_HERO_HEIGHT = "40svh"
