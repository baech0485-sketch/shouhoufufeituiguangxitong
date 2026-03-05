import crypto from 'node:crypto';
import { sendJson } from './http.js';

function extractWriteKey(req) {
  const headerKey = req.headers?.['x-api-key'];
  if (typeof headerKey === 'string') {
    return headerKey.trim();
  }
  if (Array.isArray(headerKey)) {
    return (headerKey[0] || '').trim();
  }

  const authorization = req.headers?.authorization;
  if (typeof authorization === 'string' && authorization.startsWith('Bearer ')) {
    return authorization.slice('Bearer '.length).trim();
  }

  return '';
}

function safeEquals(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function requireWriteAccess(req, res) {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    return true;
  }

  const expectedKey = process.env.API_WRITE_KEY;
  if (!expectedKey) {
    return true;
  }

  const providedKey = extractWriteKey(req);
  if (!providedKey || !safeEquals(providedKey, expectedKey)) {
    sendJson(res, 401, { message: '未授权：缺少或无效的写入密钥' });
    return false;
  }

  return true;
}
