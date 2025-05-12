import cluster from 'cluster';
import { config } from 'dotenv';
import http, {
  createServer,
  IncomingMessage,
  ServerResponse,
  RequestOptions,
} from 'node:http';
import { availableParallelism } from 'os';

config();

const PORT = process.env.PORT || 4000;

const createCluster = async () => {
  if (cluster.isPrimary) {
    console.log('Master started');
    const workersCount = availableParallelism();
    console.log(`WorkersCount ${workersCount}`);
    for (let i = 0; i < workersCount - 1; i += 1) {
      const envCopy = Object.assign({}, process.env);
      envCopy.PORT = String(Number(PORT) + i + 1);
      cluster.fork(envCopy);
    }

    let lastWorkerPort = 4000;

    const getNextWorkerPort = (): number => {
      lastWorkerPort += 1;
      if (lastWorkerPort - 4000 > workersCount) {
        lastWorkerPort = 4001;
      }
      return lastWorkerPort;
    };

    const masterServer = createServer(
      (clientRequest: IncomingMessage, clientResponse: ServerResponse) => {
        const targetPort = getNextWorkerPort();

        const options: RequestOptions = {
          hostname: 'localhost',
          port: targetPort,
          path: clientRequest.url,
          method: clientRequest.method,
          headers: clientRequest.headers,
        };

        const proxyRequest = http.request(options, (proxyResponse) => {
          proxyResponse.headers['x-redirect-worker-port'] =
            lastWorkerPort.toString();
          clientResponse.writeHead(
            proxyResponse.statusCode || 500,
            proxyResponse.headers,
          );
          proxyResponse.pipe(clientResponse, { end: true });
        });

        clientRequest.pipe(proxyRequest, { end: true });

        proxyRequest.on('error', (err) => {
          console.error(`Error proxying to port ${targetPort}:`, err);
          clientResponse.statusCode = 502;
          clientResponse.end('Bad Gateway');
        });
      },
    );

    masterServer.listen(PORT);
  }

  if (cluster.isWorker) {
    await import('./worker');
    console.log(
      `Worker started, pid: ${process.pid}, port ${process.env.PORT}`,
    );
  }
};

(async () => await createCluster())();
