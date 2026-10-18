// Team page content. Edit this file to change names, bios, tags, links or add a photo.
// To use a headshot: put the image in /public/team/ and set `photo: "/team/sayid.jpg"`.
// The monogram (initials) shows whenever `photo` is empty.

export type TeamLink = { kind: "linkedin" | "x"; href: string; label: string };

export type TeamMember = {
  initials: string;
  name: string;
  role: string; // shown in mono caps
  bio: string;
  tags: string[];
  photo?: string;
  links: TeamLink[];
};

export const TEAM: TeamMember[] = [
  {
    initials: "SM",
    name: "Sayid M.",
    role: "FOUNDER, CEO & CTO",
    photo: "/team/sayid.jpg",
    bio: "Designed and shipped the full Dexetera protocol himself: the order book, smart contracts, settlement and the trading app, now live on mainnet.",
    tags: ["Protocol", "Order book", "Smart contracts", "Settlement"],
    links: [
      { kind: "linkedin", href: "https://www.linkedin.com/in/sayiddexetera", label: "Sayid M. on LinkedIn" },
      { kind: "x", href: "https://x.com/dexeteralabs", label: "Dexetera on X" },
    ],
  },
  {
    initials: "MB",
    name: "Marc B.",
    role: "ADVISOR",
    photo: "/team/marc.jpg",
    bio: "Miami technology founder. Founder and CEO of Blackdove and Media Distribution Exchange. Previously founded Boatsetter, Itopia and the Incubate Miami accelerator.",
    tags: ["Blackdove", "MDX", "Boatsetter", "Incubate Miami"],
    links: [
      { kind: "linkedin", href: "https://www.linkedin.com/in/marcbillings", label: "Marc Billings on LinkedIn" },
    ],
  },
  {
    initials: "CH",
    name: "Cyril Houri",
    role: "INVESTOR",
    photo: "/team/cyril.jpg",
    bio: "A founding father of geolocation technology. Serial founder and inventor with a real exit (InfoSplit), plus Navizon and an early decentralized Bitcoin exchange. Conceived and funded Dexetera, and carried the $200,000 friends and family round.",
    tags: [],
    links: [],
  },
];
