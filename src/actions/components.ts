import { desc, eq } from "drizzle-orm";
import { db } from "../app";
import { components } from "../db/schema/components";
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
  latestPrices.forEach(price => {
    if (!deduped.has(price.vendorName)) {
      deduped.set(price.vendorName, price);
    }
  });

  return Array.from(deduped.values());
}
