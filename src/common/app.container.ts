import { Lifetime, asFunction, asValue } from "awilix";
import mongoose, { ConnectOptions } from "mongoose";

import { ConfigService } from './config.service';
import { Url } from "../url/url.model";
import { UrlService } from "../url/url.service";
import { User } from '../user/user.model';
import { createClient } from "redis";
import { diContainer } from "@fastify/awilix";
import fastify from "fastify";

export async function registerContainer(app: ReturnType<typeof fastify>) {
  const config = new ConfigService();
  mongoose.set('strictQuery', false);
  await mongoose.connect(config.dbConfig, { useNewUrlParser: true } as ConnectOptions);

  diContainer.register({
    config: asValue(config),
    cache: asFunction(
      () => {
        const client = createClient({url: config.redisConfig });
        client.connect();
        return client;
      },
      {lifetime: Lifetime.SINGLETON}
    ),
    Url: asFunction(() => Url),
    User: asFunction(() => User),
  });

  app.addHook("onRequest", (request, reply, done) => {
    request.diScope.register({
      urlService: asFunction(
        ({Url, cache}) => new UrlService(Url, cache),
        {lifetime: Lifetime.SINGLETON}
      ),
    });
    done();
  });
}
