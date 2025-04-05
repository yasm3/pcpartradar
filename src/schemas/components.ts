import { Type } from "@fastify/type-provider-typebox";

export const ComponentInfoSchema = {
  params: Type.Object({
    slug: Type.String(),
  }),
  response: {
    404: Type.Object({
      error: Type.String(),
    }),
  },
};

export const ComponentSearchSchema = {
  querystring: Type.Object({
    page: Type.Optional(Type.Number({ minimum: 1 })),
    name: Type.Optional(Type.String({ minLength: 3 })),
  }),
};
