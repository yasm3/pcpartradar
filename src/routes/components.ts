import { FastifyInstance } from "fastify";

export async function productRoutes(server: FastifyInstance) {
  server.get("/:slug",(req, rep) => {
    return "salut";
  });
}
