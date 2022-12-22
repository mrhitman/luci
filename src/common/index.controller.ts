import { ConfigService } from './config.service';
import fastify from "fastify";

export function indexController(app: ReturnType<typeof fastify>) {
  app.get("/", async () => {
    return "welcome to shorturl microservice";
  });

  app.get("/version", () => {
    const config = app.diContainer.resolve<ConfigService>('config');
    return config.version;
  });
}
