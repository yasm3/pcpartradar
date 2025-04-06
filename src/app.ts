import "dotenv/config";
import fastify, {
  ContextConfigDefault,
  FastifyBaseLogger,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
  RouteGenericInterface,
} from "fastify";
import { drizzle } from "drizzle-orm/node-postgres";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { componentRoutes } from "./routes/components";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { auth } from "./middlewares/auth";
import { brandsRoutes } from "./routes/brands";
import { categoriesRoutes } from "./routes/categories";
import { gpuModelsRoutes } from "./routes/gpuModels";
import { registerScrapeTasks } from "./scraper";
import { logger } from "./utils/logger";
import fastifyStatic from "@fastify/static";
import path from "node:path";

export const db = drizzle(process.env.DATABASE_URL!);

const server = fastify().withTypeProvider<TypeBoxTypeProvider>();

// help to automaticly infer routes and handlers
export type ServerType = typeof server;
export type FastifyTypeBox = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  FastifyBaseLogger,
  TypeBoxTypeProvider
>;

export type FastifyRequestTypeBox<TSchema extends FastifySchema> =
  FastifyRequest<
    RouteGenericInterface,
    RawServerDefault,
    RawRequestDefaultExpression,
    TSchema,
    TypeBoxTypeProvider
  >;

export type FastifyReplyTypeBox<TSchema extends FastifySchema> = FastifyReply<
  RouteGenericInterface,
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  ContextConfigDefault,
  TSchema,
  TypeBoxTypeProvider
>;

server.get("/api/health", async (req, rep) => {
  rep.code(200).send({ status: "OK", latestApiVersion: "1" });
});

(async function () {
  // swagger
  server.register(fastifySwagger, {
    openapi: {
      openapi: "3.0.0",
      info: {
        title: "PCPartRadar API",
        version: "V1",
      },
      servers: [
        {
          url: "http://localhost:3000",
          description: "Development server",
        },
        {
          url: "https://pcpartradar.com",
          description: "Production server",
        },
      ],
      tags: [],
      components: {
        securitySchemes: {
          apiKey: {
            type: "apiKey",
            name: "x-api-key",
            in: "header",
          },
        },
      },
    },
  });

  server.register(fastifySwaggerUi, {
    routePrefix: "/api/v1/documentation",
    uiConfig: {
      docExpansion: "list",
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });

  server.register(fastifyStatic, {
    root: path.join(__dirname, "public"),
  });

  server.get("/", (req, rep) => {
    rep.sendFile("index.html");
  });

  // register routes
  const apiPrefix = "/api/v1";
  server.register(componentRoutes, { prefix: apiPrefix + "/components" });
  server.register(brandsRoutes, { prefix: apiPrefix + "/brands" });
  server.register(categoriesRoutes, { prefix: apiPrefix + "/categories" });
  server.register(gpuModelsRoutes, { prefix: apiPrefix + "/gpuModels" });
  server.addHook("preHandler", auth);

  server.listen(
    {
      port: 3000,
      host: "::",
    },
    (err, addr) => {
      if (err) {
        logger.error(err.message);
        process.exit(1);
      }
      logger.info(`Server listenting at ${addr}`);
      server.swagger();
      registerScrapeTasks();
    }
  );
})();
