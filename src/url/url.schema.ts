import { Schema } from "mongoose";
import base62random from "base62-random";

export interface IUrl extends Document {
  _id: string;
  url: string;
  usageLeft: number;
  user_id: string;
  createdAt: string;
}

export const UrlSchema = new Schema({
  _id: {
    type: String,
    default: () => base62random(7),
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  url: {
    type: String,
    trim: true,
    required: true,
  },
  usageLeft: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "30d",
  },
});
