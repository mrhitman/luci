import { config } from 'dotenv';

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

 get port(): number {
  return this.getEnvNumber('PORT', 8080);
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