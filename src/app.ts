import "dotenv/config";
import fastify from "fastify";
import { drizzle } from "drizzle-orm/node-postgres";

const db = drizzle(process.env.DATABASE_URL!);

const server = fastify();

server.get("/health", async (req, rep) => {
  return { status: "OK" };
});

(async function () {
  server.listen(
    {
      port: 3000,
    },
    (err, addr) => {
      if (err) {
        console.log(err);
        process.exit(1);
      }
      console.log(`Server listenting at ${addr}`);
    }
  );
})();
