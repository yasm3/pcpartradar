import { FastifyReply } from "fastify";
import {
  getComponent,
  getComponentByName,
  getLatestComponentPricesByVendor,
  getPaginatedComponents,
} from "../actions/components";
import { FastifyRequestTypeBox } from "../app";
import {
  ComponentInfoSchema,
  ComponentSearchSchema,
} from "../schemas/components";

export const componentInfoHandler = async (
  req: FastifyRequestTypeBox<typeof ComponentInfoSchema>,
  rep: FastifyReply
) => {
  const { slug } = req.params;
  let prices = [];
  const component = await getComponent(slug);
  console.log(component);
  if (component.length === 0) {
    rep.code(404).send({
      error: "No Product Found",
    });
  } else {
    prices = await getLatestComponentPricesByVendor(component[0].id);
    rep.code(200).send({ ...component[0], prices });
  }
};

export const componentSearchHandler = async (
  req: FastifyRequestTypeBox<typeof ComponentSearchSchema>
) => {
  const { page = 1, name } = req.query;
  if (name) {
    return getComponentByName(name);
  }
  return getPaginatedComponents(page);
};
