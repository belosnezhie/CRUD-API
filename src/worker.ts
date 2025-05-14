import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { config } from 'dotenv';
import { usersController as controller } from './controllers/users-controller';
import { RequestError } from './model/custom-error';
import { ResponseObject } from './model';

config();

const PORT = process.env.PORT || 4000;

export const server = createServer(
  async (request: IncomingMessage, response: ServerResponse) => {
    try {
      if (!request.url?.startsWith('/api/users')) {
        return wrapNotFound(response);
      }

      const userId: string = parseURL(request.url);
      const body: string = await getRequestBody(request);

      switch (request.method) {
        case 'GET':
          if (userId !== '') {
            return wrapResult(response, await controller.getUser(userId));
          }
          return wrapResult(response, await controller.getUsers());

        case 'POST':
          return wrapResult(response, await controller.createUser(body));

        case 'PUT':
          return wrapResult(
            response,
            await controller.updateUserData(body, userId),
          );

        case 'DELETE':
          return wrapResult(response, await controller.deleteUser(userId));

        default:
          return wrapNotFound(response);
      }
    } catch (err) {
      return wrapError(response, err as RequestError);
    }
  },
);

const getRequestBody = (req: IncomingMessage): Promise<string> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString()));
    req.on('error', (err) => reject(err));
  });
};

const wrapResult = (response: ServerResponse, result: ResponseObject) => {
  response.statusCode = result.code;
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('x-worker-port', PORT);
  response.end(JSON.stringify(result.data));
  return response;
};

const wrapNotFound = (response: ServerResponse) => {
  response.statusCode = 404;
  response.setHeader('Content-Type', 'text/plain');
  response.setHeader('x-worker-port', PORT);
  response.end('Resource not found.');
  return response;
};

const wrapError = (response: ServerResponse, err: RequestError) => {
  response.statusCode = Number(err.cause) || 500;
  response.setHeader('Content-Type', 'text/plain');
  response.setHeader('x-worker-port', PORT);
  response.end(err.message || 'Internal Server Error');
  return response;
};

const parseURL = (url: string): string => {
  const segments = url.split('/');
  const enpoint = segments[segments.length - 1] || '';
  return enpoint === 'users' ? '' : enpoint;
};

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
