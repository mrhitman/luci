import {Lifetime, asFunction} from "awilix";

import {UrlSchema} from "./url/url.schema";
import {UrlService} from "./url/url.service";
import {createClient} from "redis";
import {createConnection} from "mongoose";
import {diContainer} from "@fastify/awilix";
import fastify from "fastify";

export function registerContainer(app: ReturnType<typeof fastify>) {
  diContainer.register({
    db: asFunction(() => createConnection(process.env.DB_URL!), {
      lifetime: Lifetime.SINGLETON,
      dispose: (module) => module.close(),
    }),
    cache: asFunction(
      () => {
        const client = createClient({url: process.env.REDIS_URL! });
        client.connect();
        return client;
      },
      {lifetime: Lifetime.SINGLETON}
    ),
    urlModel: asFunction(({db}) => db.model("Url", UrlSchema)),
  });

  app.addHook("onRequest", (request, reply, done) => {
    request.diScope.register({
      urlService: asFunction(
        ({urlModel, cache}) => new UrlService(urlModel, cache),
        {lifetime: Lifetime.SINGLETON}
      ),
    });
    done();
  });
}
