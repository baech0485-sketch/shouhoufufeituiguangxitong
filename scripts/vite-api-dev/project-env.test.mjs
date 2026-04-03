import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { loadProjectDevEnv } from './project-env.mjs';

test('loadProjectDevEnv 优先读取项目 .env.local 中的数据库配置', () => {
  const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'project-dev-env-'));
  fs.writeFileSync(
    path.join(projectRoot, '.env.local'),
    [
      'MONGODB_URI="mongodb://file-value"',
      'MONGODB_DB="shouhoufufeituiguang"',
      'API_WRITE_KEY="file-key"',
      '',
    ].join('\n'),
  );

  const env = loadProjectDevEnv(projectRoot, {
    MONGODB_URI: 'mongodb://process-value',
    MONGODB_DB: 'chengshang_tools',
    API_WRITE_KEY: 'process-key',
  });

  assert.deepEqual(env, {
    MONGODB_URI: 'mongodb://file-value',
    MONGODB_DB: 'shouhoufufeituiguang',
    API_WRITE_KEY: 'file-key',
  });
});
