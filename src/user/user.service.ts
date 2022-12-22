import { IUser } from './user.schema';
import { Model } from "mongoose";

export class UserService {
  constructor(
    private readonly model: Model<IUser>,
  ) {}

  private async getFromDb(id: string): Promise<null | IUser> {
    const results = await this.model.findById(id);
    return results ?? null;
  }
}
