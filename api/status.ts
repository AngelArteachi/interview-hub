import type { IncomingMessage, ServerResponse } from 'node:http';
import { MODEL, checkAccess, sendJSON } from './_claude.js';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const access = await checkAccess(req);
  sendJSON(res, 200, { enabled: access.ok, reason: access.ok ? null : access.reason, model: MODEL });
}
