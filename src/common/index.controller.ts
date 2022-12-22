import fastify, { FastifyInstance } from "fastify";

import { ConfigService } from "./config.service";
import { OAuth2Namespace } from '@fastify/oauth2';

type FastifyOAuthInstance = FastifyInstance & { googleOAuth2: OAuth2Namespace };

export function indexController(app: ReturnType<typeof fastify>) {
  app.get("/", async (request, reply) => {
    const session = request.session.get('data');
    return reply.view("login.ejs", { isLogined: !!session });
  });

  app.get("/auth/google/callback", async function (request, reply) {
    try {
      const token = await (this as FastifyOAuthInstance)
        .googleOAuth2
        .getAccessTokenFromAuthorizationCodeFlow(request);

      request.session.set('data', JSON.stringify(token));
      reply.redirect("/");
    } catch (e) {
      reply.code(400).send("Invalid request");
    }
  });

  app.get("/auth/logout", async (request, reply) => {
    request.session.delete();
    reply.redirect("/");
  });

  app.get("/version", function () {
    const config = app.diContainer.resolve<ConfigService>("config");
    return config.version;
  });
}
