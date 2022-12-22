import { Schema, model } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email: string;
  password: string;
}

export const UserSchema = new Schema({
  name: String,
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
}, { timestamps: true });