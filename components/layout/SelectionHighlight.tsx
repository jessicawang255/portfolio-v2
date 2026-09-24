"use client"

import { useEffect } from "react"

type Rect = { left: number; top: number; width: number; height: number }

const LAYER_ATTR = "data-selection-layer"

// Native selection boxes span the font's content area, which is taller than
// the line box under tight leading — so each line's highlight paints over
// the descenders of the line above. globals.css makes the native highlight
// transparent, and this draws it instead: one rect per line fragment, sized
// to the line box. Rects live in a layer appended to each text block (so
// they scroll, transform, clip and stack with it) and multiply-blend over
// the text rather than sitting behind it, which would put them under any
// ancestor's background.
export function SelectionHighlight() {
  useEffect(() => {
    let frame = 0
    let lastSignature = ""

    function clearLayers() {
      document.querySelectorAll(`[${LAYER_ATTR}]`).forEach((el) => el.remove())
    }

    function update() {
      frame = 0
      const sel = document.getSelection()
      const byHost = new Map<HTMLElement, Rect[]>()

      if (sel && !sel.isCollapsed) {
        const styles = new Map<Element, CSSStyleDeclaration>()
        const style = (el: Element) => {
          let cs = styles.get(el)
          if (!cs) styles.set(el, (cs = getComputedStyle(el)))
          return cs
        }
        const selectable = new Map<Element, boolean>()
        const isSelectable = (el: Element | null): boolean => {
          if (!el) return true
          const cached = selectable.get(el)
          if (cached !== undefined) return cached
          const cs = style(el)
          const result =
            cs.userSelect !== "none" &&
            cs.getPropertyValue("-webkit-user-select") !== "none" &&
            isSelectable(el.parentElement)
          selectable.set(el, result)
          return result
        }
        const hostOf = (el: Element): HTMLElement | null => {
          for (let cur: Element | null = el; cur; cur = cur.parentElement) {
            const display = style(cur).display
            if (display !== "inline" && display !== "contents") {
              return cur instanceof HTMLElement ? cur : null
            }
          }
          return null
        }

        for (let i = 0; i < sel.rangeCount; i++) {
          const range = sel.getRangeAt(i)
          const root = range.commonAncestorContainer
          const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
          let node: Node | null = root.nodeType === Node.TEXT_NODE ? root : walker.nextNode()

          for (; node; node = walker.nextNode()) {
            const parent = node.parentElement
            if (!parent || !range.intersectsNode(node) || !isSelectable(parent)) continue
            if (parent.checkVisibility?.({ visibilityProperty: true, opacityProperty: true }) === false) continue
            const host = hostOf(parent)
            if (!host) continue

            const sub = document.createRange()
            sub.selectNodeContents(node)
            if (range.startContainer === node) sub.setStart(node, range.startOffset)
            if (range.endContainer === node) sub.setEnd(node, range.endOffset)

            const lineHeight = parseFloat(style(parent).lineHeight) // NaN for "normal"
            const rects = byHost.get(host) ?? []
            for (const r of sub.getClientRects()) {
              if (r.width === 0) continue
              const height = lineHeight < r.height ? lineHeight : r.height
              rects.push({
                left: r.left,
                top: (r.top + r.bottom) / 2 - height / 2,
                width: r.width,
                height,
              })
            }
            if (rects.length) byHost.set(host, rects)
          }
        }
      }

      // Adjacent fragments on the same line (text split across inline
      // elements) merge into one rect so the multiply blend never doubles up.
      for (const [host, rects] of byHost) {
        rects.sort((a, b) => a.top - b.top || a.left - b.left)
        const merged: Rect[] = []
        for (const r of rects) {
          const prev = merged[merged.length - 1]
          if (
            prev &&
            Math.abs(prev.top - r.top) < 1 &&
            Math.abs(prev.height - r.height) < 1 &&
            r.left <= prev.left + prev.width + 1
          ) {
            prev.width = Math.max(prev.left + prev.width, r.left + r.width) - prev.left
          } else {
            merged.push({ ...r })
          }
        }
        byHost.set(host, merged)
      }

      // Skipping unchanged selections also stops the layer's own DOM
      // mutation from re-triggering selectionchange in a loop.
      const signature = [...byHost.values()]
        .flat()
        .map((r) => `${r.left},${r.top},${r.width},${r.height}`)
        .join("|")
      if (signature === lastSignature) return
      lastSignature = signature
      clearLayers()

      for (const [host, rects] of byHost) {
        const layer = document.createElement("div")
        layer.setAttribute(LAYER_ATTR, "")
        layer.setAttribute("aria-hidden", "true")
        // No insets: the layer sits at its static position, which is then
        // measured as the origin for its rects.
        layer.style.cssText =
          "position:absolute;width:0;height:0;margin:0;padding:0;pointer-events:none"
        host.appendChild(layer)

        const origin = layer.getBoundingClientRect()
        // Undo any scale transform on an ancestor (e.g. HeroShell).
        const scale = host.getBoundingClientRect().width / host.offsetWidth || 1
        for (const r of rects) {
          const box = document.createElement("div")
          box.style.cssText = `position:absolute;mix-blend-mode:multiply;background:var(--selection-bg);left:${(r.left - origin.left) / scale}px;top:${(r.top - origin.top) / scale}px;width:${r.width / scale}px;height:${r.height / scale}px`
          layer.appendChild(box)
        }
      }
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(update)
    }

    document.addEventListener("selectionchange", schedule)
    window.addEventListener("resize", schedule)
    return () => {
      document.removeEventListener("selectionchange", schedule)
      window.removeEventListener("resize", schedule)
      cancelAnimationFrame(frame)
      clearLayers()
    }
  }, [])

  return null
}
