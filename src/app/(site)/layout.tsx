import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

/** Marketing pages: site header and footer around the content. */
export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
    </>
  );
}
