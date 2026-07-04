import { Section } from "@/components/cs/Section"
import { Callout } from "@/components/cs/Callout"
import { TwoColumn } from "@/components/cs/TwoColumn"
import { ImageBlock } from "@/components/cs/ImageBlock"
import { Outcomes } from "@/components/cs/Outcomes"

export default function HackWestern() {
  return (
    <div className="flex flex-col gap-20">
      <Section
        id="overview"
        tag="Overview"
        headline="Hack Western is one of the biggest student-run hackathons in Canada, with 400+ participants and 2,000+ applicants each year."
        body="As a Design Organizer, I led the design of our Hack Western XII application portal, with the goal of making applying feel welcoming and fun."
        primary
      >
        <ImageBlock height={280} />
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
        headline="Our goal was to make Hack Western XII feel like a safe, welcoming place for anyone new to tech."
        primary
      >
        <ImageBlock height={280} />
      </Section>

      <Section
        id="theme"
        tag="Creating the Theme"
        headline="We started by creating a theme for Hack Western XII that would carry through every part of the hackathon."
        body="My teammate led a short open-ended questionnaire asking participants to share how each theme concept made them feel. Most described the clean, pastel, scrapbook-inspired direction as the most welcoming and interesting."
        primary
      >
        <ImageBlock height={280} />

         <Section
          id="theme reveal"
          tag="We landed on..."
          headline="Introducing Hack Western XII: The world is your canvas."
        >
      </Section>

      </Section>


      <Section
        id="app-portal-ideation"
        tag="Application Portal Ideation"
        headline="After defining the theme, I began brainstorming features that would make the application experience feel fun and unique."
        body="Ideas ranged from personalized, customizable visuals to interactive, collaborative boards. In the end, we focused on three key features: personalized stickers that changed based on responses, customizable avatars, and a &ldquo;draw something&rdquo; question. These features struck a balance between technical feasibility and playful expression."
        primary
      >
        <ImageBlock height={280} />
      </Section>

      <Section
        id="revamping-the-user-flow"
        tag="Revamping the User Flow"
        headline="I simplified the application flow from past years and mapped out where to add each of the new delight features."
        body="In previous years, technical constraints required an extra &ldquo;application dashboard&rdquo; page between logging in and filling out the form. With those limitations removed, users could now go straight from signing in to their application, returning directly where they left off."
      >
        <ImageBlock height={280} />
      </Section>

      <Section
        id="designing-for-mobile"
        tag="Designing for Mobile"
        headline="With the web designs established, I needed a creative way to include personalized stickers on mobile, where there wasn't enough space to display them in the background."
        primary
      >
        <TwoColumn
          ratio="3/2"
          left={<ImageBlock height={320} />}
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
        <ImageBlock height={280} />
        <TwoColumn
          left={
            <Callout
              label="Key Discovery"
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
        <ImageBlock height={280} />
      </Section>

      <Section
        id="final-product"
        tag="Final Product"
        headline="The redesigned portal shipped to 2,000+ hackers and received overwhelmingly positive feedback!"
        primary
      >
        <ImageBlock height={280} />
      </Section>

      <Section
        id="reflection"
        tag="it's done! what did i learn?"
        headline=""
        primary
      >
        <h2 className="text-2xl font-normal leading-[1.2] text-primary">
          A good design system leaves nothing unsaid
        </h2>
        <p className="text-base leading-normal text-neutral-500">
          I learned that a good design system is more than just a set of components and rules. It should also include clear documentation and examples, so that anyone can understand how to use it effectively. This ensures consistency and quality across the product, even when different designers or developers are working on it.
        </p>
         <h2 className="text-2xl font-normal leading-[1.2] text-primary">
          😛
        </h2>
        <p className="text-base leading-normal text-neutral-500">
          😺
        </p>
      </Section>
    </div>
  )
}
