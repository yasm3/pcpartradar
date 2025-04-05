import "dotenv/config";
import { FastifyReply, FastifyRequest } from "fastify";

export async function auth(req: FastifyRequest, rep: FastifyReply) {
  if (["GET", "HEAD"].includes(req.method)) {
    return;
  }
  const apiKey = req.headers["x-api-key"];
  const knownApiKey = process.env.APIKEY;

  if (!apiKey || apiKey !== knownApiKey) {
    return rep.code(401).send({ error: "Unauthorized access" });
  }
}
