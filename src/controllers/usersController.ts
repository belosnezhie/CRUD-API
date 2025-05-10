import { randomUUID } from 'crypto';
import { RequestError } from '../model/customError';
import { ResponseObject, User } from '../model/model';

export class UsersController {
  public users: User[];

  constructor() {
    this.users = [];
  }

  public getUsers(): ResponseObject {
    return {
      code: 200,
      data: this.users,
    };
  }

  public createUser(data: string): ResponseObject {
    const user: User = this.validateData(data);
    this.users.push(user);
    return {
      code: 201,
      data: user,
    };
  }

  public validateData(data: string): User {
    try {
      const user = JSON.parse(data);

      user.id = randomUUID();

      if (!this.isUser(user)) {
        throw new RequestError(`Invalid user data`, 400);
      }

      return user;
    } catch (err) {
      throw new RequestError(
        `Invalid user data: ${(err as Error).message}`,
        400,
      );
    }
  }

  // private isUser(obj: unknown): obj is User {
  //   return (
  //     typeof obj === 'object' &&
  //     obj !== null &&
  //     'id' in obj &&
  //     typeof (obj as { id: unknown }).id === 'string' &&
  //     'username' in obj &&
  //     typeof (obj as { username: unknown }).username === 'string' &&
  //     'age' in obj &&
  //     typeof (obj as { age: unknown }).age === 'number' &&
  //     'hobbies' in obj &&
  //     Array.isArray((obj as { hobbies: unknown }).hobbies) &&
  //     (obj as { hobbies: unknown }).hobbies.every(
  //       (hobby) => typeof hobby === 'string',
  //     )
  //   );
  // }

  private isUser(obj: unknown): obj is User {
    if (typeof obj !== 'object' || obj === null) {
      return false;
    }

    const o = obj as {
      id?: unknown;
      username?: unknown;
      age?: unknown;
      hobbies?: unknown;
    };

    return (
      typeof o.id === 'string' &&
      typeof o.username === 'string' &&
      typeof o.age === 'number' &&
      Array.isArray(o.hobbies) &&
      o.hobbies.every((hobby) => typeof hobby === 'string')
    );
  }
}
