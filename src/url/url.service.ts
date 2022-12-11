import { Connection, Model } from "mongoose";

import { UrlSchema } from './url.schema';
import { createClient } from "redis";

export interface IUrl {
  _id: string;
  url: string;
  createdAt: string;
}

export class UrlService {
  private model: Model<any>;

  constructor(
    db: Connection,
    private readonly cache: ReturnType<typeof createClient>
  ) {
    this.model = db.model("Url", UrlSchema);
  }

  async createUrl(body: unknown): Promise<string> {
    const model = new this.model(body);
    await model.save();
    return model._id;
  }

  async getUrl(id: string): Promise<null | string> {
    const cached = await this.getFromCache(id);
    if (cached) {
      return cached.url;
    }

    const results = await this.getFromDb(id);
    if (!results) {
      return null;
    }

    this.cache.set(id, results.url, {EX: 300 });
    return results.url;
  }

  private async getFromDb(id: string): Promise<null | IUrl> {
    const results = await this.model.findById(id);
    return results ?? null;
  }

  private async getFromCache(
    id: string
  ): Promise<null | (Partial<IUrl> & Pick<IUrl, "url">)> {
    const results = await this.cache.get(`tiny:${id}`);
    return results ? { url: results } : null;
  }
}
