import { Lifetime, asFunction } from 'awilix';

import { createClient } from 'redis';
import { createConnection } from 'mongoose';
import { diContainer } from '@fastify/awilix';
import fastify from 'fastify';

export function registerContainer(app: ReturnType<typeof fastify>) {
 diContainer.register({
   db: asFunction(() => createConnection(process.env.DB_CONNECTION!), {
     lifetime: Lifetime.SINGLETON,
     dispose: (module) => module.close(),
   }),
   cache: asFunction(() => createClient(), {
     lifetime: Lifetime.SINGLETON,
   }),
 });

 app.addHook('onRequest', (request, reply, done) => {
  done()
})
}
