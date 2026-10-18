// Route file for /team. Place at app/team/page.tsx (or src/app/team/page.tsx).
// Adjust the import path to wherever TeamPage.tsx lives (suggested: components/team/).
import type { Metadata } from "next";
import TeamPage from "@/components/team/TeamPage";

export const metadata: Metadata = {
  title: "Team | Dexetera",
  description: "The people building Dexetera, a live exchange for real-world markets.",
};

export default function Page() {
  return <TeamPage />;
}
