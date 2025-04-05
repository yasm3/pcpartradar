import { ServerType } from "../app";
import {
  componentInfoHandler,
  componentSearchHandler,
} from "../controllers/components";
import {
  ComponentInfoSchema,
  ComponentSearchSchema,
} from "../schemas/components";

export async function componentRoutes(server: ServerType) {
  server.get(
    "/:slug",
    {
      schema: ComponentInfoSchema,
    },
    componentInfoHandler
  );

  server.get("/", { schema: ComponentSearchSchema }, componentSearchHandler);
}
