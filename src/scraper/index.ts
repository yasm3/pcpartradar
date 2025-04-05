import "dotenv/config";
import { CronJob } from "cron";
import { db } from "../app";
import { prices, vendors } from "../db/schema/vendors";
import { eq } from "drizzle-orm";
import { scrapeLDLC } from "./drivers/ldlc";
import { logger } from "../utils/logger";

export async function registerScrapeTasks() {
  logger.info("Registering scrape tasks...");

  const updatePriceJob = new CronJob(
    process.env.CRON_UPDATE_PRICES as string,
    updatePrices,
    null,
    true,
    "Europe/Paris"
  );

  logger.info("All tasks registered");
}

async function updatePrices() {
  logger.info("Updating Prices...");
  const data = await db
    .select({
      id: prices.id,
      url: prices.url,
      vendor: vendors.slug,
      price: prices.price,
    })
    .from(prices)
    .innerJoin(vendors, eq(prices.vendorId, vendors.id));
  data.forEach(async ({ id, url, vendor, price }) => {
    logger.debug(`Updating component ${id} on ${vendor}`);
    try {
      if (vendor === "ldlc") {
        const { price: newPrice } = await scrapeLDLC(url);

        if (price === newPrice) {
          logger.debug("Price is the same on component " + id);
          return;
        }

        await db
          .update(prices)
          .set({ price: newPrice })
          .where(eq(prices.id, id));
        logger.debug("Updated component " + id);
      } else {
        logger.error(`Unknown "${vendor}" vendor`);
      }
    } catch (e) {
      logger.error("Error during scrape");
    }
  });
}
