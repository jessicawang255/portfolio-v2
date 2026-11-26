import Image from "next/image"
import {
  Section,
  Callout,
  TwoColumn,
  Outcomes,
  Reflections,
  Media,
  CapsuleFlow,
  ImageBlock,
  FlowWalkthrough,
  PhoneVideo,
  PhoneVideoCompare,
  // FigmaEmbed,
} from "@/components/cs"
import retrospectOverview from "@/public/images/case-studies/retrospect/retrospect-overview.jpg"
import retrospectInspiration from "@/public/images/case-studies/retrospect/retrospect-inspiration.png"
import retrospectResearch1 from "@/public/images/case-studies/retrospect/retrospect-research.jpg"
import contextScreen from "@/public/images/case-studies/retrospect/retrospect-memories-4.png"

const DIR = "/images/case-studies/retrospect"

function Body({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-pretty text-base leading-normal text-neutral-600 ${className ?? ""}`}>{children}</p>
}

const steps = [
  {
    stage: "setup" as const,
    label: "Step 1",
    heading: "Set up the capsule",
    body: "Say a group of friends are going on vacation and want a time capsule to capture the memories. Before the trip, one of them names the capsule, picks a cover, and sets it to stay open for the length of the trip. Everyone else gets an invite to join.",
    clips: [
      { title: "Create a capsule", body: "Name it, choose a cover, and invite the group.", src: `${DIR}/retrospect-concept-1.mp4`, alt: "Screen recording of naming a capsule Mexico '25 and choosing a cover" },
      { title: "Join a capsule", body: "Friends accept the invite and land on the capsule's feed.", src: `${DIR}/retrospect-concept-2.mp4`, alt: "Screen recording of a friend accepting an invite and joining Mexico '25" },
    ],
  },
  {
    stage: "contribute" as const,
    label: "Step 2",
    heading: "Add memories during the trip",
    body: "For the week they're in Mexico, the capsule is open for contributions. Anyone in the group can add live photos, library photos, voice memos, quotes, songs, and notes as things happen. The feed shows who added what and when, with a countdown to when the capsule opens, but every memory stays sealed until then.",
    clips: [
      { title: "Add photos", body: "Pick shots straight from the camera roll.", src: `${DIR}/retrospect-concept-3.mp4`, alt: "Screen recording of adding photos from the library to the capsule" },
      { title: "Add a quote", body: "Write down what someone said, tag who said it, and confirm before it's sealed.", src: `${DIR}/retrospect-concept-4.mp4`, alt: "Screen recording of writing a quote and tagging who said it" },
      { title: "Add a song", body: "Search Spotify for the songs that soundtracked the day.", src: `${DIR}/retrospect-concept-5.mp4`, alt: "Screen recording of searching Spotify and picking a song to add" },
    ],
  },
  {
    stage: "open" as const,
    label: "Step 3",
    heading: "Open the capsule together",
    body: "Once the trip is over and everyone's back home, the capsule unlocks. The group can open it together and relive the trip through everything they saved.",
    clips: [
      { title: "Open the capsule", body: "Memories play back one at a time, story-style.", src: `${DIR}/retrospect-concept-6.mp4`, alt: "Screen recording of opening the capsule and revealing 11 memories from 4 people over 7 days" },
    ],
  },
]

export default function RetrospectNew() {
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
          src={retrospectOverview}
          alt="Grid of Retrospect app screens covering onboarding, capsule creation, collaborator status, sealing, and the sealed capsule reveal"
        />
      </Section>

      <Outcomes
        metrics={[
          { value: "3 months", label: "of closed beta" },
          { value: "62", label: "beta testers" },
          { value: "10k+", label: "social media impressions" },
        ]}
      />

      <Section
        id="inspiration"
        tag="Inspiration"
        headline="It's summer 2025, and a new trend of apps is emerging."
        body="Apps like BeReal, Lapse, Locket, and Airbuds focus on sharing moments through a single, niche purpose. In an age dominated by massive social platforms, users are drawn to these apps for their simplicity, novelty, and playful experiences."
        primary
      >
        <ImageBlock
          src={retrospectInspiration}
          alt="App icons for BeReal, Locket, Lapse, and Airbuds"
        />

        <Body>With Retrospect, my team and I wanted to focus on two trends inspired by these existing apps:</Body>

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
          src={retrospectResearch1}
          alt="Five-star App Store reviews for Lapse, BeReal, and Locket praising their real, unfiltered, and connective experiences"
          caption="App Store reviews for Lapse, BeReal, and Locket"
        />

        <Body>
          The team’s research revealed two key findings about trends in the consumer app space: people want apps that
          help them connect with friends in a real and relaxed way, and sharing is central to how users engage with
          niche social apps.
        </Body>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Callout label="Insight #1" heading="People like saving real, authentic memories, not staged ones." />
          <Callout label="Insight #2" heading="People want to feel close to the people they share with." />
        </div>
      </Section>

      <Section
        id="the-concept"
        tag="The Concept"
        headline="Retrospect: a digital time capsule to capture memories with friends."
        primary
      >
        {/* <FigmaEmbed
          url="https://www.figma.com/deck/ozWzPhD4INbVLZj1fEyQ9v"
          title="Retrospect app walkthrough slides"
        /> */}
        <FlowWalkthrough steps={steps} />
      </Section>

      <Section
        id="why-make-a-capsule"
        tag="Why make a capsule?"
        headline="To find out what motivates people to create a time capsule, we built an MVP in one day to test our hypothesis."
        body="My design teammate and I put together a lightweight design system and rough wireframes in Figma, then used the Figma MCP and Claude Code to build the MVP in practically one shot. The goal was to fail fast and learn as much as we could, as quickly as possible."
        primary
      >
        <Media
          src={`${DIR}/retrospect-why-1.png`}
          alt="MVP screens: name your time capsule, fill your box, set a date to open, sealed countdown, your capsule is ready, and the opened capsule"
          width={3840}
          height={1946}
          caption="The one-day MVP, built with Figma MCP and Claude Code"
        />
        <div className="mt-10 flex flex-col gap-6">
          <Callout
            label="User feedback"
            heading="People didn't have a reason to create a time capsule."
            body="We put the MVP in front of 12 testers for a week and asked why they'd want to make one. The answers were all over the place, but motivation was strongest when a capsule was tied to a real event, like a trip, semester, graduation, or birthday."
          />
          <Media
            src={`${DIR}/retrospect-why-2.png`}
            alt="Testers' answers to why they would want to create a time capsule: personal diary, mood tracker, progress journal, letters to a loved one, vacation memories, friend group memories"
            width={3840}
            height={2160}
          />
        </div>

        <Body className="mt-10">
          So I anchored time capsules to real-life moments. Instead of creating a capsule and waiting months to open it,
          friends add memories during a set contribution period, then open it together when it ends.
        </Body>

        <figure className="w-full">
          <figcaption className="mb-2 text-[13px] leading-[1.5] text-neutral-400 italic">
            Capsule structure, before and after
          </figcaption>
          <div className="divide-y divide-neutral-100 rounded-[8px] border border-media-stroke bg-neutral-75">
            {(["v1", "v2"] as const).map((version) => (
              <div key={version} className="flex flex-col gap-3 px-5 pt-5 sm:px-8 sm:pt-6">
                <p className="text-sm font-mono uppercase leading-[1.2] text-neutral-400">
                  {version === "v1" ? "v1 · Create, then wait" : "v2 · Contribution period"}
                </p>
                <CapsuleFlow version={version} bare />
              </div>
            ))}
          </div>
        </figure>

        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-base font-medium leading-[1.4] text-neutral-800">No dead time</h3>
            <p className="mt-1 text-pretty text-base leading-normal text-neutral-600">
              There&rsquo;s no &ldquo;wait&rdquo; stretch where people forget about the app and drop off.
            </p>
          </div>
          <div>
            <h3 className="text-base font-medium leading-[1.4] text-neutral-800">Value up front</h3>
            <p className="mt-1 text-pretty text-base leading-normal text-neutral-600">
              People get something out of the app during the event, not months later.
            </p>
          </div>
        </div>
      </Section>

      <Section
        id="adding-memories"
        tag="Adding memories"
        headline="What does it look like to add a memory to a time capsule?"
        body="I mapped memory types on a spectrum, from authentic, like an in-the-moment BeReal, to curated, like an edited Instagram carousel. Looking back on a trip, you want both: the polished highlights and the spontaneous moments in between. So we designed Retrospect to support both ends."
        primary
      >
        <Media
          src={`${DIR}/retrospect-memories-1.png`}
          alt="Memory types on a spectrum from authentic to curated: spontaneous live photos, voice memos, quotes, and camera gallery photos"
          width={3840}
          height={2160}
          caption="Memory types, from authentic to curated"
        />
        <div className="mt-10 flex flex-col gap-3">
          <h2 className="text-xl font-medium leading-[1.4] text-neutral-800">
            I explored two interaction patterns for adding memories.
          </h2>
          <Body>
            Camera-first opens straight into a camera, and you swipe between memory types. Menu-first starts with a
            simple menu that takes you to each memory type.
          </Body>
        </div>
        <PhoneVideoCompare
          items={[
            {
              label: "Camera-first",
              src: `${DIR}/retrospect-memories-2.mp4`,
              alt: "Screen recording of the camera-first pattern: the capture screen opens straight away and memory types sit in a swipeable row above the shutter",
            },
            {
              label: "Menu-first",
              src: `${DIR}/retrospect-memories-3.mp4`,
              alt: "Screen recording of the menu-first pattern: a menu of memory types opens first, then the chosen type's capture screen",
            },
          ]}
        />
        <Callout
          className="mt-10"
          label="Decision"
          heading="We went with menu-first: it had lower friction, testers found it less confusing, and it handles a wide range of memory types far better than a screen built around the camera."
          body="The tradeoff is one extra tap to capture a spontaneous moment."
        />
        <Callout
          className="mt-10"
          label="User feedback"
          heading="Memories are only valuable when they're tied to context."
          body="Testers kept telling us a photo on its own wasn't enough. They wanted to remember where it was taken, what was happening, and who was there."
        />
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-[2fr_3fr] md:items-end md:gap-8">
          <div className="flex justify-center rounded-[8px] border border-media-stroke bg-neutral-75 px-6 py-10">
            <Image
              src={contextScreen}
              alt="Photos screen with a caption field below the photo, pre-filled day, time, and location chips, and a button to tag people"
              sizes="220px"
              className="h-auto w-full max-w-[220px]"
            />
          </div>
          <div className="min-w-0 md:pb-2">
            <h3 className="text-base font-medium leading-[1.4] text-neutral-800">A caption under every memory</h3>
            <p className="mt-1 text-pretty text-base leading-normal text-neutral-600">
              The day, time, and location fill in automatically, so adding context takes no extra effort. A tag button
              records who was there.
            </p>
          </div>
        </div>
      </Section>

      <Section
        id="sealed-memories"
        tag="Sealed memories"
        headline="What do sealed memories look like while people contribute?"
        body="During the contribution period, memories are sealed until the capsule opens. But the capsule still needed to feel alive, so I explored three views for showing contributions without giving anything away."
        primary
      >
        <PhoneVideoCompare
          items={[
            {
              label: "Calendar view",
              src: `${DIR}/retrospect-sealed-1.mp4`,
              alt: "Screen recording of the calendar view: contributions grouped under each day of the trip",
            },
            {
              label: "Grid view",
              src: `${DIR}/retrospect-sealed-2.mp4`,
              alt: "Screen recording of the grid view: sealed contributions shown as blurred tiles",
            },
            {
              label: "List feed view",
              src: `${DIR}/retrospect-sealed-3.mp4`,
              alt: "Screen recording of the list feed view: who added what and when, with sealed thumbnails",
            },
          ]}
        />
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-[2fr_3fr] md:items-end md:gap-10">
          <div className="flex justify-center rounded-[8px] border border-media-stroke bg-neutral-75 px-6 py-10">
            <PhoneVideo
              src={`${DIR}/retrospect-sealed-4.png`}
              alt="Confirmation sheet showing the photos about to be added, with an Add 2 photos button"
              className="max-w-[220px]"
            />
          </div>
          <Callout label="User feedback" heading="Testers wanted to delete memories after adding them.">
            <div className="flex flex-col gap-4 text-pretty text-base leading-normal text-neutral-600">
              <p>
                But editing a sealed capsule would undo the point of sealing it. Instead, I added a{" "}
                <strong className="font-medium text-neutral-800">confirmation sheet before contributing</strong>, so
                people get one last look at what they&rsquo;re adding before it&rsquo;s locked in.
              </p>
              <p>
                <span className="font-mono text-sm uppercase text-neutral-400">Tradeoff</span>
                <span className="mx-2 text-neutral-300">·</span>
                Less flexibility and curation for users.
              </p>
            </div>
          </Callout>
        </div>
      </Section>

      <Section
        id="retrospect-in-retrospect"
        tag="Retrospect, in retrospect"
        headline="In closed beta, 62 testers made time capsules with their friends, and our launch content reached 10k+ people."
        primary
      >
        <Media
          src={`${DIR}/retrospect-results.png`}
          alt="TestFlight email inviting a tester to Retrospect, beside an Instagram post from retrospect.space reading Make a time capsule with us"
          width={3840}
          height={2160}
          caption="The rise: our TestFlight beta and launch content on Instagram"
        />
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-medium leading-[1.3] text-neutral-800">
            But after three months, traction started dying down.
          </h2>
          <Body>
            Our beta testers gradually stopped using Retrospect, and in December 2025, we decided to stop working on it.
          </Body>
          <Body>
            Novelty carried the first few weeks, but a capsule is a rare moment by design, so there wasn&rsquo;t much
            reason to come back in between. We tested early whether people wanted to make a capsule, but not whether
            they&rsquo;d make a second one. Social apps can gain traction quickly and still struggle to become a habit.
          </Body>
          <Body>
            We stopped at v2, and plenty of successful consumer apps only clicked many versions later. Even so, it was
            one of the most valuable things I&rsquo;ve built.
          </Body>
        </div>
      </Section>

      <Reflections
        id="reflections"
        tag="it's done! what did i learn?"
        items={[
          {
            heading: "Move fast to test the hypothesis",
            body: "We got a rough version in front of testers early to test our riskiest assumption first.",
          },
          {
            heading: "Working with AI",
            body: "AI got me through the first 80% faster, but the final decisions stayed with me.",
          },
        ]}
      />
    </div>
  )
}
