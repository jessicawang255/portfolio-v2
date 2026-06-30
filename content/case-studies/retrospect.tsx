import { Section } from "@/components/cs/Section"
import { Callout } from "@/components/cs/Callout"
import { TwoColumn } from "@/components/cs/TwoColumn"
import { ImageBlock } from "@/components/cs/ImageBlock"
import { Outcomes } from "@/components/cs/Outcomes"
import { h2 } from "framer-motion/client"

export default function Retrospect() {
    return (
        <div className="flex flex-col gap-20">
            <Section
                id="overview"
                tag="Overview"
                headline="Retrospect is a social app for collaboratively creating and sharing digital time capsules with photos, songs, drawings, and more media."
                body="As one of two product designers, I led the 0→1 design of the core experience."
                primary
            >
                <ImageBlock height={280} />
            </Section>

            <Section
                id="inspiration"
                tag="Inspiration"
                headline="Niche social apps are on the rise."
                body="Apps like BeReal, Lapse, Locket, and Airbuds focus on sharing moments through a single, niche purpose. In an age dominated by massive social platforms, users are drawn to these apps for their simplicity, novelty, and playful experiences."
                primary
            >
                <ImageBlock height={280} />

                <p className="text-base text-neutral-500 leading-normal">
                    With Retrospect, my team and I wanted to focus on two trends inspired by these existing apps:
                </p>

                <ImageBlock />

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
                <ImageBlock height={280} />

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
                tag="competitive analysis"
                headline="Existing digital time capsule apps focus on function over social, playful, and shareable experiences."
                body="They target a broader, older audience and often lack visually engaging design tailored for young users seeking fun social experiences."
            >

                <ImageBlock height={500} />
                <h2 className="text-xl font-medium text-neutral-800 leading-[1.2]">With our app concept and research locked in, I jumped into designing the experience.</h2>
            </Section>

            <Section
                id="core-app-flows"
                tag="Core App Flows"
                headline="The goal was to craft an experience where collaboration, play, and personalization are built into every interaction."
                body="I started by mapping out the interaction design and wireframing."
                primary
            >
                <ImageBlock height={280} />
            </Section>

            <Section
                tag="Creating a capsule"
                headline="Creating a capsule needed to feel flexible and intuitive. Users should be able to add, edit, and organize any kind of memory with ease."
                body="I began by designing in a simple linear flow, refining each screen as I received feedback."
            >
                <ImageBlock height={280} />
                <p className="text-base text-neutral-500 leading-normal">
                    I recieved two main pieces of feedback from testers:
                </p>

                {/* ---------------------this section is unfinished ------------------*/}

                <ImageBlock height={280} />
                <h2 className="text-xl font-medium text-neutral-800 leading-[1.2]">I made one exception to the carousel layout for the song media type.</h2>
                <p className="text-base text-neutral-500 leading-normal">
                    During user testing, participants said that while the carousel worked well for other media, it didn’t capture the overall "feeling" of a group of songs together. They wanted to see multiple tracks together, similar to how playlists feel. Based on this insight, I used a list view for songs instead of the carousel.
                </p>
                
                <ImageBlock height={280} />
            </Section>

            <Section
                tag="Collaboration user flow"
                headline="When exploring how collaboration should work for a shared time capsule, I identified two main user flow variations."
                body="While both flows follow the same general process of adding items and sealing the capsule, they differ in who controls the final capsule sealing — either each contributor individually, or the owner on behalf of everyone. This distinction affects how ownership and coordination are experienced by collaborators."
                >
                <ImageBlock height={280} />
                {/* NEED NEW COMPONENT FOR TABS HERE - REDESIGN */}
                {/* and add more stuff here */}
            </Section>

            <Section
                id="final-product"
                tag="The Final Product"
                headline="Capture and share memories with friends. Relive them in Retrospect."
                primary
            >
                <ImageBlock height={280} />
            </Section>
        </div>
    )
}