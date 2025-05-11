import { ResponseObject, User } from 'model';
import { UsersController } from './users-controller';

describe('UsersController', () => {
  it('should get all records with a GET api/users request', () => {
    const controller = new UsersController();
    const expected: ResponseObject = {
      code: 200,
      data: [],
    };

    expect(controller.getUsers()).toStrictEqual(expected);
  });

  it('should create new object by a POST api/users request', () => {
    const controller = new UsersController();
    const testUser: Partial<User> = {
      username: 'Test',
      age: 18,
      hobbies: ['hobby horsing'],
    };

    controller.createUser(JSON.stringify(testUser));
    const resp: ResponseObject = controller.getUsers();
    const users: User[] = resp.data as User[];

    expect(resp.code).toStrictEqual(200);
    expect(users[0]?.username).toStrictEqual(testUser.username);
    expect(users[0]?.age).toStrictEqual(testUser.age);
    expect(users[0]?.hobbies).toStrictEqual(testUser.hobbies);
    expect(typeof users[0]?.id).toStrictEqual('string');
  });

  it('Should get the created record by its id with a GET api/users/{userId} request', () => {
    const controller = new UsersController();
    const testUser: Partial<User> = {
      username: 'Test',
      age: 18,
      hobbies: ['hobby horsing'],
    };

    controller.createUser(JSON.stringify(testUser));
    const respUsers: ResponseObject = controller.getUsers();
    const users: User[] = respUsers.data as User[];
    const userID = users[0]?.id || '';

    const respUser = controller.getUser(userID);
    const resievedUser: User = respUser.data as User;

    expect(respUser.code).toStrictEqual(200);
    expect(resievedUser.username).toStrictEqual(testUser.username);
    expect(resievedUser.age).toStrictEqual(testUser.age);
    expect(resievedUser.hobbies).toStrictEqual(testUser.hobbies);
    expect(typeof resievedUser.id).toStrictEqual('string');
  });
});
