import type { Metadata } from "next";
import { SubmissionForm } from "@/components/sell/SubmissionForm";

export const metadata: Metadata = {
  title: "Sell Your Cards",
  description:
    "Submit your Pokémon and collectible trading cards to Grailz Co for review. Answer a few quick questions, share photos, and we'll get in touch about next steps.",
  alternates: { canonical: "/sell" },
  openGraph: { title: "Sell Your Cards · Grailz Co", url: "/sell" },
};

export default function SellPage() {
  return (
    <div className="container-grail pb-16 pt-4 md:pb-24 md:pt-8">
      <SubmissionForm />
    </div>
  );
}
