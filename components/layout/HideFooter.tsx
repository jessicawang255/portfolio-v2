"use client"

import { useEffect } from "react"

// Hides the sitewide #site-footer while this page is mounted, for the rare
// page (404) that sits directly on the chrome background instead of the
// usual #main-frame card + footer.
export function HideFooter() {
  useEffect(() => {
    const footer = document.getElementById("site-footer")
    if (!footer) return
    footer.style.display = "none"
    return () => {
      footer.style.display = ""
    }
  }, [])

  return null
}
