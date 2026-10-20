// Team page content. Edit this file to change names, bios, tags, links or add a photo.
// To use a headshot: put the image in /public/team/ and set `photo: "/team/sayid.jpg"`.
// The monogram (initials) shows whenever `photo` is empty.

export type TeamLink = { kind: "linkedin" | "x" | "crunchbase"; href: string; label: string };

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
    role: "FOUNDER & CEO",
    photo: "/team/sayid.jpg",
    bio: "Sayid started Dexetera to give risks that never had a market, from El Niño to GPU rental rates, a place to be priced and hedged, and he leads the engineering behind it. Before Dexetera he founded GPlay Studios, a play-to-earn blockchain game studio, and built Web3 commerce infrastructure and Ethereum smart contracts as a full-stack engineer at Mueshi Global. He is also an eMerge Americas Hackathon winner.",
    tags: ["eMerge Americas", "GPlay Studios", "Mueshi Global"],
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
    bio: "Marc has spent nearly three decades turning new technology into Miami companies. He built Digiport, an early data center and hosting provider, launched the Incubate Miami accelerator in 2009, and co-founded Itopia and the boat rental marketplace Boatsetter. Today he is founder and CEO of Blackdove, the digital art platform, and Media Distribution Exchange. A Penn economics graduate and CPA, he brings an operator's discipline to Dexetera.",
    tags: ["Blackdove", "MDX", "Boatsetter", "Itopia", "Incubate Miami"],
    links: [
      { kind: "linkedin", href: "https://www.linkedin.com/in/marcbillings", label: "Marc Billings on LinkedIn" },
    ],
  },
  {
    initials: "CH",
    name: "Cyril H.",
    role: "INVESTOR",
    photo: "/team/cyril.jpg",
    bio: "Cyril helped invent how the internet knows where you are. He founded InfoSplit in 1999, patented core IP geolocation technology still used across the web, and sold the company to Quova in 2004. He went on to build Navizon, one of the first systems to locate phones from Wi-Fi and cell signals rather than GPS, and led Dexetera's friends and family round.",
    tags: ["InfoSplit", "Navizon"],
    links: [
      { kind: "crunchbase", href: "https://www.crunchbase.com/person/cyril-houri", label: "Cyril H. on Crunchbase" },
    ],
  },
];
