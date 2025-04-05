import axios from "axios";
import * as cheerio from "cheerio";
import { logger } from "../../utils/logger";

export type LDLCScrapeResult = {
  name: string;
  mpn: string;
  available: boolean;
  price: number;
  currency: string;
  url: string;
};

export async function scrapeLDLC(url: string): Promise<LDLCScrapeResult> {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
      },
    });

    const $ = cheerio.load(data);
    const jsonLdRaw = $("script[type='application/ld+json']").html();

    if (!jsonLdRaw) {
      throw new Error("JSON-LD not found");
    }

    const jsonLd = JSON.parse(jsonLdRaw);

    const productData = jsonLd?.offers ? jsonLd : jsonLd[0];

    if (!productData?.offers) {
      throw new Error("Prices data not found in JSON-LD");
    }

    return {
      name: productData.name,
      mpn: productData.mpn,
      available:
        productData.offers.availability === "https://schema.org/InStock",
      price: parseFloat(productData.offers.price),
      currency: productData.offers.priceCurrency,
      url: productData.offers.url,
    };
  } catch (error) {
    logger.error("Error during LDLC scraping");
    throw error;
  }
}
