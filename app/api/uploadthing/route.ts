import { RouteHandlerConfig } from "@/shared/lib/uploadThingsConfig";
import { ourFileRouter } from "./core";
import { createRouteHandler } from "uploadthing/next";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: RouteHandlerConfig,
});
