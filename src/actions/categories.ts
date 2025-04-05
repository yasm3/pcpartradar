import { db } from "../app";
import { categories } from "../db/schema/components";

export function getAllCategories() {
  return db
    .select({
      name: categories.name,
      slug: categories.slug,
    })
    .from(categories);
}
