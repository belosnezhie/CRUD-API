import cluster from 'cluster';
import { config } from 'dotenv';
import { availableParallelism } from 'os';

config();

const PORT = process.env.PORT || 4000;

if (cluster.isPrimary) {
  console.log('Master started');
  const workersCount = availableParallelism();
  console.log(`workersCount ${workersCount}`);
  for (let i = 0; i < workersCount - 1; i += 1) {
    const envCopy = Object.assign({}, process.env);
    envCopy.PORT = String(Number(PORT) + i + 1);
    const worker = cluster.fork(envCopy);

    worker.send('Hello from server');
    worker.on('exit', () => {
      console.log(`Worker ended, pid ${worker.process.pid}`);
    });
  }
}

if (cluster.isWorker) {
  console.log(`Worker started, pid: ${process.pid}, port ${process.env.PORT}`);
  process.on('message', (message) => {
    console.log(`Message from master: ${message}`);
  });
}
