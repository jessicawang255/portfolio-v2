const colors = [
  { token: "--color-chrome",       hex: "#111412", label: "Chrome",        bg: "bg-chrome",        dark: true  },
  { token: "--color-surface",      hex: "#ffffff",  label: "Surface",       bg: "bg-surface",       dark: false },
  { token: "--color-accent",       hex: "#2E8B57", label: "Accent",        bg: "bg-accent",        dark: true  },
  { token: "--color-primary",      hex: "#171717", label: "Primary",       bg: "bg-primary",       dark: true  },
  { token: "--color-secondary",    hex: "#5a5a5a", label: "Secondary",     bg: "bg-secondary",     dark: true  },
  { token: "--color-muted",        hex: "#888888", label: "Muted",         bg: "bg-muted",         dark: true  },
  { token: "--color-subtle",       hex: "#aaaaaa", label: "Subtle",        bg: "bg-subtle",        dark: false },
  { token: "--color-divider",      hex: "#e8e8e4", label: "Divider",       bg: "bg-divider",       dark: false },
  { token: "--color-chrome-text",  hex: "#f0f0f0", label: "Chrome Text",   bg: "bg-chrome-text",   dark: false },
  { token: "--color-chrome-muted", hex: "#A0A7A3", label: "Chrome Muted",  bg: "bg-chrome-muted",  dark: false },
  { token: "--color-icon-social",  hex: "#DEDEDE", label: "Icon Social",   bg: "bg-icon-social",   dark: false },
]

const weights = [
  { label: "Thin",        cls: "font-thin",       value: 100 },
  { label: "Extralight",  cls: "font-extralight",  value: 200 },
  { label: "Light",       cls: "font-light",       value: 300 },
  { label: "Normal",      cls: "font-normal",      value: 400 },
  { label: "Medium",      cls: "font-medium",      value: 420, custom: true }, // remapped from 500
  { label: "Semibold",    cls: "font-semibold",    value: 560, custom: true },
  { label: "Bold",        cls: "font-bold",        value: 640, custom: true },
  { label: "Extrabold",   cls: "font-extrabold",   value: 800 },
  { label: "Black",       cls: "font-black",       value: 900 },
]

const sizes = [
  { label: "xs",   cls: "text-xs" },
  { label: "sm",   cls: "text-sm" },
  { label: "base", cls: "text-base" },
  { label: "lg",   cls: "text-lg" },
  { label: "xl",   cls: "text-xl" },
  { label: "2xl",  cls: "text-2xl" },
  { label: "3xl",  cls: "text-3xl" },
  { label: "4xl",  cls: "text-4xl" },
]

export default function TokensPage() {
  return (
    <main className="min-h-screen bg-surface p-16 flex flex-col gap-20">

      {/* ── Header ── */}
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-subtle mb-1">Temporary</p>
        <h1 className="text-3xl font-bold text-primary">Design Tokens</h1>
      </div>

      {/* ── Colors ── */}
      <section className="flex flex-col gap-6">
        <h2 className="text-lg font-semibold text-primary border-b border-divider pb-3">Colors</h2>
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
          {colors.map(({ token, hex, label, bg, dark }) => (
            <div key={token} className="flex flex-col gap-2">
              <div
                className={`${bg} rounded-xl h-20 w-full`}
                style={{ border: hex === "#ffffff" ? "1px solid #e8e8e4" : undefined }}
              />
              <div>
                <p className="text-sm font-medium text-primary">{label}</p>
                <p className="text-xs text-muted font-mono">{token}</p>
                <p className="text-xs text-subtle font-mono">{hex}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Font weights ── */}
      <section className="flex flex-col gap-6">
        <h2 className="text-lg font-semibold text-primary border-b border-divider pb-3">Font Weights — Avenir Next</h2>
        <div className="flex flex-col gap-5">
          {weights.map(({ label, cls, value, custom }) => (
            <div key={cls} className="flex items-baseline gap-6">
              <div className="w-32 shrink-0">
                <p className="text-xs text-subtle font-mono">{cls}</p>
                <p className="text-xs text-muted font-mono">
                  {value}{custom && <span className="text-accent"> ✦</span>}
                </p>
              </div>
              <p className={`${cls} text-2xl text-primary`}>
                The quick brown fox
              </p>
            </div>
          ))}
          <p className="text-xs text-subtle mt-2">✦ remapped from default via <span className="font-mono">--font-weight-*</span></p>
        </div>
      </section>

      {/* ── Type scale ── */}
      <section className="flex flex-col gap-6">
        <h2 className="text-lg font-semibold text-primary border-b border-divider pb-3">Type Scale</h2>
        <div className="flex flex-col gap-4">
          {sizes.map(({ label, cls }) => (
            <div key={cls} className="flex items-baseline gap-6">
              <p className="w-16 shrink-0 text-xs text-subtle font-mono">{cls}</p>
              <p className={`${cls} font-medium text-primary`}>The quick brown fox jumps</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Color on color ── */}
      <section className="flex flex-col gap-6">
        <h2 className="text-lg font-semibold text-primary border-b border-divider pb-3">Text Colors in Context</h2>
        <div className="flex flex-col gap-2 max-w-lg">
          {[
            { cls: "text-primary",   label: "Primary"   },
            { cls: "text-secondary", label: "Secondary" },
            { cls: "text-muted",     label: "Muted"     },
            { cls: "text-subtle",    label: "Subtle"    },
            { cls: "text-accent",    label: "Accent"    },
          ].map(({ cls, label }) => (
            <p key={cls} className={`${cls} text-base font-medium`}>
              {label} — The quick brown fox jumps over the lazy dog
            </p>
          ))}
        </div>
        <div className="bg-chrome rounded-2xl p-8 flex flex-col gap-2 max-w-lg mt-2">
          {[
            { cls: "text-chrome-text",  label: "Chrome Text"  },
            { cls: "text-chrome-muted", label: "Chrome Muted" },
          ].map(({ cls, label }) => (
            <p key={cls} className={`${cls} text-base font-medium`}>
              {label} — The quick brown fox jumps over the lazy dog
            </p>
          ))}
        </div>
      </section>

    </main>
  )
}
