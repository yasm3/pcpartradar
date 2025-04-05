import {
  index,
  integer,
  pgEnum,
  pgTable,
  real,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { components } from "./components";

export const currenciesEnum = pgEnum("currencies", [
  "EUR",
  "USD",
  "JYP",
  "GBP",
  "AUD",
  "CAD",
  "CHF",
  "CNH",
  "SEK",
  "NZD",
]);

export const vendors = pgTable("vendors", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull().unique(),
  slug: varchar().notNull().unique(),
  website: varchar().notNull().unique(),
});

export const prices = pgTable(
  "prices",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    componentId: integer("component_id")
      .references(() => components.id)
      .notNull(),
    price: real().notNull(),
    currency: currenciesEnum().notNull().default("EUR"),
    vendorId: integer("vendor_id")
      .references(() => vendors.id)
      .notNull(),
    url: varchar().notNull(),
    scrapedAt: timestamp("scraped_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("scraped_at_idx").on(table.scrapedAt)]
);
