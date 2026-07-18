import { Section } from "@/components/cs/Section"
import { Callout } from "@/components/cs/Callout"
import { TwoColumn } from "@/components/cs/TwoColumn"
import { ImageBlock } from "@/components/cs/ImageBlock"
import { h2 } from "framer-motion/client"

export default function Retrospect() {
    return (
        <div className="flex flex-col gap-30">
            <Section
                id="overview"
                tag="Overview"
                headline="Retrospect is a social app for collaboratively creating and sharing digital time capsules with photos, songs, drawings, and more media."
                body="As one of two product designers, I led the 0→1 design of the core experience."
                primary
            >
                <ImageBlock
                    src="/images/case-studies/retrospect/retrospect-overview.png"
                    alt="Grid of Retrospect app screens covering onboarding, capsule creation, collaborator status, sealing, and the sealed capsule reveal"
                    width={2400}
                    height={1432}
                />
            </Section>

            <Section
                id="inspiration"
                tag="Inspiration"
                headline="Niche social apps are on the rise."
                body="Apps like BeReal, Lapse, Locket, and Airbuds focus on sharing moments through a single, niche purpose. In an age dominated by massive social platforms, users are drawn to these apps for their simplicity, novelty, and playful experiences."
                primary
            >
                <ImageBlock
                    src="/images/case-studies/retrospect/retrospect-inspiration.png"
                    alt="App icons for BeReal, Locket, Lapse, and Airbuds"
                    width={2400}
                    height={756}
                />

                <p className="text-base text-neutral-500 leading-normal">
                    With Retrospect, my team and I wanted to focus on two trends inspired by these existing apps:
                </p>

                <TwoColumn
                    left={<Callout label="Trend #1" heading="Immersive, lighthearted mobile-first experiences" />}
                    right={<Callout label="Trend #2" heading="Personalized reflection designed for sharing" />}
                />

            </Section>

            <Section
                id="research"
                tag="Research"
                headline="After perusing the App Store and the internet, I discovered that Gen Z users are exploring smaller, more genuine spaces that make connecting feel real and fun."
                primary
            >
                <ImageBlock
                    src="/images/case-studies/retrospect/retrospect-research-1.png"
                    alt="Five-star App Store reviews for Lapse, BeReal, and Locket praising their real, unfiltered, and connective experiences"
                    width={2400}
                    height={742}
                    caption="App Store reviews for Lapse, BeReal, and Locket"
                />

                <p className="text-base text-neutral-500 leading-normal">
                    The team's research revealed two key findings about trends in the consumer app space:
                </p>

                <TwoColumn
                    left={
                        <h2 className="text-xl font-medium text-neutral-800 leading-[1.2]">1. People want apps that help them connect with friends in a real and relaxed way.</h2>
                        
                    }
                    right={
                        <h2 className="text-xl font-medium text-neutral-800 leading-[1.2]">2. Sharing is central to how users engage with niche social apps.</h2>
                    }
                />

                <h2 className="text-xl font-medium text-neutral-800 leading-[1.2]">From these learnings, my team set on creating a digital time capsule that lets users create personalized and shared memories to open in the future.</h2>

            </Section>

            <Section
                id="competitive-analysis"
                tag="competitive analysis"
                headline="Existing digital time capsule apps focus on function over social, playful, and shareable experiences."
                body="They target a broader, older audience and often lack visually engaging design tailored for young users seeking fun social experiences."
            >

                <ImageBlock
                    src="/images/case-studies/retrospect/retrospect-research-2.png"
                    alt="Existing digital time capsule apps — Virtual Time Capsule, a mobile capsule app, Cupaloy, and Miigen's family time capsule builder"
                    width={2400}
                    height={1705}
                    caption="Existing competitors"
                />
                <h2 className="text-xl font-medium text-neutral-800 leading-[1.2]">With our app concept and research locked in, I jumped into designing the experience.</h2>
            </Section>

            <Section
                id="core-app-flows"
                tag="Core App Flows"
                headline="The goal was to craft an experience where collaboration, play, and personalization are built into every interaction."
                body="I started by mapping out the interaction design and wireframing."
                primary
            >
                <ImageBlock
                    src="/images/case-studies/retrospect/retrospect-flows-1.png"
                    alt="Interaction design map covering the open app flow, dashboard, capsule creation, group capsule sealing discussion, and opening a capsule"
                    width={2400}
                    height={1439}
                    caption="User flows"
                />
                <ImageBlock
                    src="/images/case-studies/retrospect/retrospect-flows-2.png"
                    alt="Low-fidelity wireframes for onboarding, main pages like the shelf and archive, and the full create-a-time-capsule flow"
                    width={2400}
                    height={1590}
                    caption="Wireframes"
                />
            </Section>

            <Section
                id="creating-a-capsule"
                tag="Creating a capsule"
                headline="Creating a capsule needed to feel flexible and intuitive. Users should be able to add, edit, and organize any kind of memory with ease."
                body="I began by designing in a simple linear flow, refining each screen as I received feedback."
            >
                <ImageBlock
                    src="/images/case-studies/retrospect/retrospect-flows-3.png"
                    alt="Initial linear flow for adding photos, voice recordings, songs, notes, prompts, and drawings to a capsule"
                    width={2400}
                    height={1059}
                    caption="Initial capsule creation flow and screens"
                />
                <p className="text-base text-neutral-500 leading-normal">
                    I recieved two main pieces of feedback from testers:
                </p>

                <ImageBlock
                    src="/images/case-studies/retrospect/retrospect-flows-4.png"
                    alt="Comparison of a multi-photo grid versus a single voice recording, with tester feedback asking why several photos but only one voice note could be added"
                    width={1658}
                    height={945}
                />
                <ImageBlock
                    src="/images/case-studies/retrospect/retrospect-flows-5.png"
                    alt="Revised carousel treatment applied consistently across photos, voice recordings, songs, notes, prompts, and drawings"
                    width={2400}
                    height={904}
                    caption="Consolidated capsule creation flow, with carousels"
                />
                <h2 className="text-xl font-medium text-neutral-800 leading-[1.2]">I made one exception to the carousel layout for the song media type.</h2>
                <p className="text-base text-neutral-500 leading-normal">
                    During user testing, participants said that while the carousel worked well for other media, it didn’t capture the overall "feeling" of a group of songs together. They wanted to see multiple tracks together, similar to how playlists feel. Based on this insight, I used a list view for songs instead of the carousel.
                </p>

                <ImageBlock
                    src="/images/case-studies/retrospect/retrospect-flows-6.png"
                    alt="Comparison of a list view versus a swipeable card carousel for a capsule's song selection"
                    width={2400}
                    height={988}
                    caption="Songs: list vs. carousel view comparison"
                />
            </Section>

            <Section
                id="collaboration-user-flow"
                tag="Collaboration user flow"
                headline="When exploring how collaboration should work for a shared time capsule, I identified two main user flow variations."
                body="While both flows follow the same general process of adding items and sealing the capsule, they differ in who controls the final capsule sealing — either each contributor individually, or the owner on behalf of everyone. This distinction affects how ownership and coordination are experienced by collaborators."
                >
                <ImageBlock
                    src="/images/case-studies/retrospect/retrospect-flows-7.png"
                    alt="Collaboration flow where each contributor individually seals the capsule after adding their items"
                    width={2400}
                    height={1897}
                    caption="Everyone individually seals the capsule when they're done adding items"
                />
                <ImageBlock
                    src="/images/case-studies/retrospect/retrospect-flows-8.png"
                    alt="Collaboration flow where the owner waits for all collaborators to finish before sealing the capsule for everyone"
                    width={2400}
                    height={1969}
                    caption="A shared screen shows everyone’s status, and the owner seals the capsule once all items are added."
                />
                {/* NEED NEW COMPONENT FOR TABS HERE - REDESIGN */}
                {/* and add more stuff here */}
            </Section>

            <Section
                id="final-product"
                tag="The Final Product"
                headline="Capture and share memories with friends. Relive them in Retrospect."
                primary
            >
                <ImageBlock
                    src="/images/case-studies/retrospect/retrospect-flows-9.png"
                    alt="Jessica's Box capsule status screen showing each collaborator's sealing status before the capsule can be sealed"
                    width={860}
                    height={1864}
                />
            </Section>
        </div>
    )
}