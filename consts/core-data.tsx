export interface Salle {
  id: string;
  title: string | null;
  image: string | null;
  description: string | null;
  coordinations: string | null;
}

export interface Sport {
  id: string;
  created_at: string; // ISO 8601 date string
  title: string | null;
  description: string | null;
  timetable: string | null; // HTML content
  image: string | null;
  SalleID: number | null; // Foreign key reference to Salles
  maxsubs: string;
  subs: string;
}

export type NotificationPayload = {
  id?: string;
  created_at?: Date;
  title?: string;
  type?: "primary" | "destructive" | "neutral";
  message?: string;
  userid?: string;
};

export interface Trainer {
  id: number;
  name: string;
  title: string;
  image: string;
  socials: {
    insta: string;
    facebook: string;
    twitter: string;
  };
}

export interface Review {
  id: string;
  name: string;
  text: string;
  image: string;
}

export interface SalleSubProps {
  id: string;
  created_at: Date;
  userid: string;
  salleid: string;
}

export interface SportSubProps {
  id: string;
  created_at: Date;
  userid: string;
  sportid: string;
}

export const trainers: Trainer[] = [
  {
    id: 1,
    name: "Jeff Nippard",
    title: "Bodybuilding Coach",
    image:
      "https://jeffnippard.com/cdn/shop/files/home-nutritionplan.png?v=1738445438&width=1740", // Replace with actual image if available
    socials: {
      insta: "https://www.instagram.com/jeffnippard",
      facebook: "https://www.facebook.com/jeffnippard",
      twitter: "https://twitter.com/jeffnippard",
    },
  },
  {
    id: 2,
    name: "Joe Holder",
    title: "Cardio & Wellness Expert",
    image:
      "https://images.squarespace-cdn.com/content/v1/5a3107092278e79ec2ad2365/1612922394630-SC6WPBR6E4JTKDSOZV3A/JH_04_1panel_16x9_unbranded.jpg", // Replace with actual image if available
    socials: {
      insta: "https://www.instagram.com/ochosystem",
      facebook: "https://www.facebook.com/ochosystem",
      twitter: "https://twitter.com/ochosystem",
    },
  },
  {
    id: 3,
    name: "Massy Arias",
    title: "Fitness & Health Coach",
    image:
      "https://www.greatestphysiques.com/wp-content/uploads/2016/10/12523621_485584338308243_615420364_n.jpg", // Replace with actual image if available
    socials: {
      insta: "https://www.instagram.com/massy.arias",
      facebook: "https://www.facebook.com/MassyAriasFit",
      twitter: "https://twitter.com/MassyArias",
    },
  },
];

export const reviews: Review[] = [
  {
    id: "1",
    name: "ali",
    text: "Une expérience géniale chez MFitness ! Ambiance motivante et équipe professionnelle. Je recommande vivement !",
    image:
      "https://img.freepik.com/premium-photo/handsome-smiling-indian-man-holding-smart-phone-shopping-online-street_695242-1230.jpg",
  },
  {
    id: "2",
    name: "sihem",
    text: "MFitness est un lieu où l'on se dépasse chaque jour. Un cadre agréable et une équipe dévouée qui vous aide à atteindre vos objectifs",
    image:
      "https://lig-membres.imag.fr/amery/wp-content/uploads/sites/148/2024/10/Sihem2024.jpg",
  },
];

export const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Les branches disponibles", href: "#branches" },
  { name: "offer", href: "#offer" },
  { name: "Trainers", href: "#trainers" },
  { name: "Contact", href: "#contact" },
];
