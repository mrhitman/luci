import fastify, { FastifyRequest } from "fastify";
import { is, object, string } from "superstruct";

import { UrlService } from './url.service';

export function urlController(app: ReturnType<typeof fastify>) {
  app.get("/health", async () => {
    return "welcome to shorturl microservice";
  });

  app.get(
    "/:id",
    async (request: FastifyRequest<{Params: {id: string}}>, reply) => {
      const {id} = request.params;
      const urlService = request.diScope.resolve<UrlService>('urlService');
      const url = await urlService.getUrl(id);

      if (!url) {
        reply
          .code(404)
          .header("Content-Type", "application/json; charset=utf-8")
          .send({
            message: "Not found",
          });
        return;
      }

      reply.redirect(url);
    }
  );

  app.post("/url", async (request, reply) => {
    if (!is(request.body, object({url: string()}))) {
      reply
        .code(400)
        .header("Content-Type", "application/json; charset=utf-8")
        .send({
          message: "Invalid request",
        });
    }

    const urlService = request.diScope.resolve<UrlService>('urlService');
    return urlService.createUrl(request.body);
  });
}
