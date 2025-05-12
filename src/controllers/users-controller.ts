import { randomUUID } from 'crypto';
import { RequestError } from '../model/custom-error';
import { ResponseObject, User } from '../model';

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

  public getUser(userId: string): ResponseObject {
    if (!this.isValidUUID(userId)) {
      throw new RequestError(`Invalid user data: user ID is not UUID`, 400);
    }

    const index = this.isUserExists(userId);

    return {
      code: 200,
      data: this.users[index],
    };
  }

  public createUser(data: string): ResponseObject {
    const user: User = this.validateData(data, randomUUID());
    this.users.push(user);
    return {
      code: 201,
      data: user,
    };
  }

  public updateUserData(data: string, userId: string): ResponseObject {
    if (!this.isValidUUID(userId)) {
      throw new RequestError(`Invalid user data: user ID is not UUID`, 400);
    }

    const index = this.isUserExists(userId);

    const user: User = this.validateData(data, userId);

    this.users[index] = user;

    return {
      code: 200,
      data: user,
    };
  }

  public deleteUser(userId: string): ResponseObject {
    if (!this.isValidUUID(userId)) {
      throw new RequestError(`Invalid user data: user ID is not UUID`, 400);
    }

    const index = this.isUserExists(userId);

    this.users.splice(index, 1);

    return {
      code: 204,
    };
  }

  private isUserExists(userId: string): number {
    const index = this.users.findIndex((el) => {
      return el.id === userId;
    });

    if (index === -1) {
      throw new RequestError(`User with ID ${userId} does not exist`, 404);
    }

    return index;
  }

  private validateData(data: string, id: string): User {
    try {
      const user = JSON.parse(data);

      user.id = id;

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

  private isUser(obj: unknown): obj is User {
    if (typeof obj !== 'object' || obj === null) {
      return false;
    }

    const allowedKeys = ['id', 'username', 'age', 'hobbies'];
    const keys = Object.keys(obj);

    if (keys.some((key) => !allowedKeys.includes(key))) {
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

  private isValidUUID(uuid: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}
