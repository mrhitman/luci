import { diContainer, fastifyAwilixPlugin } from "@fastify/awilix";

import { ConfigService } from './common/config.service';
import OAuthPlugin from '@fastify/oauth2';
import fastify from "fastify";
import fastifySecureSession from '@fastify/secure-session';
import fastifyView from '@fastify/view';
import { indexController } from './common/index.controller';
import { registerContainer } from './common/app.container';
import { urlController } from "./url/url.controller";

async function bootstrap() {
  const app = fastify({ logger: true });
  app.register(fastifyAwilixPlugin, { disposeOnClose: true, disposeOnResponse: true });
  await registerContainer(app);
  const config = await diContainer.resolve<ConfigService>('config');
  app.register(fastifyView, config.templatesConfig);
  app.register(OAuthPlugin, config.OAuthConfig);
  app.register(fastifySecureSession, config.cookieConfig);

  indexController(app);
  urlController(app);

  app.listen({ port: config.port }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    global.console.log(`Server listening at ${address}`);
  });
}

bootstrap();
