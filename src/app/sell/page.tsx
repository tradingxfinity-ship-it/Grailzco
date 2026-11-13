import type { Metadata } from "next";
import { SubmissionForm } from "@/components/sell/SubmissionForm";
import { Reassurance, SellAside, SellHero, SellingTips } from "@/components/sell/SellSections";

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
      <SellHero />
      <section id="submit" aria-label="Submission form" className="relative pb-24 md:pb-32">
        <div className="container-grail grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-8">
            <SubmissionForm />
          </div>
          <div className="lg:col-span-4">
            <SellAside />
          </div>
        </div>
      </section>
      <SellingTips />
      <Reassurance />
    </>
  );
}
