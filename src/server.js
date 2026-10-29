
import { createServer } from 'node:http';
import { handleRequest } from './app.js';

const port = Number(process.env.PORT ?? 3000);

const server = createServer(handleRequest);

server.listen(port, () => {
  console.log(
    `Learning Lab API listening on port ${port}`
  );
});