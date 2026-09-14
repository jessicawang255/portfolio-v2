import { Section, Outcomes, Reflections, ImageBlock, Callout } from "@/components/cs"

import rbcProblem from "@/public/images/case-studies/rbc/rbc-problem.png"
import rbcOverview from "@/public/images/case-studies/rbc/rbc-overview.png"
import rbcJourney1 from "@/public/images/case-studies/rbc/rbc-journey-1.png"
import rbcJourney2 from "@/public/images/case-studies/rbc/rbc-journey-2.png"
import rbcResults from "@/public/images/case-studies/rbc/rbc-results.png"

// Scaffold only — every headline/body below is a placeholder. See the
// project todo for the full list of what's needed before this ships.
export default function Rbc() {
  return (
    <div className="flex flex-col gap-16 md:gap-30">
      <Section
        id="overview"
        tag="Overview"
        headline="My team designed, built, and deployed a blockchain-based foreign exchange platform in 4 months, winning a $20,000 grant!"
        body="Summer 2026, I interned at RBC as part of their Amplify program — a specialized internship where you're paired into small teams 
        to design and build a solution for a real business challenge. We got to do it all: from understanding the problem space, 
        interviewing stakeholders across the bank, to ideating on solutions, designing, developing, deploying, and presenting our 
        work to senior leaders."
        primary
      >

        <p className="text-base text-neutral-600 leading-normal"> My team built a blockchain-based foreign exchange tool that explores how RBC could offer foreign exchange between tokenized deposits in the (near) future. As a developer, I was hands-on with coding smart contracts on Ethereum (something I never would have pictured myself doing!), and I learned so, so much about foreign exchange and the world of digital assets, stablecoins, and blockchain.</p>
        
        <ImageBlock
          src={rbcOverview}
          alt="An image of my team at RBC, holding a check for $20,000, which we won for our project.">
        </ImageBlock>
      </Section>

      <Outcomes
          metrics={[
            { value: "$302M", label: "projected 5 year revenue" },
            { value: "2 days→10 sec", label: "decrease in trade settlement time" },
            { value: "Patent-pending", label: "We worked with lawyers to patent our solution" },
          ]}
      />

      <Section
        id="problem"
        tag="Problem"
        headline="At the start of May, we were presented with a problem statement by RBC's digital asset innovation team:"
        primary
      >
        {/* TODO: problem framing — pain points, context, who's affected */}
        <ImageBlock
          src={rbcProblem}
          alt="The Phoenix Challenge Statement: How might we explore digital asset technologies to make foreign exchange (FX) transactions faster, cheaper, and more transparent for RBC’s global clients?"
        />
      </Section>

      <Section
        id="journey"
        tag="Journey"
        headline="We started by interviewing traders and clients while studying the current state of foreign exchange and blockchain technology."
        primary
      >
        <ImageBlock
          src={rbcJourney1}
          caption="Recent news related to blockchain, stablecoin, and decentralized finance."
          alt="Screenshots of recent news related to blockchain, stablecoin, and decentralized finance."
        />

        <div className="flex flex-col">
          <h1 className="text-balance text-3xl font-medium leading-[1.2] text-primary mt-4">
            Our solutioning led us to explore several different routes and decisions.
          </h1>
          <p className="text-balance text-base leading-normal text-neutral-600 mt-7">
            Every avenue we explored raised its own open question, and the list kept growing the deeper we dug:
          </p>
        </div>

        <ImageBlock
          src={rbcJourney2}
          alt="Several questions and considerations."
        />

        <Callout
          label="Disclaimer"
          heading="This project is under NDA, so I can't share our designs and details of our solution."
        />
      </Section>

      <Section
        id="results"
        tag="Results"
        headline="We designed, built, and deployed our now-patent-pending solution, pitching our product to RBC's C-suite executives and winning first place out of all Amplify teams!"
        primary
      >
        <ImageBlock
          src={rbcResults}
          alt="A collage of photos from my RBC Amplify experience."
        />
      </Section>

      <Reflections
        id="reflections"
        tag="it's done! what did i learn?"
        items={[
          {
            heading: "Clarity > Consensus",
            body: "Across a bank as large as RBC, we got wildly different feedback depending on who we talked to, \
            and a few stakeholders pushed back on our idea outright. I learned that in a real-world project, your idea \
            will always meet resistance and conflicting direction from every side. Rather than satisfying everyone, I \
            learned to sift for the insights that move the solution forward.",
          },
          {
            heading: "Compliance is a design input.",
            body: "Before, I believed that compliance was a final check after the design process. I learned that it had to \
            be an input from day one. In fact, compliance shaped our entire solution! We designed for the compliance officer \
            as a real user in the flow, creating a dedicated view where every transaction is auditable straight from the chain.",
          },
          {
            heading: "Same system, different audiences",
            body: "We initially wanted to show the blockchain mechanics in our client portal— the revenue split, the \
            chain it settled through. But customers don't need to see how trust is verified, they just need to trust it. \
            What we exposed to compliance as proof, we abstracted away for the customer into a transaction that looks like \
            anything they've used today.",
          },
        ]}
      />
    </div>
  )
}
