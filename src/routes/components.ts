import { ServerType } from "../app";
import {
  componentAddHandler,
  componentInfoHandler,
  componentSearchHandler,
} from "../controllers/components";
import {
  ComponentAddSchema,
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

  server.post("/", { schema: ComponentAddSchema }, componentAddHandler);
}
