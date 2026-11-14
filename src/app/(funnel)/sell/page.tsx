import type { Metadata } from "next";
import { SubmissionForm } from "@/components/sell/SubmissionForm";

export const metadata: Metadata = {
  title: "Sell Your Cards for Cash",
  description:
    "Submit your Pokémon and collectible trading cards to Grailz Co for review. Answer a few quick questions, share photos, and we'll get in touch about next steps.",
  alternates: { canonical: "/sell" },
  openGraph: { title: "Sell Your Cards for Cash · Grailz Co", url: "/sell" },
};

export default function SellPage() {
  return (
    <div className="container-grail h-full pb-4 sm:pb-6">
      <SubmissionForm />
    </div>
  );
}
