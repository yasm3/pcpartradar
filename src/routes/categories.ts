import { ServerType } from "../app";
import { CategoriesGetAll } from "../controllers/categories";

export async function categoriesRoutes(server: ServerType) {
  server.get("/", CategoriesGetAll);
}
