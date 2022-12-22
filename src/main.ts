import { diContainer, fastifyAwilixPlugin } from "@fastify/awilix";

import { ConfigService } from './common/config.service';
import fastify from "fastify";
import { indexController } from './common/index.controller';
import { registerContainer } from './common/app.container';
import { urlController } from "./url/url.controller";

async function bootstrap() {
  const app = fastify({
    logger: true,
  });
  app.register(fastifyAwilixPlugin, {
    disposeOnClose: true,
    disposeOnResponse: true,
  });
  await registerContainer(app);
  indexController(app);
  urlController(app);
  const config = await diContainer.resolve<ConfigService>('config');

  app.listen({port: config.port}, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    global.console.log(`Server listening at ${address}`);
  });
}

bootstrap();
