import type { IncomingMessage, ServerResponse } from 'node:http';
import { MODEL, aiEnabled, sendJSON } from './_claude.js';

export default function handler(_req: IncomingMessage, res: ServerResponse) {
  sendJSON(res, 200, { enabled: aiEnabled(), model: MODEL });
}
