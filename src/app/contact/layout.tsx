import type { Metadata } from "next";

const title = "Contact | Dexetera";
const description =
  "Tell us the risk you want to hedge or the market you want to create. The Dexetera team will help you price it.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/contact" },
  openGraph: { title, description, url: "/contact", siteName: "Dexetera", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
