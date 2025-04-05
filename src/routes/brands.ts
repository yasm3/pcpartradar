import { ServerType } from "../app";
import { BrandsAllGet } from "../controllers/brands";

export async function brandsRoutes(server: ServerType) {
  server.get("/", BrandsAllGet);
}
