import jsonServer from 'json-server';
import cors from 'cors';

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const jsonServer = require('json-server');

server.use(cors());
server.use(middlewares);
server.use(router);

server.listen(3001, () => {
  console.log('JSON Server is running on port 3001');
});

server.use(middlewares);
// Habilitar CORS
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

server.use(router);
server.listen(8080, () => {
  console.log('JSON Server is running on port 8080');
});
