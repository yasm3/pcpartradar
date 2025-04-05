import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const gpuManufacturerEnum = pgEnum("gpu_manufacturer", [
  "nvidia",
  "amd",
  "intel",
]);

export const categories = pgTable("categories", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull().unique(),
  slug: varchar().notNull().unique(),
});

export const brands = pgTable("brands", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull().unique(),
  slug: varchar().notNull().unique(),
});

export const gpuModels = pgTable("gpu_models", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull().unique(),
  slug: varchar().notNull().unique(),
  manufacturer: gpuManufacturerEnum().notNull(),
});

export const components = pgTable(
  "components",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar().notNull().unique(),
    slug: varchar().notNull().unique(),
    imageUrl: varchar("image_url").notNull(),
    categoryId: integer("category_id")
      .references(() => categories.id)
      .notNull(),
    brandId: integer("brand_id")
      .references(() => brands.id)
      .notNull(),
    gpuModelId: integer("gpu_model_id").references(() => gpuModels.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("name_search_english_index").using(
      "gin",
      sql`to_tsvector('english', ${table.name})`
    ),
  ]
);
