import { FastifyReply, FastifyRequest } from "fastify";
import { getAllBrands } from "../actions/brands";

export async function BrandsAllGet(req: FastifyRequest, rep: FastifyReply) {
  const brands = await getAllBrands();
  rep.code(200).send(brands);
}
