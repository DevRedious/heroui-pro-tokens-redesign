import {
  Book,
  ChartColumn,
  CreditCard,
  Gear,
  House,
  Key,
  LayoutHeaderSideContent,
  Persons,
  Rocket,
} from "@gravity-ui/icons";

interface NavItem {
  icon: typeof House;
  id: string;
  label: string;
}

interface NavSection {
  items: NavItem[];
  label?: string;
}

/** Mirrors the navigation of the current HeroUI Pro dashboard. */
export const NAV_SECTIONS: NavSection[] = [
  {
    items: [
      { icon: House, id: "home", label: "Home" },
      { icon: ChartColumn, id: "usage", label: "Usage" },
    ],
  },
  {
    label: "Library",
    items: [
      { icon: LayoutHeaderSideContent, id: "design-systems", label: "Design Systems" },
      { icon: Gear, id: "license-card", label: "License Card" },
    ],
  },
  {
    label: "Account",
    items: [
      { icon: Key, id: "tokens", label: "Tokens" },
      { icon: Persons, id: "members", label: "Members" },
      { icon: CreditCard, id: "billing", label: "Billing" },
    ],
  },
  {
    label: "Resources",
    items: [
      { icon: Book, id: "documentation", label: "Documentation" },
      { icon: Rocket, id: "roadmap", label: "Roadmap" },
    ],
  },
];

/** Page rendered by this proposal. */
export const CURRENT_PAGE_ID = "tokens";
