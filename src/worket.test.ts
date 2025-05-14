import { ResponseObject, User } from 'model';
import request from 'supertest';
import { server } from './worker';

describe('CRUD API', () => {
  afterAll(() => server.close());

  it('should get all records with a GET api/users request', async () => {
    const res = await request(server).get('/api/users');
    const expected: ResponseObject = {
      code: 200,
      data: [],
    };

    expect(res.status).toStrictEqual(expected.code);
    expect(res.body).toStrictEqual(expected.data);
  });

  it('should create new object by a POST api/users request', async () => {
    const testUser: Partial<User> = {
      username: 'Test',
      age: 18,
      hobbies: ['hobby horsing'],
    };

    const resp = await request(server)
      .post('/api/users')
      .send(testUser)
      .set('Content-Type', 'application/json');

    const user: User = resp.body as User;

    expect(resp.status).toStrictEqual(201);
    expect(user.username).toStrictEqual(testUser.username);
    expect(user.age).toStrictEqual(testUser.age);
    expect(user.hobbies).toStrictEqual(testUser.hobbies);
    expect(typeof user.id).toStrictEqual('string');
  });

  it('Should get the created record by its id with a GET api/users/{userId} request', async () => {
    const testUser: Partial<User> = {
      username: 'Test',
      age: 18,
      hobbies: ['hobby horsing'],
    };

    const respUsers = await request(server)
      .post('/api/users')
      .send(testUser)
      .set('Content-Type', 'application/json');
    const users: User[] = respUsers.body as User[];
    const userID = users[0]?.id || '';

    const respUser = await request(server)
      .get(`/api/users/${userID}`)
      .send(testUser)
      .set('Content-Type', 'application/json');
    const resievedUser: User = respUser.body[0] as User;

    expect(respUser.status).toStrictEqual(200);
    expect(resievedUser.username).toStrictEqual(testUser.username);
    expect(resievedUser.age).toStrictEqual(testUser.age);
    expect(resievedUser.hobbies).toStrictEqual(testUser.hobbies);
    expect(typeof resievedUser.id).toStrictEqual('string');
  });
});
