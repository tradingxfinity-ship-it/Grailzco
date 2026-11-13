import type { Metadata } from "next";
import { Faq, GoodSubmission, HowHero, Journey } from "@/components/how/HowSections";
import { FinalCta } from "@/components/ui/FinalCta";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "How selling your cards to Grailz Co works: share your collection, we review it, and we get in touch about an offer or next steps.",
  alternates: { canonical: "/how-it-works" },
  openGraph: { title: "How It Works · Grailz Co", url: "/how-it-works" },
};

export default function HowItWorksPage() {
  return (
    <>
      <HowHero />
      <Journey />
      <GoodSubmission />
      <Faq />
      <FinalCta
        id="how-cta-title"
        lines={["Ready to Show Us", "Your *Collection?*"]}
        body="It only takes a few minutes to tell us what you've got."
        cta="Start Your Submission"
      />
    </>
  );
}
