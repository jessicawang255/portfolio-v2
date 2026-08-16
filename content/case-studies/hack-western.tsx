import { Section } from "@/components/cs/Section"
import { Callout } from "@/components/cs/Callout"
import { TwoColumn } from "@/components/cs/TwoColumn"
import { ImageBlock } from "@/components/cs/ImageBlock"
import { IterationCarousel } from "@/components/cs/IterationCarousel"
import { Outcomes } from "@/components/cs/Outcomes"

export default function HackWestern() {
  return (
    <div className="flex flex-col gap-16 sm:gap-30">
      <Section
        id="overview"
        tag="Overview"
        headline="Hack Western is one of the biggest student-run hackathons in Canada, with 400+ participants and 2,000+ applicants each year."
        body="As a Design Organizer, I led the design of our Hack Western 12 application portal, with the goal of making applying feel welcoming and fun."
        primary
      >
        <ImageBlock
          src="/images/case-studies/hack-western/hw-overview.png"
          alt="Screens from the Hack Western 12 application portal, including the long answers step, character customization, application review, and landing page"
          width={2400}
          height={1213}
        />
      </Section>

      <Outcomes
        metrics={[
          { value: "2,220", label: "accounts created" },
          { value: "1,400", label: "applications submitted" },
          { value: "7", label: "countries reached" },
        ]}
      />

      <Section
        id="challenge"
        tag="The Challenge"
        headline="Our goal was to make Hack Western 12 feel like a safe, welcoming place for anyone new to tech."
        primary
      >
        <ImageBlock
          src="/images/case-studies/hack-western/hw-challenge.png"
          alt="Sticky notes reading 'Create a unique, innovative, and memorable experience for all hackers' and 'Appeal to a diverse audience by making the event beginner-friendly'"
          width={2400}
          height={961}
        />
      </Section>

      <Section
        id="theme"
        tag="Creating the Theme"
        headline="We started by creating a theme for Hack Western 12 that would carry through every part of the hackathon."
        body="My teammate led a short open-ended questionnaire asking participants to share how each theme concept made them feel. Most described the clean, pastel, scrapbook-inspired direction as the most welcoming and interesting."
        primary
      >
        <ImageBlock
          src="/images/case-studies/hack-western/hw-theme.png"
          alt="Moodboard of scrapbooking and minimal illustration references alongside questionnaire form responses used to choose the Hack Western 12 theme"
          width={2400}
          height={1948}
          caption="Theme Ideation and Sentiment Analysis"
        />

        <Callout
          label="Solution"
          heading="Hack Western 12: The world is your canvas."
        />
      </Section>


      <Section
        id="app-portal-ideation"
        tag="Application Portal Ideation"
        headline="After defining the theme, I began brainstorming features that would make the application experience feel fun and unique."
        body="Ideas ranged from personalized, customizable visuals to interactive, collaborative boards. In the end, we focused on three key features: personalized stickers that changed based on responses, customizable avatars, and a &ldquo;draw something&rdquo; question. These features struck a balance between technical feasibility and playful expression."
        primary
      >
        <ImageBlock
          src="/images/case-studies/hack-western/hw-ideation-1.png"
          alt="Feature brainstorm grid covering personalized stickers, characters/avatars, a collaborative public board, personalized digital collectibles, freeform canvas drawing, and hacker personas"
          width={2400}
          height={971}
          caption="Delight-drive feature exploration"
        />
      </Section>

      <Section
        id="revamping-the-user-flow"
        tag="Revamping the User Flow"
        headline="I simplified the application flow from past years and mapped out where to add each of the new delight features."
        body="In previous years, technical constraints required an extra &ldquo;application dashboard&rdquo; page between logging in and filling out the form. With those limitations removed, users could now go straight from signing in to their application, returning directly where they left off."
      >
        <IterationCarousel
            items={[
                {
                    src: "/images/case-studies/hack-western/hw-ideation-2.png",
                    alt: "Initial application user flow with an annotation to remove the redundant applicant dashboard step after login",
                    width: 2400,
                    height: 1001,
                    caption: "Initial Application Flow",
                },
                {
                    src: "/images/case-studies/hack-western/hw-ideation-3.png",
                    alt: "Revised user flow adding an avatar creation step and a draw-something step, plus an edit-and-share-stickers step after submission",
                    width: 2400,
                    height: 769,
                    caption: "Revamped Application Flow",
                },
            ]}
        />
      </Section>

      <Section
        id="wireframing"
        tag="Wireframing"
        headline="To kick off the user interface design, I explored a few options for navigation and how to display personalized stickers."
        body="I wanted the interface to reflect the infinite canvas theme, while staying intuitive to use. Thus, I focused on keeping the core interactions familiar."
      >
        <ImageBlock
          src="/images/case-studies/hack-western/hw-ideation-4.png"
          alt="Wireframe comparison of navigation layouts, with the side panel navigation option selected as the final direction"
          width={2400}
          height={1660}
          caption="Wireframe Explorations"
        />
        <p className="text-base text-neutral-600">I decided on a side panel, with the stickers stacked at the back for a few key reasons:</p>

          <Callout
            label="Reflecting Figma's interface"
            heading="The side panel navigation mirrors Figma’s user interface, aligning with our infinite canvas theme and keeping navigation familiar."
          />
          <Callout
            label="Reducing visual clutter"
            heading="With side panel navigation, a fixed sticker book made the layout feel cramped, while scattered stickers better reinforced the sense of openness and creativity."
          />
          
          <li><b className="font-semibold">1. Reflecting Figma's interface</b> - The side panel navigation mirrors Figma’s user interface, aligning with our infinite canvas theme and keeping navigation familiar.</li>
          <li><b className="font-semibold">2. Reducing visual clutter</b> - With side panel navigation, a fixed sticker book made the layout feel cramped, while scattered stickers better reinforced the sense of openness and creativity.</li>

      </Section>

      <Section
        id="designing-for-mobile"
        tag="Designing for Mobile"
        headline="With the web designs established, I needed a creative way to include personalized stickers on mobile, where there wasn't enough space to display them in the background."
        primary
      >
        <TwoColumn
          ratio="3/2"
          left={
            <ImageBlock
              height={300}
            />
          }
          right={
            <p className="text-base text-neutral-600">
              On the desktop version, stickers appear based on a user&rsquo;s answers. For example,
              selecting Mathematics/Statistics as my major would surface a &ldquo;Math/Stats&rdquo; sticker
              in the background.
            </p>
          }
        />
        <p className="text-base text-neutral-600">
          Our solution was a sticker drawer: a hidden panel that opened when users tapped a floating
          sticker icon in the navigation. This allowed users to view their collected stickers without
          cluttering the smaller mobile layout.
        </p>
        <ImageBlock 
          height={450}
          caption="Mobile Sticker Drawer" />
        <TwoColumn
          left={
            <Callout
              label="Discovery"
              heading="During prototype testing, users often missed the sticker drawer since the generic button gave little reason to click it."
              body="To make it more discoverable and fun, we set the drawer icon to display the last sticker a user earned."
            />
          }
          right={<ImageBlock height={200} />}
        />
      </Section>

      <Section
        id="stickerbook"
        tag="The Stickerbook"
        headline='I created a "sticker book" feature to create a personalized token for applicants to save, share, and bring into the event.'
        body="Accessible from their dashboard, the sticker book carried forward into the actual event, where participants could unlock
        new stickers by completing tasks. It also included an option to share their collections on social media, helping spread the word
         and inviting more first-time hackers to join the community."
        primary
      >
        <ImageBlock
          src="/images/case-studies/hack-western/hw-stickerbook.png"
          alt="Stickerbook page where applicants drag and arrange their collected stickers, with a submission confirmation and share option"
          width={2400}
          height={1590}
          caption="Applicant Stickerbook Overview"
        />
      </Section>

      <Section
        id="final-product"
        tag="Final Product"
        headline="The redesigned portal shipped to 2,000+ hackers and received overwhelmingly positive feedback!"
        primary
      >
        <ImageBlock
          src="/images/case-studies/hack-western/hw-overview.png"
          alt="Screens from the Hack Western 12 application portal, including the long answers step, character customization, application review, and landing page"
          width={2400}
          height={1213}
        />
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
