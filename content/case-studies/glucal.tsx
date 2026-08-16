import Image from "next/image"
import { ImageBlock } from "@/components/cs/ImageBlock"
import { Callout, Section } from "@/components/cs"

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
        body="gluCal is a mobile app for users who prefer a simple tool for managing diabetes. It focuses on essential functions only: calculating insulin doses, logging insulin, and tracking food intake."
        primary
      >
        <ImageBlock height={400} />
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
          alt="Design decision 1"
          width={2000}
          height={841}
        />
      
        <ImageBlock
          src="/images/case-studies/glucal/glucal-design-2.png"
          alt="Design decision 2"
          width={2000}
          height={1782}
        />
        <ImageBlock
          src="/images/case-studies/glucal/glucal-design-3.png"
          alt="Design decision 3"
          width={2000}
          height={1898}
        />
        <ImageBlock
          src="/images/case-studies/glucal/glucal-design-4.png"
          alt="Design decision 4"
          width={2000}
          height={682}
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

      <Section
        id="next-steps"
        tag="Next Steps"
        headline="What's next for gluCal."
        primary
      >
        <ImageBlock height={400} />
      </Section>

      <Section
        id="reflections"
        tag="it's done! what did i learn?"
        headline="A good design system leaves nothing unsaid"
        body="I learned that a good design system is more than just a set of components and rules. It should also include clear documentation and examples, so that anyone can understand how to use it effectively. This ensures consistency and quality across the product, even when different designers or developers are working on it."
        primary
      />
    </div>
  )
}
