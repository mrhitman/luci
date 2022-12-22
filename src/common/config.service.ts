import OAuthPlugin from '@fastify/oauth2';
import { config } from 'dotenv';
import ejs from 'ejs';
import { resolve } from 'path';

export class ConfigService {
 constructor() {
  config();
 }

 get redisConfig(): string {
  return this.getEnvString('REDIS_URL');
 }

 get dbConfig(): string {
  return this.getEnvString('DB_URL');
 }

 get googleConfig(): { id: string, secret: string } {
  return {
   id: process.env.GOOGLE_CLIENT_ID!,
   secret: process.env.GOOGLE_CLIENT_SECRET!,
  }
 }

 get cookieConfig() {
  return {
   cookieName: 'luci-cookie',
   key: this.secret,
   cookie: {
    path: '/',
    httpOnly: true,
   }
  }
 }

 get OAuthConfig() {
  const {id, secret} = this.googleConfig;
  return {
   name: 'googleOAuth2',
   credentials: {
    client: { id, secret },
    auth: OAuthPlugin.GOOGLE_CONFIGURATION,
   },
   scope: ['email', 'profile'],
   startRedirectPath: '/auth/google',
   callbackUri: 'http://localhost:3000/auth/google/callback'
  }
 }

 get templatesConfig() {
  return { engine: { ejs }, root: resolve(__dirname, "..", 'templates') };
 }

 get port(): number {
  return this.getEnvNumber('PORT', 8080);
 }

 get secret(): Buffer {
  return Buffer.from(this.getEnvString('SECRET'));
 }

 get version(): string {
  return process.env.npm_package_version!;
 }

 protected getEnvString(name: string, defaultValue?: string): string | never {
  const value = process.env[name] ?? defaultValue;

  if (value === undefined) {
   throw new Error(`No required config param:${name}`);
  }

  return value;
 }

 protected getEnvNumber(name: string, defaultValue?: number): number | never {
  const value = this.getEnvString(name, defaultValue?.toString());

  if (Number.isNaN(value)) {
   throw new Error(`Invalid config number param:${name}`);
  }

  return Number(value);
 }
}