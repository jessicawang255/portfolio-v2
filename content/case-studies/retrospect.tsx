import { Section } from "@/components/cs/Section"
import { Callout } from "@/components/cs/Callout"
import { TwoColumn } from "@/components/cs/TwoColumn"
import { ImageBlock } from "@/components/cs/ImageBlock"
import { IterationCarousel } from "@/components/cs/IterationCarousel"
import { ScreenSpotlight } from "@/components/cs/ScreenSpotlight"
import { Reflections } from "@/components/cs/Reflections"

const SCREENS_DIR = "/images/case-studies/retrospect/screens"

// Every exported crop is 804×1748 except Home's, which was exported taller
// (804×2592) — see ScreenSpotlight's own scrolling phone window for how
// that difference is handled without changing the frame's size.
const STD = { width: 804, height: 1748 }

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
                        body: "Sign up with just a phone number.",
                    },
                    {
                        src: `${SCREENS_DIR}/invite.png`,
                        ...STD,
                        alt: "Better Together screen asking you to invite two friends before the app unlocks",
                        body: "Invite two friends before you can start using the app.",
                    },
                    {
                        src: `${SCREENS_DIR}/welcome.png`,
                        ...STD,
                        alt: "Welcome to Retrospect screen with a gradient background",
                        body: "Welcome screen shown once onboarding is complete.",
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
                        width: 804,
                        height: 2592,
                        alt: "Home screen showing Jessica's Box sealed, with a countdown timer and an expandable collaborator list",
                        body: "Home screen showing your current capsule, sealed and counting down until it can be opened, along with the list of collaborators.",
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
                        body: "Choose a container for your capsule.",
                    },
                    {
                        src: `${SCREENS_DIR}/name.png`,
                        ...STD,
                        alt: "Give your capsule the perfect name screen with a text field pre-filled with Jessica's Box",
                        body: "Name your capsule.",
                    },
                    {
                        src: `${SCREENS_DIR}/capsule-type.png`,
                        ...STD,
                        alt: "What kind of capsule screen offering a choice between a solo capsule and a shared capsule",
                        body: "Choose whether the capsule is solo or shared with others.",
                    },
                    {
                        src: `${SCREENS_DIR}/invite-shared.png`,
                        ...STD,
                        alt: "Create a Shared Capsule screen with three invite slots and one friend already invited",
                        body: "Invite friends to collaborate on a shared capsule.",
                    },
                    {
                        src: `${SCREENS_DIR}/join-invite.png`,
                        ...STD,
                        alt: "Invite screen shown to a collaborator, reading Jessica has invited you to collaborate on Jessica's Capsule",
                        body: "Screen shown to a friend when they're invited to join a capsule.",
                    },
                    {
                        src: `${SCREENS_DIR}/fill-start.png`,
                        ...STD,
                        alt: "Let's start filling up your capsule transition screen",
                        body: "Transition screen before you start adding items to the capsule.",
                        note: "Later: a 1.5s transition, not a screen you tap through.",
                    },
                    {
                        src: `${SCREENS_DIR}/goodies.png`,
                        ...STD,
                        alt: "Put some additional goodies in your capsule screen listing six media types",
                        body: "Choose which types of media to add: photos, notes, prompts, songs, audio, or drawings.",
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
                        body: "Add photos to your capsule.",
                    },
                    {
                        src: `${SCREENS_DIR}/photos-2.png`,
                        ...STD,
                        alt: "These look great! screen showing added photos as a carousel with a delete option",
                        body: "Add photos to your capsule.",
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
                        body: "Write a note to add to your capsule.",
                    },
                    {
                        src: `${SCREENS_DIR}/note-2.png`,
                        ...STD,
                        alt: "Write Something screen with the keyboard open and text being typed into the field",
                        body: "Write a note to add to your capsule.",
                    },
                    {
                        src: `${SCREENS_DIR}/note-3.png`,
                        ...STD,
                        alt: "A note in the capsule screen with fading long text",
                        body: "Write a note to add to your capsule.",
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
                        body: "Answer a prompt to add to your capsule.",
                    },
                    {
                        src: `${SCREENS_DIR}/prompt-2.png`,
                        ...STD,
                        alt: "Answering a prompt screen with the field above the keyboard",
                        body: "Answer a prompt to add to your capsule.",
                    },
                    {
                        src: `${SCREENS_DIR}/prompt-3.png`,
                        ...STD,
                        alt: "An answer saved screen with an editable row",
                        body: "Answer a prompt to add to your capsule.",
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
                        body: "Search for and add songs to your capsule.",
                    },
                    {
                        src: `${SCREENS_DIR}/song-2.png`,
                        ...STD,
                        alt: "Your Song Selection screen listing four chosen tracks",
                        body: "Search for and add songs to your capsule.",
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
                        body: "Record an audio clip to add to your capsule.",
                    },
                    {
                        src: `${SCREENS_DIR}/audio-2.png`,
                        ...STD,
                        alt: "Recording in progress screen reading Recording... You sound great!",
                        body: "Record an audio clip to add to your capsule.",
                    },
                    {
                        src: `${SCREENS_DIR}/audio-3.png`,
                        ...STD,
                        alt: "Sounds great! screen showing the recorded audio byte as a waveform with a delete option",
                        body: "Record an audio clip to add to your capsule.",
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
                        body: "Draw something to add to your capsule.",
                    },
                    {
                        src: `${SCREENS_DIR}/draw-2.png`,
                        ...STD,
                        alt: "Drawing canvas screen with a finished sketch of a bird next to an ice cream cone",
                        body: "Draw something to add to your capsule.",
                    },
                    {
                        src: `${SCREENS_DIR}/draw-3.png`,
                        ...STD,
                        alt: "Review your Art screen showing the finished drawing centered in a swipeable carousel",
                        body: "Draw something to add to your capsule.",
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
                        body: "Set a date for when the capsule can be opened.",
                    },
                    {
                        src: `${SCREENS_DIR}/seal-2.png`,
                        ...STD,
                        alt: "Capsule Status screen listing each collaborator's Sent status with the seal button disabled",
                        body: "See each collaborator's status before sealing the capsule.",
                    },
                    {
                        src: `${SCREENS_DIR}/seal-3.png`,
                        ...STD,
                        alt: "Sending into the ether screen instructing you to hold down your capsule to seal it",
                        body: "Hold down the capsule to seal it.",
                    },
                    {
                        src: `${SCREENS_DIR}/seal-4.png`,
                        ...STD,
                        alt: "Jessica's Capsule is sealed screen showing the countdown until it can be opened",
                        body: "Confirmation that the capsule is sealed, with a countdown until it opens.",
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
                        body: "Hold down the capsule to open it.",
                    },
                    {
                        src: `${SCREENS_DIR}/open-2.png`,
                        ...STD,
                        alt: "Photo reveal screen with a stack of scattered photos and glitched '10 photos minted' text",
                        body: "Photos from the capsule are revealed.",
                    },
                    {
                        src: `${SCREENS_DIR}/open-3.png`,
                        ...STD,
                        alt: "Audio Bytes reveal screen showing a spinning CD for the capsule's six recordings",
                        body: "Audio recordings from the capsule are revealed.",
                    },
                    {
                        src: `${SCREENS_DIR}/open-4.png`,
                        ...STD,
                        alt: "Prompts reveal screen reading We asked, you answered with a stacked flashcard",
                        body: "Prompts and answers from the capsule are revealed.",
                    },
                    {
                        src: `${SCREENS_DIR}/open-5.png`,
                        ...STD,
                        alt: "Notes reveal teaser screen reading Remember what you wrote? with scattered sticky notes",
                        body: "Notes from the capsule are revealed.",
                    },
                    {
                        src: `${SCREENS_DIR}/open-6.png`,
                        ...STD,
                        alt: "Notes reveal screen showing the full saved note text on a sticky note",
                        body: "Notes from the capsule are revealed.",
                    },
                    {
                        src: `${SCREENS_DIR}/open-7.png`,
                        ...STD,
                        alt: "Songs reveal screen reading Your nostalgia in 10 tracks with the saved playlist",
                        body: "Songs from the capsule are revealed.",
                    },
                    {
                        src: `${SCREENS_DIR}/open-8.png`,
                        ...STD,
                        alt: "Drawing reveal screen reading You're an artist! with the sketch shown in a gold frame",
                        body: "The drawing from the capsule is revealed.",
                    },
                ],
            },
        ],
    },
]

export default function Retrospect() {
    return (
        <div className="flex flex-col gap-16 md:gap-30">
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
                    The team’s research revealed two key findings about trends in the consumer app space: people want apps that help them connect with friends in a real and relaxed way, and sharing is central to how users engage with niche social apps.
                </p>
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

                <TwoColumn
                    left={
                        <Callout
                            heading="Users want to include multiple pieces of any media type — not just photos and songs."
                            body="I'd designed the option to add several photos, but assumed every other media type could only hold one. Testers immediately caught the gap: “Why can I add several photos, but only one voice note?”"
                        />
                    }
                    right={
                        <Callout
                            heading="Each media type was also being added and managed differently — one consistent pattern was overdue."
                            body="I consolidated every media type into the same interface: a carousel. Users could add several items, delete existing ones, and rearrange them — all through one consistent pattern instead of several different ones."
                        />
                    }
                />

                <ImageBlock
                    src="/images/case-studies/retrospect/retrospect-flows-5.png"
                    alt="Revised carousel treatment applied consistently across photos, voice recordings, songs, notes, prompts, and drawings"
                    width={2400}
                    height={904}
                    caption="Consolidated capsule creation flow, with carousels"
                />
                <div className="flex flex-col gap-3">
                    <h2 className="text-balance text-xl font-medium text-neutral-800 leading-[1.2]">I made one exception to the carousel layout for the song media type.</h2>
                    <p className="text-base text-neutral-600 leading-normal">
                        During user testing, participants said that while the carousel worked well for other media, it didn’t capture the overall &ldquo;feeling&rdquo; of a group of songs together. They wanted to see multiple tracks together, similar to how playlists feel. Based on this insight, I used a list view for songs instead of the carousel.
                    </p>
                </div>

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

        <Reflections
                id="reflections"
                tag="it's done! what did i learn?"
                items={[
                    {
                        heading: "MVPs (minimum viable products) are the MVP (most valuable player)",
                        body: "My team fell victim to scope creep. From the get-go we added collaboration, sharing, and a fancy onboarding, and we tried to build it all at once. I learned how important it is to start with the simplest possible version of the product,  get it in front of users early, and iterate based on real feedback (not assumptions).",
                    },
                    {
                        heading: "Don't just agree, push back",
                        body: "This was my first time working alongside a PM and developers, and my instinct was to defer. If the PM had already prioritized something, or a dev said another approach would be easier, I assumed they'd thought it through more than I had. I learned that I was the one who'd actually talked to users and reasoned through the interaction, and staying quiet just because someone said their opinion first wasted that.",
                    },
                ]}
            />
        </div>
    )
}