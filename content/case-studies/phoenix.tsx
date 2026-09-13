import { Section, Outcomes, Reflections, ImageBlock } from "@/components/cs"

import phoenixProblem from "@/public/images/case-studies/phoenix/phoenix-problem.png"

// Scaffold only — every headline/body below is a placeholder. See the
// project todo for the full list of what's needed before this ships.
export default function Phoenix() {
  return (
    <div className="flex flex-col gap-16 md:gap-30">
      <Section
        id="overview"
        tag="Overview"
        headline="My team designed, built, and deployed a blockchain-based foreign exchange platform in 4 months."
        body="[TODO: 1-2 sentence summary of your role and the outcome]"
        primary
      >
        {/* TODO: hero/overview image or demo, e.g. <ImageBlock src={...} alt="..." /> */}
      </Section>

      <Outcomes
        metrics={[
          { value: "$302M", label: "projected 5 year revenue" },
          { value: "2 days→10 sec", label: "decrease in trade settlement time" },
          { value: "[TODO]", label: "[metric label]" },
        ]}
      />

      <Section
        id="the-problem"
        tag="The Problem"
        headline="At the start of May, we were presented with a vague problem statement:"
        primary
      >
        {/* TODO: problem framing — pain points, context, who's affected */}
        <ImageBlock
          src={phoenixProblem}
          alt="The Phoenix Challenge Statement: How might we explore digital asset technologies to make foreign exchange (FX) transactions faster, cheaper, and more transparent for RBC’s global clients?"
        />
      </Section>

      <Section
        id="research"
        tag="Research"
        headline="[TODO: what did you learn before designing — user research, market/competitive analysis, technical constraints of building on blockchain?]"
        primary
      >
        {/* TODO: research artifacts, findings, key insight that shaped direction */}
      </Section>

      <Section
        id="the-journey"
        tag="The Journey"
        headline="[TODO: how did the design/build evolve — key decisions, iterations, challenges?]"
        primary
      >
        {/* TODO: process — wireframes, iterations, design challenges + solutions */}
      </Section>

      <Section
        id="results"
        tag="Results"
        headline="[TODO: what shipped, and what happened after launch?]"
        primary
      >
        {/* TODO: final product imagery/demo, launch outcomes */}
      </Section>

      <Reflections
        id="reflections"
        tag="it's done! what did i learn?"
        items={[
          {
            heading: "[TODO: reflection heading]",
            body: "[TODO: what you learned]",
          },
          {
            heading: "[TODO: reflection heading]",
            body: "[TODO: what you learned]",
          },
        ]}
      />
    </div>
  )
}
