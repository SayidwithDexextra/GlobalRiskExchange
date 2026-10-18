import type { Metadata } from "next";
import { Header } from "@/components/Header";
import TeamPage from "@/components/team/TeamPage";

export const metadata: Metadata = {
  title: "Team | Dexetera",
  description: "The people building Dexetera, a live exchange for real-world markets.",
};

export default function Page() {
  return (
    <>
      <Header currentPath="/team" />
      <TeamPage />
    </>
  );
}
