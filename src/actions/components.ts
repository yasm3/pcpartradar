import { desc, eq, sql } from "drizzle-orm";
import { db } from "../app";
import {
  brands,
  categories,
  components,
  gpuModels,
} from "../db/schema/components";
import { prices, vendors } from "../db/schema/vendors";

export function getComponent(slug: string) {
  return db.select().from(components).where(eq(components.slug, slug)).limit(1);
}

export async function getLatestComponentPricesByVendor(componentId: number) {
  const latestPrices = await db
    .select({
      vendorName: vendors.name,
      price: prices.price,
      currency: prices.currency,
      url: prices.url,
      scrapedAt: prices.scrapedAt,
    })
    .from(prices)
    .where(eq(prices.componentId, componentId))
    .innerJoin(vendors, eq(prices.vendorId, vendors.id))
    .orderBy(prices.vendorId, desc(prices.scrapedAt));

  const deduped = new Map<string, (typeof latestPrices)[0]>();
  latestPrices.forEach((price) => {
    if (!deduped.has(price.vendorName)) {
      deduped.set(price.vendorName, price);
    }
  });

  return Array.from(deduped.values());
}

export async function getPaginatedComponents(pageNum: number) {
  const maxByPage = 5; // 5 components by page
  const offset = (pageNum - 1) * maxByPage;
  const componentsResult = await db
    .select()
    .from(components)
    .limit(maxByPage)
    .offset(offset);

  return componentsResult;
}

export async function getComponentByName(name: string) {
  return await db
    .select({
      name: components.name,
      slug: components.slug,
      imageUrl: components.imageUrl,
      category: categories.name,
      brand: brands.name,
      gpuModel: gpuModels.name,
      createdAt: components.createdAt,
    })
    .from(components)
    .where(
      sql`to_tsvector('english', ${components.name}) @@ to_tsquery('english', ${name})`
    )
    .innerJoin(categories, eq(components.categoryId, categories.id))
    .innerJoin(brands, eq(components.brandId, brands.id))
    .innerJoin(gpuModels, eq(components.gpuModelId, gpuModels.id))
    .orderBy(components.createdAt);
}

interface ComponentAddData {
  name: string;
  slug: string;
  categoryId: number;
  brandId: number;
  gpuModelId: number;
  imageUrl: string;
}

export async function addComponent({
  name,
  slug,
  categoryId,
  brandId,
  gpuModelId,
  imageUrl,
}: ComponentAddData) {
  try {
    await db.insert(components).values({
      name,
      slug,
      categoryId,
      brandId,
      gpuModelId,
      imageUrl,
    });
  } catch (e) {
    return { error: "no insert possible" };
  }
  return { message: "success" };
}
