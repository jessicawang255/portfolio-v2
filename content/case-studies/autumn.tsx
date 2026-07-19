import { Section } from "@/components/cs/Section"
import { ImageBlock } from "@/components/cs/ImageBlock"
import { Callout, Outcomes } from "@/components/cs"

export default function Autumn() {
  return (
    <div className="flex flex-col gap-30">
      <Section
        id="overview"
        tag="Overview"
        headline="Autumn connects people with end-of-life service providers to help them navigate bereavement."
        body="During my internship, I designed a library resource to engage users earlier, and more frequently."
        primary
      >
        <ImageBlock
          height={400}
        />

      <Outcomes
        metrics={[
          { value: "19%", label: "increase in site clicks" },
          { value: "12%", label: "conversion from the Support Library to the main product" },
          { value: "10/12", label: "users felt inclined to revisit Autumn in the future" },
        ]}
      />

      </Section>

      <Section
        id="problem"
        tag="Problem"
        headline="End-of-life services like Autumn face a unique challenge: users only need them once, during life's most sensitive moments."
        primary
      >
        <ImageBlock
          src="/images/case-studies/autumn/autumn-problem.png"
          alt="Four problem cards: limited opportunities to build relationships with potential users, difficulty building brand awareness and trust before the moment of need, reduced data collection opportunities for product iteration, and traditional user retention metrics don't apply"
          caption="Low-Frequency Marketplace Challenges"
          width={2400}
          height={548}
        />

        <Callout
          label="This understanding led us to ask:"
          heading="How might we create meaningful connections with users beyond our core service?"
        />
      </Section>

      <Section
        id="understanding-the-market"
        tag="Understanding the Market"
        headline="Let’s take a look at what others are doing to tackle this challenge."
        primary
      >
        <ImageBlock
          src="/images/case-studies/autumn/autumn-market.png"
          alt="Frequency-of-use comparison of Zillow, LinkedIn, and Uber, plotting each product's core usage and auxiliary tools from low to high frequency"
          width={2000}
          height={986}
        />

        <Callout
          label="Key finding:"
          heading="Successful low-frequency marketplaces create auxiliary content/tools that provide value outside their core product."
        />
      </Section>

      <Section
        id="adding-user-touchpoints"
        tag="Adding User Touchpoints"
        headline="Thus, we wanted to engage users earlier in their bereavement journey, before the crisis moment."
        primary
      >
        <ImageBlock
          src="/images/case-studies/autumn/autumn-touchpoints-1.png"
          alt="Touchpoint timeline showing only a reactive crisis-moment touchpoint: a stressed, grieving user discovering Autumn by searching for providers after a loss"
          caption="Existing user discovery journey"
          width={2000}
          height={470}
        />
        <ImageBlock
          src="/images/case-studies/autumn/autumn-touchpoints-2.png"
          alt="Expanded touchpoint timeline adding a proactive early-bereavement-planning touchpoint, where a curious, calm user browses Autumn's educational content before a crisis moment occurs"
          caption="After introducing support library"
          width={2000}
          height={498}
        />
      </Section>
      
      {/* Design Challenge #1 doubles as the "Design Challenges" parent in the
          table of contents (content/work.ts) — there's no separate content
          for an empty parent section, so this anchor lets the TOC's parent
          link/scroll-spy target land right at the top of Challenge #1. The
          anchor is wrapped together with the Section (rather than sitting
          as its own sibling) so it doesn't pick up an extra `gap-30` from
          the flex column above. */}
      <div>
        <span id="design-challenges" className="block scroll-mt-12" aria-hidden="true" />

        <Section
          id="design-challenge-1"
          tag="Design Challenge #1"
          headline="Users were not clicking to the provider pages from the Support Library articles"
          body="Initially, users had to navigate to a separate provider page after reading articles, creating unnecessary friction in the user journey. Click-though rates on these sections were extremely low."
          primary
        >

          <Callout
            label="Solution"
            heading="I transformed these basic CTAs into provider preview cards that showcase available professionals, directly integrated within the article content. "
          />

          <ImageBlock
            src="/images/case-studies/autumn/autumn-design-1.png"
            alt="Before and after comparison of an Autumn provider search results page, ending with provider cards for John Doe and Jane Smith under the message 'Loss is hard. Find a provider near you to help make it easier.'"
            width={2000}
            height={4643}
            caption="Initial Knowledge Hub flow"
          />

          <p className="mt-6 text-base text-neutral-500">
            After implementing this change, we saw a 19% increase in clicks to the provider pages. *************************FIX THIS PART
          </p>
        </Section>
      </div>

      <Section
        id="design-challenge-2"
        tag="Design Challenge #2"
        headline="With limited content initially, the full platform felt empty and bloated at launch"
      >
        <Callout
          label="Solution"
          heading="Autumn needed to launch quickly for New York users while building a foundation that could scale nationally."
          body="I split the knowledge hub design into several phases that could be introduced gradually as the platform grew."
        />

        <ImageBlock
          src="/images/case-studies/autumn/autumn-design-2.png"
          alt="Refined Knowledge Hub flow: a simplified categories-overview-to-individual-category structure, with the Support Library page followed by all articles sorted by category and a closing call-to-action"
          width={2000}
          height={3584}
          caption="All content streamlined into one landing page. A bare bones site, suitable for minimal content."
        />
        <ImageBlock
          src="/images/case-studies/autumn/autumn-design-3.png"
          alt="Refined Knowledge Hub flow: a simplified categories-overview-to-individual-category structure, with the Support Library page followed by all articles sorted by category and a closing call-to-action"
          width={2000}
          height={3584}
          caption="Expanded landing page to accommodate for different categories and location-specific articles.

"
        />
      </Section>

      <Section
        id="final-product"
        tag="Final Product"
        headline="Introducing the Autumn Support Library"
        primary
      >
        <ImageBlock
          height={400}
        />
      </Section>
    </div>
  )
}
