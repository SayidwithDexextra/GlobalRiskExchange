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
    role: "FOUNDER & CEO",
    photo: "/team/sayid.jpg",
    bio: "Technical founder of Dexetera and eMerge Americas Hackathon winner. Previously founded GPlay Studios, a play-to-earn blockchain gaming startup, and was a full-stack engineer at Mueshi Global.",
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
    bio: "Miami technology founder. Founder and CEO of Blackdove and Media Distribution Exchange. Previously founded Boatsetter, Itopia and the Incubate Miami accelerator.",
    tags: ["Blackdove", "MDX", "Boatsetter", "Incubate Miami"],
    links: [
      { kind: "linkedin", href: "https://www.linkedin.com/in/marcbillings", label: "Marc Billings on LinkedIn" },
    ],
  },
  {
    initials: "CH",
    name: "Cyril H.",
    role: "INVESTOR",
    photo: "/team/cyril.jpg",
    bio: "Pioneer of geolocation technology. Exited InfoSplit, founded Navizon and an early decentralized Bitcoin exchange, and funded Dexetera's $200,000 friends and family round.",
    tags: [],
    links: [],
  },
];
