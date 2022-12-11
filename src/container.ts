import {Lifetime, asFunction} from "awilix";

import {UrlService} from "./url/url.service";
import {createClient} from "redis";
import {createConnection} from "mongoose";
import {diContainer} from "@fastify/awilix";
import fastify from "fastify";

export function registerContainer(app: ReturnType<typeof fastify>) {
  diContainer.register({
    db: asFunction(() => createConnection(process.env.DB_CONNECTION!), {
      lifetime: Lifetime.SINGLETON,
      dispose: (module) => module.close(),
    }),
    cache: asFunction(
      () => {
        const client = createClient({url: "redis://127.0.0.1:6379"});
        client.connect();
        return client;
      },
      { lifetime: Lifetime.SINGLETON }
    ),
  });

  app.addHook("onRequest", (request, reply, done) => {
    request.diScope.register({
      urlService: asFunction(
        ({db, cache}) => {
          return new UrlService(db, cache);
        },
        { lifetime: Lifetime.SCOPED }
      ),
    });
    done();
  });
}
