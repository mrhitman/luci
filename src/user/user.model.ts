import { UserSchema } from './user.schema';
import { model } from "mongoose";

export const User = model("User", UserSchema);