import type { Metadata } from "next";
import { SubmissionForm } from "@/components/sell/SubmissionForm";
import { Reassurance, SellAside, SellingTips } from "@/components/sell/SellSections";

export const metadata: Metadata = {
  title: "Sell Your Cards",
  description:
    "Submit your Pokémon and collectible trading cards to Grailz Co for review. Share card details and photos — we'll get in touch about next steps.",
  alternates: { canonical: "/sell" },
  openGraph: { title: "Sell Your Cards · Grailz Co", url: "/sell" },
};

export default function SellPage() {
  return (
    <>
      <section id="submit" aria-labelledby="sell-title" className="relative pb-24 pt-10 md:pb-32 md:pt-14">
        <div className="container-grail">
          <div className="mb-10 max-w-2xl md:mb-14">
            <p className="eyebrow flex items-center gap-2.5">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-mint" />
              Submit for review
            </p>
            <h1 id="sell-title" className="display-lg mt-4 text-white">
              Sell Your <span className="text-mint">Cards.</span>
            </h1>
            <p className="lede mt-4">Tell us what you&apos;ve got. Every submission is reviewed individually, with no obligation.</p>
          </div>
          <SubmissionForm aside={<SellAside />} />
        </div>
      </section>
      <SellingTips />
      <Reassurance />
    </>
  );
}
