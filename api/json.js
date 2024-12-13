import { createServer } from 'json-server';
import path from 'path';

const server = createServer({
  static: path.join(__dirname, 'db.json'),
});

export default function handler(req, res) {
  server.emit('request', req, res);
}
