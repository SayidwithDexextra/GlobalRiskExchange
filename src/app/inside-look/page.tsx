import type { Metadata } from "next";
import { Header } from "@/components/Header";
import InsideLook from "@/components/inside-look/InsideLook";

const title = "Inside Look | Dexetera";
const description =
  "The three unhedged exposures Dexetera is building first: development cost, El Niño weather risk and power markets.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/inside-look" },
  openGraph: { title, description, url: "/inside-look", siteName: "Dexetera", type: "article" },
  twitter: { card: "summary_large_image", title, description },
};

// The site's hash scripts strip #development / #elnino / #power from the address bar before
// React runs. Capture the wanted section first so deep links and the header dropdown work.
const sectionCapture = `try{var h=(location.hash||'').slice(1);if(!h){h=sessionStorage.getItem('dx-scroll-target')||''}if(/^(development|elnino|power)$/.test(h)){window.__dxIL=h}}catch(e){}`;

export default function Page() {
  return (
    <>
      {/* The design sets literal "Manrope" / "JetBrains Mono" in its inline styles and SVG text. */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
        precedence="default"
      />
      <script dangerouslySetInnerHTML={{ __html: sectionCapture }} />
      <Header currentPath="/inside-look" />
      <InsideLook />
    </>
  );
}
