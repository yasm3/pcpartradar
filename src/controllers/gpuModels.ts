import { FastifyReply, FastifyRequest } from "fastify";
import { getAllGpuModels } from "../actions/gpuModels";

export async function GpuModelsGetAll(req: FastifyRequest, rep: FastifyReply) {
  const gpuModels = await getAllGpuModels();
  rep.code(200).send(gpuModels);
}
