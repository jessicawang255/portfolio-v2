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
        id="design-decision-1"
        tag="Design Decision #1"
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
        id="design-decision-2"
        tag="Design Decision #2"
        headline="What would it look like to log multiple food items at once?">
      
      </Section>


      <Section
        id="design-decision-3"
        tag="Design Decision #3"
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
