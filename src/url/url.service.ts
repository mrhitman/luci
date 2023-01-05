import { IUrl } from './url.schema';
import { Model } from "mongoose";
import { createClient } from "redis";
import fastJson from 'fast-json-stringify';

type CachedUrl = Partial<IUrl> & Pick<IUrl, "url">;
const stringify = fastJson({
  type: 'object',
  properties: {
    url: {
      type: 'string',
    },
    maxUsages: {
      type: 'integer',
    },
  }
});

export interface ICreateUrlDto {
  url: string;
  maxUsages?: number;
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
      if (this.isLimitedUsageUrl(cached)) {
        this.vanishUrl(cached);
        return null;
      }

      return cached.url;
    }

    const results = await this.getFromDb(id);
    if (!results) {
      return null;
    }

    if (this.isLimitedUsageUrl(results)) {
      this.vanishUrl(results);
      return null;
    }

    this.cache.set(id, stringify(results), { EX: 300 });
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
    return results ? JSON.parse(results) : null;
  }
  
  private async vanishUrl(url: CachedUrl | IUrl): Promise<void> {
    this.cache.set(`tiny:${url._id}`, '', {EX: 0});
    this.model.deleteOne({ _id: url._id });
  }

  private isLimitedUsageUrl(url: CachedUrl | IUrl): boolean {
    return Boolean(url?.usageLeft && url.usageLeft <= 0);
  }
}
