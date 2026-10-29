import type { IncomingMessage, ServerResponse } from 'node:http';
import { checkAccess, errorMessage, evaluate, readBody, sendJSON, type EvaluateInput } from './_claude.js';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') return sendJSON(res, 405, { error: 'Method not allowed' });
  const access = await checkAccess(req);
  if (!access.ok) return sendJSON(res, access.reason === 'NO_KEY' ? 503 : 403, { error: access.reason });
  try {
    const body = await readBody<EvaluateInput>(req);
    if (!body.question || !body.userAnswer?.trim()) return sendJSON(res, 400, { error: 'question y userAnswer son requeridos' });
    if (body.userAnswer.length > 8000) return sendJSON(res, 400, { error: 'Respuesta demasiado larga' });
    sendJSON(res, 200, await evaluate(body));
  } catch (e) {
    const { status, message } = errorMessage(e);
    sendJSON(res, status, { error: message });
  }
}
