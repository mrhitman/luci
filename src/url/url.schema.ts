import { Schema } from "mongoose";
import base62random from "base62-random";

export interface IUrl extends Document {
  _id: string;
  url: string;
  createdAt: string;
}

export const UrlSchema = new Schema({
  _id: {
    type: String,
    default: () => base62random(7),
  },
  url: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "30d",
  },
});
