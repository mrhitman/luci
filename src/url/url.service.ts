import { IUrl } from './url.schema';
import { Model } from "mongoose";
import { createClient } from "redis";

type CachedUrl = Partial<IUrl> & Pick<IUrl, "url">;

export interface ICreateUrlDto {
  url: string;
}

export class UrlService {
  constructor(
    private readonly model: Model<IUrl>,
    private readonly cache: ReturnType<typeof createClient>
  ) {}

  async createUrl(body: ICreateUrlDto): Promise<string> {
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
  ): Promise<null | CachedUrl> {
    const results = await this.cache.get(`tiny:${id}`);
    return results ? { url: results } : null;
  }
}
