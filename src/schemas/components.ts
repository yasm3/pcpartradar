import { Type } from "@fastify/type-provider-typebox";

export const ComponentInfoSchema = {
  params: Type.Object({
    slug: Type.String(),
  }),
};
