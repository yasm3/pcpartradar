import { FastifyReply } from "fastify";
import {
  addComponent,
  getComponent,
  getComponentByName,
  getLatestComponentPricesByVendor,
  getPaginatedComponents,
} from "../actions/components";
import { FastifyRequestTypeBox } from "../app";
import {
  ComponentAddSchema,
  ComponentInfoSchema,
  ComponentSearchSchema,
} from "../schemas/components";
import { logger } from "../utils/logger";

export const componentInfoHandler = async (
  req: FastifyRequestTypeBox<typeof ComponentInfoSchema>,
  rep: FastifyReply
) => {
  const { slug } = req.params;
  let prices = [];
  const component = await getComponent(slug);
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

export const componentAddHandler = async (
  req: FastifyRequestTypeBox<typeof ComponentAddSchema>,
  rep: FastifyReply
) => {
  const data = req.body;
  addComponent(data)
    .then((res) => {
      rep.code(201).send(res);
    })
    .catch((e) => {
      logger.error(e);
      rep.code(500).send({});
    });
};
