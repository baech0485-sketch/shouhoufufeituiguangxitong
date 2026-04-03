import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { PassThrough } from 'node:stream';

import { createViteApiMiddleware } from './middleware.mjs';

test('createViteApiMiddleware 会执行本地 api handler 并返回 json', async () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'vite-api-middleware-'));
  const apiDir = path.join(tempRoot, 'api');
  fs.mkdirSync(apiDir, { recursive: true });
  fs.writeFileSync(
    path.join(apiDir, 'ping.js'),
    [
      'export default async function handler(req, res) {',
      '  res.status(200).json({',
      '    ok: true,',
      '    method: req.method,',
      '    query: req.query,',
      '  });',
      '}',
      '',
    ].join('\n'),
  );

  const middleware = createViteApiMiddleware(tempRoot);
  const req = new PassThrough();
  req.method = 'GET';
  req.url = '/api/ping?name=codex';
  req.headers = {};

  const chunks = [];
  const res = {
    statusCode: 200,
    headers: {},
    writableEnded: false,
    setHeader(name, value) {
      this.headers[name] = value;
    },
    end(chunk) {
      if (chunk) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
      }
      this.writableEnded = true;
    },
  };

  let nextCalled = false;
  await middleware(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 200);
  assert.match(res.headers['Content-Type'], /application\/json/);
  assert.deepEqual(
    JSON.parse(Buffer.concat(chunks).toString('utf8')),
    {
      ok: true,
      method: 'GET',
      query: {
        name: 'codex',
      },
    },
  );
});
