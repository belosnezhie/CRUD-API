import { UsersController } from './controllers/usersController';
import { createServer, ServerResponse } from 'node:http';

const hostname = 'localhost';
const port = 3000;

const controller = new UsersController();

const server = createServer((request, response) => {
  const method = request.method;

  switch (method) {
    case 'GET':
      return wrapResult(response, controller.getUsers());
  }
});

const wrapResult = (response: ServerResponse, result: unknown) => {
  response.statusCode = 200;
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(result));
  return response;
};

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
