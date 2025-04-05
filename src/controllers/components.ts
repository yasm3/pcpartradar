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
  req: FastifyRequestTypeBox<typeof ComponentInfoSchema>
) => {
  const { slug } = req.params;
  const component = (await getComponent(slug))[0];
  const prices = await getLatestComponentPricesByVendor(component.id);
  return { ...component, prices };
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
