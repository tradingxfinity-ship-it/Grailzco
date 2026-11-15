import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { Categories } from "@/components/home/Categories";
import { Journey } from "@/components/home/Journey";
import { Why } from "@/components/home/Why";
import { Reviews } from "@/components/home/Reviews";
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
      <Reviews />
      <Whatnot />
      <FinalCta
        id="final-cta-title"
        lines={["Ready to sell", "your *cards?*"]}
        body="It only takes a couple of minutes. Tell us what you've got and we'll take it from there."
        cta="Get Started"
      />
    </>
  );
}
