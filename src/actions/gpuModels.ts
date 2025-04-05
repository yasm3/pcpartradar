import { db } from "../app";
import { gpuModels } from "../db/schema/components";

export function getAllGpuModels() {
  return db
    .select({
      name: gpuModels.name,
      slug: gpuModels.slug,
      manufacturer: gpuModels.manufacturer,
    })
    .from(gpuModels);
}
