import { db } from "../app";
import { brands } from "../db/schema/components";

export function getAllBrands() {
  return db
    .select({
      name: brands.name,
      slug: brands.slug,
    })
    .from(brands);
}
