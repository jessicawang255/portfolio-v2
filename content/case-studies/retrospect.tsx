import { Section } from "@/components/cs/Section"
import { Callout } from "@/components/cs/Callout"
import { TwoColumn } from "@/components/cs/TwoColumn"
import { ImageBlock } from "@/components/cs/ImageBlock"
import { Outcomes } from "@/components/cs/Outcomes"

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
            </Section>

            <Section
                id="research"
                tag="Research"
                headline="After perusing the App Store and the internet, I discovered that Gen Z users are exploring smaller, more genuine spaces that make connecting feel real and fun."
                primary
            >
                <ImageBlock height={280} />
            </Section>
        </div>
    )
}