import type { IncomingMessage, ServerResponse } from 'node:http';
import { checkAccess, errorMessage, readBody, sendJSON, tutorStream, type TutorInput } from './_claude.js';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') return sendJSON(res, 405, { error: 'Method not allowed' });
  const access = await checkAccess(req);
  if (!access.ok) return sendJSON(res, access.reason === 'NO_KEY' ? 503 : 403, { error: access.reason });
  let started = false;
  try {
    const body = await readBody<TutorInput>(req);
    if (!body.messages?.length) return sendJSON(res, 400, { error: 'messages es requerido' });
    await tutorStream(body, (text) => {
      if (!started) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache');
        started = true;
      }
      res.write(text);
    });
    res.end();
  } catch (e) {
    const { status, message } = errorMessage(e);
    if (started) res.end(`\n\n_(${message})_`);
    else sendJSON(res, status, { error: message });
  }
}
