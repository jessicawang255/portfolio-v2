import Image from "next/image"
import { ImageBlock } from "@/components/cs/ImageBlock"
import { Callout, Section, Reflections } from "@/components/cs"

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

type IterationCardData = {
  heading: string
  body?: string
  checklist?: { ok: boolean; text: string }[]
  numbered?: string[]
}

// A single white insight card inside a food-log-iteration comparison box
// ("Elevation" / "Alignment with existing mental models" / etc.) —
// extracted since each iteration renders up to 5 of
// these, split across two independently-stacked columns rather than one
// aligned grid (see foodLogIterations' leftCards/rightCards below).
function IterationCard({ heading, body, checklist, numbered }: IterationCardData) {
  return (
    <div className="rounded-[8px] bg-neutral-50 p-6">
      <p className="text-base font-medium text-primary">{heading}</p>
      {body && <p className="mt-2 text-base leading-normal text-neutral-600">{body}</p>}
      {checklist && (
        <ul className="mt-2.5 flex flex-col gap-2">
          {checklist.map((item) => (
            <li key={item.text} className="flex items-start gap-2.5 text-base leading-normal text-neutral-600">
              <span className="mt-0.5 shrink-0 text-neutral-700" aria-hidden="true">
                {item.ok ? "✓" : "✕"}
              </span>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      )}
      {numbered && (
        <ol className="mt-2.5 flex flex-col gap-1.5">
          {numbered.map((item, i) => (
            <li key={item} className="flex gap-2 text-base leading-normal text-neutral-600">
              <span className="text-neutral-400">{i + 1}.</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

// Real exported pixel dimensions of glucal-design-5/6.webp — animated
// screen-recording crops of the "Log Food" screen, same convention as
// SOLUTION_IMAGE_WIDTH/HEIGHT above.
const ITERATION_IMAGE_WIDTH = 390
const ITERATION_IMAGE_HEIGHT = 844

const foodLogIterations = [
  {
    src: "/images/case-studies/glucal/glucal-design-5.webp",
    alt: "The log food form appearing as a modal over the list of already-logged foods",
    caption: "Iteration 1: A modal that overlays the list of logged foods",
    imagePosition: "left" as const,
    leftCards: [
      {
        heading: "Elevation",
        body: "One level above previously-logged items",
        checklist: [
          { ok: true, text: "Clearly separates the current food item from the list" },
          { ok: false, text: "Might be confusing to track multiple layers since the previously-logged items is already an overlay" },
        ],
      },
      {
        heading: "Exiting from the form",
        body: "Two ways to exit the modal without adding food:",
        numbered: ["X button at top left", "Clicking outside the modal (aligns with exiting modal design)"],
      },
    ],
    rightCards: [
      { heading: "Alignment with existing mental models", body: "Modals are a common UI pattern, making this interaction highly intuitive for users." },
      { heading: "Content overflow", body: "Since the modal is fixed, content is accessible without scrolling" },
      { heading: "Visual experience", body: "The design is standard and unremarkable" },
    ],
  },
  {
    src: "/images/case-studies/glucal/glucal-design-6.webp",
    alt: "The log food form appearing as a panel that slides down within the list of already-logged foods",
    caption: "Iteration 2: A slide-down panel that reveals the food input form",
    imagePosition: "right" as const,
    leftCards: [
      {
        heading: "Elevation",
        body: "Same level as previously-logged items",
        checklist: [
          { ok: true, text: "Easier to manage with fewer layers" },
          { ok: false, text: "Less clear separation between the new and previously-logged food items, which might cause confusion" },
        ],
      },
      {
        heading: "Exiting from the form",
        body: "No clear option to exit the food input form without adding an item. Clicking outside the form is not intuitive",
      },
    ],
    rightCards: [
      { heading: "Alignment with existing mental models", body: "This approach deviates from standard UI conventions which could lead to confusion, particularly for users who aren’t as tech-savvy" },
      { heading: "Content overflow", body: "Once the food list gets longer, users will need to scroll to access the food input form" },
      { heading: "Visual experience", body: "The smooth animations and unique design make the app more engaging and add delight" },
    ],
  },
]

export default function Glucal() {
  return (
    <div className="flex flex-col gap-16 sm:gap-30">
      <section id="problem" className="flex flex-col items-start scroll-mt-12">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 sm:gap-16 w-full">
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

          <div className="w-full sm:w-auto shrink-0 flex flex-col items-start sm:items-end">
            <Image
              src="/images/case-studies/glucal/glucal-problem-1.png"
              alt="Pictogram of 75 million people who inject insulin daily, sourced from the National Center for Biotechnology Information"
              width={696}
              height={809}
              className="w-full sm:w-72 h-auto"
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
              className="hidden sm:block w-36 h-auto"
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
          <div key={feature.number} className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-16">
            <Image
              src={feature.src}
              alt={feature.alt}
              width={SOLUTION_IMAGE_WIDTH}
              height={SOLUTION_IMAGE_HEIGHT}
              // unoptimized — these crops are animated WebP demos; running
              // them through next/image's sharp pipeline would flatten them
              // to a single still frame.
              unoptimized
              className="w-full max-w-56 shrink-0 h-auto rounded-[8px] border border-neutral-100 mx-auto sm:mx-0"
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

        <ImageBlock
          src="/images/case-studies/glucal/glucal-design-4.png"
          alt="Design decision 4"
          width={2000}
          height={682}
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

        <ImageBlock
          src="/images/case-studies/glucal/glucal-design-2.png"
          alt="Four button-placement iterations for the log food action, compared on perceived optionality and association to the carbs input"
          width={2000}
          height={1782}
        />

        {/* mt-7/sm:mt-21 stack on top of this children wrapper's own gap-9
            (see Section.tsx) so the total gap above this headline — 36px +
            28px = 64px, 36px + 84px = 120px — matches the gap-16/sm:gap-30
            the page's own top-level flex uses between sections, even though
            this headline is a mid-section child rather than its own
            section. */}
        <h1 className="text-balance text-3xl font-medium leading-[1.2] text-primary mt-7 sm:mt-21">
          However, users still expressed that logging food seemed like a separate process from inputting carb amounts.
        </h1>
        <p className="text-balance text-base leading-normal text-neutral-600">
          One user suggested to <strong className="text-[var(--cs-accent)] font-semibold">nest the button within the carb input field</strong>. When the button is nested within the field, it visually indicates that the log food action is part of the carbs input process, rather than a separate action that is simply associated with carbs.
        </p>

        <ImageBlock
          src="/images/case-studies/glucal/glucal-design-3.png"
          alt="Final design: the log food button nested inside the carbs input field"
          width={2000}
          height={1898}
        />
      </Section>

      <Section
        id="2-multiple-food-items"
        tag="Decision #2"
        headline="What would it look like to log multiple food items at once?"
        body="When logging food from the calculator, an intermediate screen appears that stores all the food the user is logging. I explored two different approaches for the food input form that appears after they click “Add Item”."
      >
        {foodLogIterations.map((iteration) => {
          const phone = (
            // cs-screens (960px), not sm (640px) — same threshold
            // ScreenSpotlight uses for its own phone-beside-content row (see
            // its own breakpoint comment in globals.css): this box's actual
            // available width is the case study's body column, which is
            // still only ~650px at `sm`, too narrow to fit a phone crop
            // alongside two card columns without every card wrapping line
            // by line. Stacked (phone above cards) below cs-screens instead.
            <div className="flex flex-col items-center cs-screens:w-56 cs-screens:shrink-0">
              <Image
                src={iteration.src}
                alt={iteration.alt}
                width={ITERATION_IMAGE_WIDTH}
                height={ITERATION_IMAGE_HEIGHT}
                // unoptimized — animated WebP screen recording, same as
                // solutionFeatures' glucal-final-*.webp crops above.
                unoptimized
                className="w-full max-w-56 h-auto rounded-[8px] border border-neutral-100"
              />
            </div>
          )
          const cards = (
            <div className="min-w-0 flex-1">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-start">
                <div className="flex flex-col gap-4">
                  {iteration.leftCards.map((card) => (
                    <IterationCard key={card.heading} {...card} />
                  ))}
                </div>
                <div className="flex flex-col gap-4">
                  {iteration.rightCards.map((card) => (
                    <IterationCard key={card.heading} {...card} />
                  ))}
                </div>
              </div>
            </div>
          )
          return (
            // Same wrapper shape as ImageBlock — caption <p> directly above
            // the visual — just with this whole box standing in for
            // ImageBlock's <Image>, since the "image" here is the box's
            // phone + cards content, not a single flat image file.
            <div key={iteration.src}>
              <p className="mb-2 text-xs leading-[1.5] text-neutral-400 italic">{iteration.caption}</p>
              <div className="rounded-[8px] border border-neutral-100 bg-neutral-75 p-6 sm:p-10">
                <div className="flex flex-col gap-8 cs-screens:flex-row cs-screens:items-start">
                  {iteration.imagePosition === "left" ? (
                    <>
                      {phone}
                      {cards}
                    </>
                  ) : (
                    <>
                      {cards}
                      {phone}
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        <h2 className="text-balance">
          Based on the comparison of these metrics, iteration 1 is the clear top choice.
        </h2>
      </Section>


      <Section
        id="3-syncing-data"
        tag="Decision #3"
        headline="How should we structure the data synchronization of the insulin log and food diary?">

      </Section>
      

      <Section
        id="final-product"
        tag="Final Product"
        headline="Introducing gluCal."
        primary
      >
        <ImageBlock height={400} />
      </Section>

      <Reflections
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
      />
    </div>
  )
}
