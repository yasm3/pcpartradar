import { ServerType } from "../app";
import { GpuModelsGetAll } from "../controllers/gpuModels";

export async function gpuModelsRoutes(server: ServerType) {
  server.get("/", GpuModelsGetAll);
}
