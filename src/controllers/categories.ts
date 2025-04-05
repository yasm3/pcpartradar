import { FastifyReply, FastifyRequest } from "fastify";
import { getAllCategories } from "../actions/categories";

export async function CategoriesGetAll(req: FastifyRequest, rep: FastifyReply) {
  const categories = await getAllCategories();
  rep.code(200).send(categories);
}
