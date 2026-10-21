import type { Metadata } from "next";

const title = "Whitepaper | Dexetera";
const description =
  "How Dexetera turns commercial risk into tradable futures: the problem, the protocol, settlement from public data, and who it is for.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/whitepaper" },
  openGraph: { title, description, url: "/whitepaper", siteName: "Dexetera", type: "article" },
  twitter: { card: "summary_large_image", title, description },
};

export default function WhitepaperLayout({ children }: { children: React.ReactNode }) {
  return children;
}
