import { config } from "dotenv";
import fastify from "fastify";
import { fastifyAwilixPlugin } from "@fastify/awilix";
import { registerContainer } from './container';
import { urlController } from "./url/url.controller";

function bootstrap() {
  config();

  const port = Number(process.env.PORT ?? 8080);
  const app = fastify({
    logger: true,
  });
  debugger;
  app.register(fastifyAwilixPlugin, {
    disposeOnClose: true,
    disposeOnResponse: true,
  });
  registerContainer(app);
  urlController(app);

  app.listen({port}, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    global.console.log(`Server listening at ${address}`);
  });
}

bootstrap();
