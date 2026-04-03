import fs from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

import { parseApiRequestUrl, resolveApiModulePath } from './utils.mjs';

function decorateResponse(res) {
  res.status = (statusCode) => {
    res.statusCode = statusCode;
    return res;
  };

  res.json = (payload) => {
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
    res.end(JSON.stringify(payload));
    return res;
  };

  return res;
}

async function readJsonBody(req) {
  if (req.method === 'GET' || req.method === 'HEAD') {
    return {};
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  if (chunks.length === 0) {
    return {};
  }

  const text = Buffer.concat(chunks).toString('utf8').trim();
  if (!text) {
    return {};
  }

  const contentType = req.headers?.['content-type'] || '';
  if (typeof contentType === 'string' && contentType.includes('application/json')) {
    return JSON.parse(text);
  }

  return text;
}

async function loadHandler(modulePath) {
  const moduleUrl = `${pathToFileURL(modulePath).href}?t=${Date.now()}`;
  const importedModule = await import(moduleUrl);
  return importedModule.default;
}

export function createViteApiMiddleware(projectRoot) {
  return async function viteApiMiddleware(req, res, next) {
    if (!req.url?.startsWith('/api/')) {
      next();
      return;
    }

    const { pathname, query } = parseApiRequestUrl(req.url);
    const modulePath = resolveApiModulePath(projectRoot, pathname);
    if (!modulePath) {
      next();
      return;
    }

    const handler = await loadHandler(modulePath);
    if (typeof handler !== 'function') {
      throw new Error(`API 模块未导出默认 handler：${pathname}`);
    }

    req.query = query;
    req.body = await readJsonBody(req);
    req.cookies = {};

    const response = decorateResponse(res);

    try {
      await handler(req, response);
      if (!res.writableEnded && !res.headersSent) {
        await fs.access(modulePath);
        next();
      }
    } catch (error) {
      if (!res.writableEnded) {
        response.status(500).json({
          message: error instanceof Error ? error.message : '本地 API 调试失败',
        });
      }
    }
  };
}
