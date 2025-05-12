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

    const masterServer = createServer(
      (clientReq: IncomingMessage, clientRes: ServerResponse) => {
        const targetPort = 4001;

        const options: RequestOptions = {
          hostname: 'localhost',
          port: targetPort,
          path: clientReq.url,
          method: clientReq.method,
          headers: clientReq.headers,
        };

        const proxyRequest = http.request(options, (proxyResponse) => {
          clientRes.writeHead(
            proxyResponse.statusCode || 500,
            proxyResponse.headers,
          );
          proxyResponse.pipe(clientRes, { end: true });
        });

        clientReq.pipe(proxyRequest, { end: true });

        proxyRequest.on('error', (err) => {
          console.error(`Error proxying to port ${targetPort}:`, err);
          clientRes.statusCode = 502;
          clientRes.end('Bad Gateway');
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
    process.on('message', (message) => {
      console.log(`Message from master: ${message}`);
    });
  }
};

(async () => await createCluster())();
