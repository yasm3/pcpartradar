import { getComponent, getLatestComponentPricesByVendor } from "../actions/components";
import { FastifyRequestTypeBox } from "../app";
import { ComponentInfoSchema } from "../schemas/components";

export const componentInfoHandler = async (
  req: FastifyRequestTypeBox<typeof ComponentInfoSchema>
) => {
  const { slug } = req.params;
  const component = (await getComponent(slug))[0];
  const prices = (await getLatestComponentPricesByVendor(component.id));
  return { ...component, prices };
};
