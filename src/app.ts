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

server.get("/health", async (req, rep) => {
  return { status: "OK", latestApiVersion: "1" };
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
      ],
      tags: [],
      components: {
        securitySchemes: {
          apiKey: {
            type: "apiKey",
            name: "apiKey",
            in: "header",
          },
        },
      },
      externalDocs: {
        url: "https://swagger.io",
        description: "Find more info here",
      },
    },
  });
  server.register(fastifySwaggerUi, {
    routePrefix: "/api/v1/documentation",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next();
      },
      preHandler: function (request, reply, next) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });

  // register routes
  server.register(componentRoutes, { prefix: "/api/v1/components" });

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
      server.swagger();
    }
  );
})();
