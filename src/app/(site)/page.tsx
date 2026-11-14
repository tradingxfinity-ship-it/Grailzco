import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { Categories } from "@/components/home/Categories";
import { Journey } from "@/components/home/Journey";
import { Why } from "@/components/home/Why";
import { Whatnot } from "@/components/home/Whatnot";
import { FinalCta } from "@/components/ui/FinalCta";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Categories />
      <Journey />
      <Why />
      <Whatnot />
      <FinalCta
        id="final-cta-title"
        lines={["Your Collection", "Could Be *Next.*"]}
        body="Have cards you're considering selling? Show us what you've got."
        cta="Sell Your Cards"
      />
    </>
  );
}
