import { ICreateUrlDto, UrlService } from './url.service';
import fastify, { FastifyRequest } from "fastify";
import { is, object, string } from "superstruct";

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
        return reply
          .code(404)
          .header("Content-Type", "application/json; charset=utf-8")
          .send({
            message: "Not found",
          });
      }

      reply.redirect(url);
    }
  );

  app.post("/url", async (request, reply) => {
    const { body } = request;
    if (!isUrl(body)) {
      return reply
        .code(400)
        .header("Content-Type", "application/json; charset=utf-8")
        .send({
          message: "Invalid request",
        });
    }

    const urlService = request.diScope.resolve<UrlService>('urlService');
    return urlService.createUrl(body);
  });

  function isUrl(data: unknown): data is ICreateUrlDto {
    return is(data, object({url: string()}));
  }
}
