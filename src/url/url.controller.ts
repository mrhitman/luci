import fastify, {FastifyRequest} from "fastify";
import {is, object, string} from "superstruct";

import {Connection} from "mongoose";
import {UrlSchema} from "./url.schema";

export function urlController(app: ReturnType<typeof fastify>) {
  app.get("/health", async () => {
    return "welcome to shorturl microservice";
  });

  app.get(
    "/:id",
    async (request: FastifyRequest<{Params: {id: string}}>, reply) => {
      const db = app.diContainer.resolve<Connection>("db");
      const UrlModel = db.model("Url", UrlSchema);

      const {id} = request.params;
      const model = await UrlModel.findById(id);

      if (!model) {
        reply
          .code(404)
          .header("Content-Type", "application/json; charset=utf-8")
          .send({
            message: "Not found",
          });
        return;
      }

      reply.redirect(model.url);
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

    const db = app.diContainer.resolve<Connection>("db");
    const UrlModel = db.model("Url", UrlSchema);

    const model = new UrlModel(request.body);
    await model.save();
    return model._id;
  });
}
