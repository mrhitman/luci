import { IUser } from './user.schema';
import { Model } from "mongoose";

export class UserService {
  constructor(
    private readonly model: Model<IUser>,
  ) {}

  async createUser() {
  }

  async getUser(id: string): Promise<null | IUser> {
    const results = await this.model.findById(id);
    return results ?? null;
  }
}
