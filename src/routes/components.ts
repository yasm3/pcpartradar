import { ServerType } from "../app";
import { componentInfoHandler} from "../controllers/components";
import { ComponentInfoSchema } from "../schemas/components";

export async function componentRoutes(server: ServerType) {
  server.get(
    "/:slug",
    {
      schema: ComponentInfoSchema
    },
    componentInfoHandler
  );
}
