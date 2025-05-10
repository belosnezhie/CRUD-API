import { User } from 'model/model';

export class UsersController {
  public users: User[];

  constructor() {
    this.users = [];
  }

  public getUsers(): User[] {
    return this.users;
  }
}
