import {
  CodeBracket,
  CreditCard,
  Heart,
  NoSymbol,
  ShieldCheck,
  UserGroup,
} from "svelte-hero-icons";
import type { IconSource } from "svelte-hero-icons";
export interface HeroProps {
  icon: IconSource;
  heading: string;
  text: string;
}

export const heroItems: HeroProps[] = [
  {
    heading: "No Fees",
    text: "Free for artists and for listeners. No more bills",
    icon: CreditCard,
  },
  {
    heading: "Community-Driven",
    text: "Users can donate to eachother and the platform to keep it running",
    icon: Heart,
  },
  {
    heading: "Secured by Stripe",
    text: "Payment details are secured by Stripe. Parachune does not handle your details",
    icon: ShieldCheck,
  },
  {
    heading: "No Advertisement",
    text: "Ad-block can take a break here, we dont run ads. With more users, we will need more donations",
    icon: NoSymbol,
  },
  {
    heading: "No AI",
    text: "We are pretty strong on AI and we have no plans to use AI in our codebase",
    icon: CodeBracket,
  },
];
