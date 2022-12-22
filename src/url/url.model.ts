import { UrlSchema } from './url.schema';
import { model } from 'mongoose';

export const Url = model("Url", UrlSchema);