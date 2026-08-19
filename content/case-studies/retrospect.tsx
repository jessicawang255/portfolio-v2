import { Section } from "@/components/cs/Section"
import { Callout } from "@/components/cs/Callout"
import { TwoColumn } from "@/components/cs/TwoColumn"
import { ImageBlock } from "@/components/cs/ImageBlock"
import { IterationCarousel } from "@/components/cs/IterationCarousel"
import { ScreenSpotlight } from "@/components/cs/ScreenSpotlight"
import { h2 } from "framer-motion/client"

const SCREENS_DIR = "/images/case-studies/retrospect/screens"

// Every exported crop is 860×1864 except Home's, which was exported taller
// (874×2554) — see ScreenSpotlight's own scrolling phone window for how
// that difference is handled without changing the frame's size.
const STD = { width: 860, height: 1864 }

const finalProductFlows = [
    {
        id: "signup-onboarding",
        label: "Sign up + onboarding",
        sets: [
            {
                label: "",
                screens: [
                    {
                        src: `${SCREENS_DIR}/signup.png`,
                        ...STD,
                        alt: "Sign up screen asking for a phone number",
                        body: "A phone number and nothing else — no email, no password, no profile before you've seen anything.",
                    },
                    {
                        src: `${SCREENS_DIR}/invite.png`,
                        ...STD,
                        alt: "Better Together screen asking you to invite two friends before the app unlocks",
                        body: "The app won't open until two friends are invited. Retrospect is worthless alone, so it's a gate, not a prompt.",
                    },
                    {
                        src: `${SCREENS_DIR}/welcome.png`,
                        ...STD,
                        alt: "Welcome to Retrospect screen with a gradient background",
                        body: "The only screen that isn't black. The gradient is reserved for arrivals and openings.",
                        note: "Later: the gradient drifts, the logo settles.",
                    },
                ],
            },
        ],
    },
    {
        id: "home",
        label: "Home",
        sets: [
            {
                label: "",
                screens: [
                    {
                        src: `${SCREENS_DIR}/home.png`,
                        width: 874,
                        height: 2554,
                        alt: "Home screen showing Jessica's Box sealed, with a countdown timer and an expandable collaborator list",
                        body: "Home isn't a shelf of capsules — it's whichever one you're in, sealed and counting down until it can open.",
                    },
                ],
            },
        ],
    },
    {
        id: "creating-capsule",
        label: "Creating a capsule",
        sets: [
            {
                label: "Set up",
                screens: [
                    {
                        src: `${SCREENS_DIR}/vessel.png`,
                        ...STD,
                        alt: "Pick a vessel screen showing a carousel of physical capsule containers to choose from",
                        body: "The capsule is a physical object before it's anything else — you pick its shape before you put a single memory in it.",
                    },
                    {
                        src: `${SCREENS_DIR}/name.png`,
                        ...STD,
                        alt: "Give your capsule the perfect name screen with a text field pre-filled with Jessica's Box",
                        body: "Naming it earns the capsule a personality — “Jessica's Box” reads nothing like a generic container.",
                    },
                    {
                        src: `${SCREENS_DIR}/capsule-type.png`,
                        ...STD,
                        alt: "What kind of capsule screen offering a choice between a solo capsule and a shared capsule",
                        body: "Solo and shared aren't a settings toggle — they're two full-width cards, so the decision feels as big as it is.",
                    },
                    {
                        src: `${SCREENS_DIR}/invite-shared.png`,
                        ...STD,
                        alt: "Create a Shared Capsule screen with three invite slots and one friend already invited",
                        body: "A shared capsule ships with three invite slots already open — asking who's coming, not just whether anyone is.",
                    },
                    {
                        src: `${SCREENS_DIR}/join-invite.png`,
                        ...STD,
                        alt: "Invite screen shown to a collaborator, reading Jessica has invited you to collaborate on Jessica's Capsule",
                        body: "The invite is addressed to a capsule, not an app — the person accepting sees what they're joining before they see Retrospect at all.",
                    },
                    {
                        src: `${SCREENS_DIR}/fill-start.png`,
                        ...STD,
                        alt: "Let's start filling up your capsule transition screen",
                        body: "A gradient beat between setup and the work of filling, so the flow has a breath in it.",
                        note: "Later: a 1.5s transition, not a screen you tap through.",
                    },
                    {
                        src: `${SCREENS_DIR}/goodies.png`,
                        ...STD,
                        alt: "Put some additional goodies in your capsule screen listing six media types",
                        body: "Six media types, none of them required — a capsule can hold a single photo.",
                    },
                ],
            },
            {
                label: "Photos",
                screens: [
                    {
                        src: `${SCREENS_DIR}/photos-1.png`,
                        ...STD,
                        alt: "Add your best photos screen",
                        body: "Skip sits under Confirm, so you're never trapped in a media type you didn't want.",
                    },
                    {
                        src: `${SCREENS_DIR}/photos-2.png`,
                        ...STD,
                        alt: "These look great! screen showing added photos as a carousel with a delete option",
                        body: "Added photos become a carousel with delete on the card — the pattern every media type but songs reuses.",
                    },
                ],
            },
            {
                label: "Notes",
                screens: [
                    {
                        src: `${SCREENS_DIR}/note-1.png`,
                        ...STD,
                        alt: "Write Something screen with an empty field reading Write to your heart's desire",
                        body: "One field, one confirm; the placeholder does the inviting.",
                    },
                    {
                        src: `${SCREENS_DIR}/note-2.png`,
                        ...STD,
                        alt: "Write Something screen with the keyboard open and text being typed into the field",
                        body: "The field doesn't shrink when the keyboard opens — it's sized for a full note from the start, not a line that grows into one.",
                    },
                    {
                        src: `${SCREENS_DIR}/note-3.png`,
                        ...STD,
                        alt: "A note in the capsule screen with fading long text",
                        body: "Long notes fade at the bottom instead of scrolling, so the card stays a fixed object.",
                    },
                ],
            },
            {
                label: "Flashcard prompts",
                screens: [
                    {
                        src: `${SCREENS_DIR}/prompt-1.png`,
                        ...STD,
                        alt: "A flashcard prompt screen",
                        body: "Prompts refresh, so a question you don't like costs one tap instead of ending the flow.",
                    },
                    {
                        src: `${SCREENS_DIR}/prompt-2.png`,
                        ...STD,
                        alt: "Answering a prompt screen with the field above the keyboard",
                        body: "Prompt and field both stay above the keyboard — nothing to scroll while typing.",
                    },
                    {
                        src: `${SCREENS_DIR}/prompt-3.png`,
                        ...STD,
                        alt: "An answer saved screen with an editable row",
                        body: "Answers collapse into an editable row; the pencil is quieter than Delete on purpose.",
                    },
                ],
            },
            {
                label: "Songs",
                screens: [
                    {
                        src: `${SCREENS_DIR}/song-1.png`,
                        ...STD,
                        alt: "Add songs screen showing search results for Tyler, the Creator tracks",
                        body: "Results appear before you finish typing — the list fills in as fast as you can spell the artist's name.",
                    },
                    {
                        src: `${SCREENS_DIR}/song-2.png`,
                        ...STD,
                        alt: "Your Song Selection screen listing four chosen tracks",
                        body: "Songs get their own list instead of a carousel — the point is seeing the whole mix at once, the way a playlist reads.",
                    },
                ],
            },
            {
                label: "Audio bytes",
                screens: [
                    {
                        src: `${SCREENS_DIR}/audio-1.png`,
                        ...STD,
                        alt: "Record something screen with a record button before recording starts",
                        body: "One button, one label — recording an audio byte asks nothing else of you before you press it.",
                    },
                    {
                        src: `${SCREENS_DIR}/audio-2.png`,
                        ...STD,
                        alt: "Recording in progress screen reading Recording... You sound great!",
                        body: "The encouragement appears mid-recording, not after — so you're never left wondering if it's actually capturing anything.",
                    },
                    {
                        src: `${SCREENS_DIR}/audio-3.png`,
                        ...STD,
                        alt: "Sounds great! screen showing the recorded audio byte as a waveform with a delete option",
                        body: "A waveform replaces the record button once you're done — the card looks like a recording, not a placeholder for one.",
                    },
                ],
            },
            {
                label: "Drawings",
                screens: [
                    {
                        src: `${SCREENS_DIR}/draw-1.png`,
                        ...STD,
                        alt: "Do your worst, Bob Ross! screen with a blank drawing canvas and a color palette",
                        body: "Nine colors, one slider, no tool panel — the invitation does more work than any drawing feature would.",
                    },
                    {
                        src: `${SCREENS_DIR}/draw-2.png`,
                        ...STD,
                        alt: "Drawing canvas screen with a finished sketch of a bird next to an ice cream cone",
                        body: "Undo and redo sit under the canvas instead of in an edit menu, so backing out of a bad line costs one tap.",
                    },
                    {
                        src: `${SCREENS_DIR}/draw-3.png`,
                        ...STD,
                        alt: "Review your Art screen showing the finished drawing centered in a swipeable carousel",
                        body: "The drawing gets the same review carousel as photos — proof it's a media type here, not a side feature.",
                    },
                    {
                        src: `${SCREENS_DIR}/draw-4.png`,
                        ...STD,
                        alt: "Review your Art screen with the add-another card in focus alongside the finished drawing",
                        body: "The add-another card sits in the same carousel as the drawing itself — adding one more is a swipe, not a new flow.",
                    },
                ],
            },
            {
                label: "Sealing",
                screens: [
                    {
                        src: `${SCREENS_DIR}/seal-1.png`,
                        ...STD,
                        alt: "Set a date to open your time capsule screen with a date field and three quick presets",
                        body: "Three presets sit above the date field — most people aren't picking a custom date, they're picking “a year from now.”",
                    },
                    {
                        src: `${SCREENS_DIR}/seal-2.png`,
                        ...STD,
                        alt: "Capsule Status screen listing each collaborator's Sent status with the seal button disabled",
                        body: "Seal my capsule stays disabled until every collaborator is accounted for — sealing is a group decision, not the owner's alone.",
                    },
                    {
                        src: `${SCREENS_DIR}/seal-3.png`,
                        ...STD,
                        alt: "Sending into the ether screen instructing you to hold down your capsule to seal it",
                        body: "Sealing takes a hold, not a tap — the gesture matches the weight of what it's doing.",
                    },
                    {
                        src: `${SCREENS_DIR}/seal-4.png`,
                        ...STD,
                        alt: "Jessica's Capsule is sealed screen showing the countdown until it can be opened",
                        body: "The countdown starts the second it's sealed — proof the capsule is already doing what it promised.",
                    },
                ],
            },
        ],
    },
    {
        id: "opening-capsule",
        label: "Opening a capsule",
        sets: [
            {
                label: "",
                screens: [
                    {
                        src: `${SCREENS_DIR}/open-1.png`,
                        ...STD,
                        alt: "Hold to open Jessica's Capsule screen with a Preparing your vessel loading state",
                        body: "Opening gets the same hold gesture sealing did — the same weight, run in reverse.",
                    },
                    {
                        src: `${SCREENS_DIR}/open-2.png`,
                        ...STD,
                        alt: "Photo reveal screen with a stack of scattered photos and glitched '10 photos minted' text",
                        body: "The count glitches on the way in — a one-frame stutter that sells the reveal as something being unpacked, not just loaded.",
                    },
                    {
                        src: `${SCREENS_DIR}/open-3.png`,
                        ...STD,
                        alt: "Audio Bytes reveal screen showing a spinning CD for the capsule's six recordings",
                        body: "Audio gets a CD, not a waveform list — the format looks like something you'd actually want to hold.",
                    },
                    {
                        src: `${SCREENS_DIR}/open-4.png`,
                        ...STD,
                        alt: "Prompts reveal screen reading We asked, you answered with a stacked flashcard",
                        body: "The prompt reappears before the answer does — you re-read the question you forgot you were asked.",
                    },
                    {
                        src: `${SCREENS_DIR}/open-5.png`,
                        ...STD,
                        alt: "Notes reveal teaser screen reading Remember what you wrote? with scattered sticky notes",
                        body: "A teaser screen before the text itself — a beat to make you guess before it shows you.",
                    },
                    {
                        src: `${SCREENS_DIR}/open-6.png`,
                        ...STD,
                        alt: "Notes reveal screen showing the full saved note text on a sticky note",
                        body: "The note comes back exactly as written, on the same sticky-note shape it went in as.",
                    },
                    {
                        src: `${SCREENS_DIR}/open-7.png`,
                        ...STD,
                        alt: "Songs reveal screen reading Your nostalgia in 10 tracks with the saved playlist",
                        body: "“Nostalgia” does the framing a plain track list wouldn't — by the time you open this, the songs already mean something else.",
                    },
                    {
                        src: `${SCREENS_DIR}/open-8.png`,
                        ...STD,
                        alt: "Drawing reveal screen reading You're an artist! with the sketch shown in a gold frame",
                        body: "The frame is doing a joke, not gilding the drawing — dressing a stick-figure bird up in a gallery frame is the whole point.",
                    },
                ],
            },
        ],
    },
]

export default function Retrospect() {
    return (
        <div className="flex flex-col gap-16 sm:gap-30">
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

                <p className="text-base text-neutral-600 leading-normal">
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

                <p className="text-base text-neutral-600 leading-normal">
                    The team's research revealed two key findings about trends in the consumer app space:
                </p>

                <TwoColumn
                    left={
                        <h2 className="text-balance text-xl font-medium text-neutral-800 leading-[1.2]">1. People want apps that help them connect with friends in a real and relaxed way.</h2>

                    }
                    right={
                        <h2 className="text-balance text-xl font-medium text-neutral-800 leading-[1.2]">2. Sharing is central to how users engage with niche social apps.</h2>
                    }
                />

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
                <p className="text-base text-neutral-600 leading-normal">
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
                <h2 className="text-balance text-xl font-medium text-neutral-800 leading-[1.2]">I made one exception to the carousel layout for the song media type.</h2>
                <p className="text-base text-neutral-600 leading-normal">
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
                <IterationCarousel
                    items={[
                        {
                            src: "/images/case-studies/retrospect/retrospect-flows-7.png",
                            alt: "Collaboration flow where each contributor individually seals the capsule after adding their items",
                            width: 2400,
                            height: 1897,
                            caption: "Everyone individually seals the capsule when they're done adding items",
                        },
                        {
                            src: "/images/case-studies/retrospect/retrospect-flows-8.png",
                            alt: "Collaboration flow where the owner waits for all collaborators to finish before sealing the capsule for everyone",
                            width: 2400,
                            height: 1969,
                            caption: "A shared screen shows everyone’s status, and the owner seals the capsule once all items are added.",
                        },
                    ]}
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
                <ScreenSpotlight flows={finalProductFlows} />
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