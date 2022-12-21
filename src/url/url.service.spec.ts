import { IUrl } from './url.schema';
import { Model } from 'mongoose';
import { UrlService } from './url.service';
import { createClient } from 'redis';
import { mock } from 'jest-mock-extended';

describe("UrlService", () => {
 let model: Model<IUrl>;
 let cache: ReturnType<typeof createClient>;
 let service: UrlService;

 beforeEach(async () => {
  model = mock();
  cache = mock();
  service = new UrlService(model, cache);
 });

 describe("createUrl", () => {
  it(", succeed", async () => {
   const spy = jest.fn();
   model = jest.fn().mockImplementation(() => ({
    save: spy,
   })) as any;
   service = new UrlService(model, cache);
   const body = {
    url: 'https://google.com',
   };

   await service.createUrl(body);
   expect(spy).toBeCalled();
  });
 });

 describe("getUrl", () => {
  it(", succeed from cache", async () => {
   cache.get = jest.fn().mockResolvedValueOnce('https://google.com');
   const results = await service.getUrl('TEST_ID');
   expect(results).toBe('https://google.com');
   expect(cache.get).toBeCalled();
   expect(model.findById).not.toBeCalled();
  });

  it(", succeed from db", async () => {
   model.findById = jest.fn().mockResolvedValue({ url: 'https://google.com' });
   const results = await service.getUrl('TEST_ID');
   expect(results).toBe('https://google.com');
   expect(cache.get).toBeCalled();
   expect(model.findById).toBeCalled();
   expect(cache.set).toBeCalled();
  });

  it(", not found", async () => {
   const results = await service.getUrl('TEST_ID');
   expect(results).toBeNull();
   expect(cache.get).toBeCalled();
   expect(model.findById).toBeCalled();
   expect(cache.set).not.toBeCalled();
  });
 });
});
