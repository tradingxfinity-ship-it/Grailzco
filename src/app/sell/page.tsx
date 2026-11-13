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
          <h1 id="sell-title" className="sr-only">
            Sell your cards to Grailz Co
          </h1>
          <SubmissionForm aside={<SellAside />} />
        </div>
      </section>
      <SellingTips />
      <Reassurance />
    </>
  );
}
