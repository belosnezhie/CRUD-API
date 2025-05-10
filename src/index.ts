import { RequestError } from './model/customError';
import { UsersController } from './controllers/usersController';
import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { ResponseObject } from './model/model';

const hostname = 'localhost';
const port = 3000;

const controller = new UsersController();

const server = createServer(
  (request: IncomingMessage, response: ServerResponse) => {
    if (!request.url?.startsWith('/api/users')) {
      return wrapNotFound(response);
    }

    const bodyArr: Buffer[] = [];
    let body = '';
    request
      .on('data', (chunk) => {
        bodyArr.push(chunk);
      })
      .on('end', () => {
        body = Buffer.concat(bodyArr).toString();

        try {
          switch (request.method) {
            case 'GET':
              return wrapResult(response, controller.getUsers());
            case 'POST':
              return wrapResult(response, controller.createUser(body));
            default:
              return wrapResult(response, controller.getUsers());
          }
        } catch (err) {
          return wrapError(response, err as RequestError);
        }
      });
  },
);

const wrapResult = (response: ServerResponse, result: ResponseObject) => {
  response.statusCode = result.code;
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(result.data));
  return response;
};

const wrapNotFound = (response: ServerResponse) => {
  response.statusCode = 404;
  response.setHeader('Content-Type', 'text/plain');
  response.end('Resource not found.');
  return response;
};

const wrapError = (response: ServerResponse, err: RequestError) => {
  response.statusCode = Number(err.cause);
  response.setHeader('Content-Type', 'text/plain');
  response.end(err.message);
  return response;
};

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
