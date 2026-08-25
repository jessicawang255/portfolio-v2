import Image from "next/image"
import { ImageBlock } from "@/components/cs/ImageBlock"
import { Callout, Section, Reflections, VideoCompare } from "@/components/cs"

// Real exported pixel dimensions of every glucal-final-*.webp crop — all
// three share one aspect ratio (unlike ScreenSpotlight's per-screen crops),
// so this is a single shared constant rather than per-item width/height.
const SOLUTION_IMAGE_WIDTH = 498
const SOLUTION_IMAGE_HEIGHT = 1077

const solutionFeatures = [
  {
    number: 1,
    title: "Insulin Calculator",
    body: "Users input their current glucose levels and carbohydrate intake then select a carb ratio. gluCal then calculates the recommended insulin dose based on their personalized settings, which can be adjusted at any time. Users can also log specific foods along with the carb count.",
    src: "/images/case-studies/glucal/glucal-final-1.webp",
    alt: "Insulin Calculator screen, showing glucose level and carbohydrate intake inputs alongside the calculated insulin dose",
  },
  {
    number: 2,
    title: "Insulin Log",
    body: "All insulin calculations are automatically stored in the insulin log. Users can also add logs manually from this page for doses taken without using the calculator for more flexibility.",
    src: "/images/case-studies/glucal/glucal-final-2.webp",
    alt: "Insulin Log screen, listing automatically and manually logged insulin doses",
  },
  {
    number: 3,
    title: "Food Diary",
    body: "The food diary logs all food items entered through the insulin calculator to help users track their diet alongside their insulin intake. Users can also create a food diary entry directly from this screen.",
    src: "/images/case-studies/glucal/glucal-final-3.webp",
    alt: "Food Diary screen, listing food entries logged through the insulin calculator",
  },
]

const foodLogApproaches = [
  {
    name: "Modal",
    // Longer than `name` — this is the tag sitting above the video, where
    // there's room to say what it actually does; `name` stays short for
    // the comparison table's column headers below.
    label: "Modal overlay",
    // .mp4, not the original glucal-design-5.webp — an animated WebP has
    // no play/pause control a browser exposes to JS, so VideoCompare
    // (playing one clip at a time, the other paused behind a click-to-play
    // scrim) needs a real <video> element. Re-encoded frame-for-frame from
    // the original WebP (ffmpeg's own WebP-animation decoder choked on the
    // source file directly, so this went through Pillow frame extraction
    // first) — same 390×844, same 10fps.
    src: "/images/case-studies/glucal/glucal-design-5.mp4",
    alt: "The log food form appearing as a modal over the list of already-logged foods",
  },
  {
    name: "Panel",
    label: "Slide-down panel",
    src: "/images/case-studies/glucal/glucal-design-6.mp4",
    alt: "The log food form appearing as a panel that slides down within the list of already-logged foods",
  },
]

// Only the three criteria that actually distinguished the two approaches —
// elevation and visual polish were dropped: both were already visible in
// the screenshots above, so writing a sentence about them added length
// without adding information.
const foodLogComparison = [
  {
    criterion: "Exiting the form",
    modal: { ok: true, text: "Two ways out" },
    panel: { ok: false, text: "No way out" },
  },
  {
    criterion: "Mental models",
    modal: { ok: true, text: "Familiar pattern" },
    panel: { ok: false, text: "Breaks convention" },
  },
  {
    criterion: "Content overflow",
    modal: { ok: true, text: "Fixed, no scroll" },
    panel: { ok: false, text: "Scrolls when long" },
  },
]

type FindingTone = "good" | "mixed" | "bad"

// Sampled directly from glucal-design-2.png's own tinted cells, not
// invented — these three pale tints are already the source design's own
// color language for a finding's verdict, carried over as-is.
const TONE_BG: Record<FindingTone, string> = {
  good: "#F8FDF5",
  mixed: "#FFFAEE",
  bad: "#FEF2F3",
}

// Real exported pixel dimensions of glucal-food-log-iteration-{1..4}.png —
// individual phone crops cut from glucal-design-2.png's original 4-up
// composite, so each can sit in its own grid cell instead of the whole
// comparison being one flat, uncroppable image.
const BUTTON_ITERATION_WIDTH = 395
const BUTTON_ITERATION_HEIGHT = 810

const buttonIterations = [
  {
    number: 1,
    style: "Attached, outline",
    src: "/images/case-studies/glucal/glucal-food-log-iteration-1.png",
    alt: "Log food button attached to the carbs field, in an outlined style",
  },
  {
    number: 2,
    style: "Attached, solid",
    src: "/images/case-studies/glucal/glucal-food-log-iteration-2.png",
    alt: "Log food button attached to the carbs field, in a solid style",
  },
  {
    number: 3,
    style: "Separate, outline",
    src: "/images/case-studies/glucal/glucal-food-log-iteration-3.png",
    alt: "Log food button separate from the carbs field, in an outlined style",
  },
  {
    number: 4,
    style: "Separate, solid",
    src: "/images/case-studies/glucal/glucal-food-log-iteration-4.png",
    alt: "Log food button separate from the carbs field, in a solid style",
  },
]

// Color carries the verdict here, not a checkmark — three tiers (good /
// mixed / bad) instead of Decision #2's binary pro/con, since these
// findings genuinely aren't binary: iteration 2's "unclear optionality" is
// a real caveat, not a flat negative the way "no way out" was.
const buttonComparison = [
  {
    criterion: "Perceived optionality",
    cells: [
      { tone: "good" as FindingTone, body: <>The outlined version and unique shape creates a <strong className="font-semibold text-primary">lower visual hierarchy, signaling optionality</strong></> },
      { tone: "mixed" as FindingTone, body: <>Positioning behind the carbs button sets it apart, but <strong className="font-semibold text-primary">unclear optionality without the &ldquo;optional&rdquo; label</strong></> },
      { tone: "mixed" as FindingTone, body: <>Outline differentiates it from mandatory fields, but <strong className="font-semibold text-primary">the shape is the same</strong></> },
      { tone: "bad" as FindingTone, body: <><strong className="font-semibold text-primary">Lacks clarity as an optional field</strong> without the &ldquo;optional&rdquo; label</> },
    ],
  },
  {
    criterion: "Association to carb input",
    cells: [
      { tone: "mixed" as FindingTone, body: <>Positioning makes it appear related to the carbs input, but the <strong className="font-semibold text-primary">connection is unclear</strong></> },
      { tone: "mixed" as FindingTone, body: <>Positioning makes it appear related to the carbs input, but the <strong className="font-semibold text-primary">connection is unclear</strong></> },
      { tone: "bad" as FindingTone, body: <><strong className="font-semibold text-primary">Positioned separately</strong> from the carbs input field, no evident relation</> },
      { tone: "bad" as FindingTone, body: <><strong className="font-semibold text-primary">Positioned separately</strong> from the carbs input field, no evident relation</> },
    ],
  },
]

// Real exported pixel dimensions of glucal-food-log-nested.png, cropped
// from glucal-design-3.png.
const NESTED_BUTTON_WIDTH = 705
const NESTED_BUTTON_HEIGHT = 1570

const nestedButtonComparison = [
  {
    criterion: "Perceived optionality",
    tone: "good" as FindingTone,
    body: <>Outlined button creates <strong className="font-semibold text-primary">lower visual hierarchy, signaling optionality</strong></>,
  },
  {
    criterion: "Association to carb input",
    tone: "good" as FindingTone,
    body: <>Nesting conveys the button&rsquo;s exact <strong className="font-semibold text-primary">relationship to carbs</strong>: logging food is an optional way to input carbs.</>,
  },
]

export default function Glucal() {
  return (
    <div className="flex flex-col gap-16 md:gap-30">
      <section id="problem" className="flex flex-col items-start scroll-mt-12">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-16 w-full">
          <div className="max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--cs-accent)] shrink-0" aria-hidden="true" />
              <p className="text-sm font-mono uppercase leading-[1.2] text-neutral-400">The Problem</p>
            </div>
            <h1 className="text-balance text-3xl font-medium leading-[1.2] text-primary mt-4">
              75 million people worldwide inject insulin daily.
            </h1>
            <p className="text-balance text-base leading-normal text-neutral-600 mt-7">
              This involves counting carbohydrates and calculating personalized doses, every time they eat. 5+ times a day. Every. Single. Day.
            </p>
          </div>

          <div className="w-full md:w-auto shrink-0 flex flex-col items-start md:items-end">
            <Image
              src="/images/case-studies/glucal/glucal-problem-1.png"
              alt="Pictogram of 75 million people who inject insulin daily, sourced from the National Center for Biotechnology Information"
              width={696}
              height={809}
              className="w-full md:w-72 h-auto"
            />
          </div>
        </div>

        <div className="mt-9 w-full">
          <h1 className="text-balance text-3xl font-medium leading-[1.2] text-primary mt-4">
            Despite being a daily task, there&rsquo;s no straightforward tool that simplifies insulin calculation elegantly.
          </h1>
          <p className="text-balance text-base leading-normal text-neutral-600 mt-7">
            The process is <strong className="text-[var(--cs-accent)] font-semibold">tedious</strong>, <strong className="text-[var(--cs-accent)] font-semibold">monotonous</strong>, and <strong className="text-[var(--cs-accent)] font-semibold">complicated</strong>. No one wants to do math before each meal! Existing tools are either frustrating to use, or don&rsquo;t address the specific need.
          </p>
          <div className="flex flex-col gap-9 mt-12 w-full">
            <Image
              src="/images/case-studies/glucal/glucal-problem-2.png"
              alt=""
              width={306}
              height={484}
              className="hidden md:block w-36 h-auto"
            />
          </div>
        </div>
      </section>

      <Section
        id="solution"
        tag="Solution"
        headline="gluCal: The all-in-one calculator and log to simplify insulin dosing"
        primary
      >
        {solutionFeatures.map((feature) => (
          <div key={feature.number} className="flex flex-col gap-6 md:flex-row md:items-start md:gap-16">
            <Image
              src={feature.src}
              alt={feature.alt}
              width={SOLUTION_IMAGE_WIDTH}
              height={SOLUTION_IMAGE_HEIGHT}
              // unoptimized — these crops are animated WebP demos; running
              // them through next/image's sharp pipeline would flatten them
              // to a single still frame.
              unoptimized
              className="w-full max-w-56 shrink-0 h-auto rounded-[8px] border border-neutral-100 mx-auto md:mx-0"
            />
            <div className="flex-1 min-w-0 max-w-xl">
              <h3 className="text-lg font-medium leading-[1.3] text-primary">
                {feature.number}. {feature.title}
              </h3>
              <p className="mt-3.5 text-base leading-normal text-neutral-600">
                {feature.body}
              </p>
            </div>
          </div>
        ))}
      </Section>

      <Section
        id="research"
        tag="Research"
        headline="To start, I conducted 3 user interviews with people with Type 1 Diabetes, and identified 2 main pain points."
        primary
      >
        <ImageBlock
          src="/images/case-studies/glucal/glucal-research.png"
          alt="Research findings summary"
          width={2000}
          height={750}
        />

        <Callout
          label="Question"
          heading="How might we make calculating insulin doses easier and less frustrating for people with diabetes?"
        />

      </Section>

      <Section
        id="competitive-analysis"
        tag="Standing out from existing products"
        headline="I conducted a competitive analysis and discovered that existing solutions varied along 2 key spectrums: visual design and scope."
        primary
      >
        <ImageBlock
          src="/images/case-studies/glucal/glucal-competition.png"
          alt="Competitive analysis of existing glucose tracking apps"
          width={2000}
          height={1367}
        />

        <Callout
          label="Finding"
          heading="Existing diabetes tools fall short for users seeking a simple, focused solution, without the complexity of broader management systems."
        />
      </Section>

      <Section
        id="design-decisions"
        tag="Design Decisions"
        headline="I started off by exploring different layouts and mapping out the basic app structure on paper."
        primary
      >
        <ImageBlock
          src="/images/case-studies/glucal/glucal-design-1.png"
          alt="Early wireframes"
          width={2000}
          height={841}
        />
      </Section>

      <Section
        id="1-logging-food"
        tag="Decision #1"
        headline="How do we show that logging food is associated with the carb count input?"
        body="Users have the option to log the food they’re eating when calculating insulin. If a user logs food, the carbs input field is automatically filled with that information."
      >
        <p className="text-balance text-base leading-normal text-neutral-600">
          The &ldquo;log food&rdquo; button needed to appear <strong className="text-[var(--cs-accent)] font-semibold">1. optional</strong> and <strong className="text-[var(--cs-accent)] font-semibold">2. associated with the carbs input field</strong>.
        </p>

        <div className="rounded-[8px] border border-neutral-100 bg-neutral-75 p-6 md:p-10">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {buttonIterations.map((iteration) => (
              <div key={iteration.number} className="flex flex-col items-center gap-3">
                <p className="text-center text-sm font-mono uppercase leading-[1.2] text-neutral-400">
                  {iteration.number}. {iteration.style}
                </p>
                <Image
                  src={iteration.src}
                  alt={iteration.alt}
                  width={BUTTON_ITERATION_WIDTH}
                  height={BUTTON_ITERATION_HEIGHT}
                  className="h-auto w-full rounded-[16px] border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.08)]"
                />
              </div>
            ))}
          </div>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="md:w-44" />
                  {buttonIterations.map((iteration) => (
                    <th key={iteration.number} className="pb-2 pr-4 text-left last:pr-0">
                      <span className="font-mono text-sm leading-none font-normal text-neutral-400">
                        {iteration.number}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {buttonComparison.map((row) => (
                  <tr key={row.criterion} className="border-t border-neutral-100">
                    <td className="py-3 pr-4 align-top md:w-44 md:pr-8">
                      <span className="font-mono text-sm leading-[0.8] font-normal text-neutral-400">
                        {row.criterion}
                      </span>
                    </td>
                    {row.cells.map((cell, i) => (
                      <td key={i} className="p-3 align-top last:pr-0" style={{ backgroundColor: TONE_BG[cell.tone] }}>
                        <p className="text-sm leading-normal text-neutral-600">{cell.body}</p>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* mt-7/md:mt-21 stack on top of this children wrapper's own gap-9
            (see Section.tsx) so the total gap above this headline — 36px +
            28px = 64px, 36px + 84px = 120px — matches the gap-16/md:gap-30
            the page's own top-level flex uses between sections, even though
            this headline is a mid-section child rather than its own
            section. */}
        <h1 className="text-balance text-3xl font-medium leading-[1.2] text-primary mt-7 md:mt-21">
          However, users still expressed that logging food seemed like a separate process from inputting carb amounts.
        </h1>
        <p className="text-balance text-base leading-normal text-neutral-600">
          One user suggested to <strong className="text-[var(--cs-accent)] font-semibold">nest the button within the carb input field</strong>. When the button is nested within the field, it visually indicates that the log food action is part of the carbs input process, rather than a separate action that is simply associated with carbs.
        </p>

        <div className="rounded-[8px] border border-neutral-100 bg-neutral-75 p-6 md:p-10">
          <div className="flex justify-center">
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm font-mono uppercase leading-[1.2] text-neutral-400">Nested button</p>
              <Image
                src="/images/case-studies/glucal/glucal-food-log-nested.png"
                alt="Final design: the log food button nested inside the carbs input field"
                width={NESTED_BUTTON_WIDTH}
                height={NESTED_BUTTON_HEIGHT}
                className="h-auto w-full max-w-72 rounded-[26px] border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.08)]"
              />
            </div>
          </div>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="md:w-44" />
                  <th className="pb-2 pr-4 text-left">
                    <span className="font-mono text-sm leading-none font-normal text-neutral-400">5</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {nestedButtonComparison.map((row) => (
                  <tr key={row.criterion} className="border-t border-neutral-100">
                    <td className="py-3 pr-4 align-top md:w-44 md:pr-8">
                      <span className="font-mono text-sm leading-[0.8] font-normal text-neutral-400">
                        {row.criterion}
                      </span>
                    </td>
                    <td className="p-3 align-top" style={{ backgroundColor: TONE_BG[row.tone] }}>
                      <p className="text-sm leading-normal text-neutral-600">{row.body}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-balance text-base leading-normal text-neutral-600">
          Perfect! This was a great solution that I would not have come up with without the help of user feedback!
        </p>
      </Section>

      <Section
        id="2-multiple-food-items"
        tag="Decision #2"
        headline="What would it look like to log multiple food items at once?"
        body="When logging food from the calculator, an intermediate screen appears that stores all the food the user is logging. I explored two different approaches for the food input form that appears after they click “Add Item”."
      >
        {/* Big screenshots first — the whole point of a case study is
            showing the actual design, not a table-header thumbnail — then
            one shared comparison table below, instead of two separate
            stacked boxes each re-explaining the same three points. */}
        <div className="rounded-[8px] border border-neutral-100 bg-neutral-75 p-6 md:p-10">
          <VideoCompare items={[foodLogApproaches[0], foodLogApproaches[1]]} />

          <div className="mt-10 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="md:w-44" />
                  {foodLogApproaches.map((approach) => (
                    <th key={approach.name} className="pb-2 pr-4 text-left last:pr-0">
                      <span className="font-mono text-sm leading-none font-normal text-neutral-400 uppercase">
                        {approach.name}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {foodLogComparison.map((row) => (
                  <tr key={row.criterion} className="border-t border-neutral-100">
                    <td className="py-3 pr-4 align-top md:w-44 md:pr-8">
                      <span className="font-mono text-sm leading-[0.8] font-normal text-neutral-400">
                        {row.criterion}
                      </span>
                    </td>
                    {[row.modal, row.panel].map((cell, i) => (
                      <td key={i} className="py-3 pr-4 align-top last:pr-0 upper">
                        <div className="flex items-center gap-2.5 text-base leading-normal text-neutral-600">
                          <span
                            aria-hidden="true"
                            className="block shrink-0 bg-current text-neutral-400"
                            style={{
                              width: 16,
                              height: 16,
                              WebkitMaskImage: `url(/icons/${cell.ok ? "check" : "close"}-fill.svg)`,
                              maskImage: `url(/icons/${cell.ok ? "check" : "close"}-fill.svg)`,
                              WebkitMaskSize: "contain",
                              maskSize: "contain",
                              WebkitMaskRepeat: "no-repeat",
                              maskRepeat: "no-repeat",
                            }}
                          />
                          <span>{cell.text}</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <h2 className="text-balance">
          The modal wins on all three counts — a clear way to exit, a familiar pattern, and no scrolling.
        </h2>
      </Section>


      <Section
        id="3-syncing-data"
        tag="Decision #3"
        headline="How should we structure the data synchronization of the insulin log and food diary?"
        body="When a user logs food alongside an insulin calculation, two entries are created — one in the insulin log, one in the food diary — connected by a shared carb count. If that carb count is edited later in one log, should it update the other, and should the associated insulin dose update too?"
      >
        <ImageBlock
          src="/images/case-studies/glucal/glucal-design-4.png"
          alt="Two options compared: storing the carb count independently in each log, versus linking it so editing the count in one log updates the other"
          width={1904}
          height={682}
        />

        <p className="text-balance text-base leading-normal text-neutral-600">
          I weighed this against two priorities for gluCal: <strong className="text-[var(--cs-accent)] font-semibold">simplicity</strong> (the app should reduce thinking, not add to it) and <strong className="text-[var(--cs-accent)] font-semibold">flexibility </strong>(real life is messy — people don&rsquo;t always log insulin and food together, or in order).
        </p>

        <p className="text-balance text-base leading-normal text-neutral-600">
          Keeping the carb counts independent supports both: users can edit either log without triggering unexpected changes elsewhere, and it avoids the technical complexity of syncing data across gluCal&rsquo;s two separate database tables.
        </p>

        <Callout
          label="Decision"
          heading="Carb counts stay independent across the insulin log and food diary."
        />
      </Section>


      <Section
        id="final-product"
        tag="Final Product"
        headline="Introducing gluCal."
        primary
      >
        <ImageBlock height={400} />
      </Section>

      {/* <Reflections
        id="reflections"
        tag="it's done! what did i learn?"
        items={[
          {
            heading: "A good design system leaves nothing unsaid",
            body: "I learned that a good design system is more than just a set of components and rules. It should also include clear documentation and examples, so that anyone can understand how to use it effectively. This ensures consistency and quality across the product, even when different designers or developers are working on it.",
          },
          {
            heading: "Placeholder reflection",
            body: "Placeholder reflection — add a second takeaway here.",
          },
        ]}
      /> */}
    </div>
  )
}
