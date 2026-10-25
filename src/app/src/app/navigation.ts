export const navigationItems = [
  { key: "overview", icon: "◫" },
  { key: "products", icon: "▦" },
  { key: "sales", icon: "↗" },
  { key: "inventory", icon: "▤" },
  { key: "invoices", icon: "▧" },
  { key: "customers", icon: "♙" },
  { key: "employees", icon: "♧" },
  { key: "reports", icon: "▥" },
  { key: "settings", icon: "⚙" },
] as const;

export type SectionKey =
  (typeof navigationItems)[number]["key"];

export type NavigationItem =
  (typeof navigationItems)[number];

export const defaultSection: SectionKey = "overview";
  
