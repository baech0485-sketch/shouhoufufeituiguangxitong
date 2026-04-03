import test from 'node:test';
import assert from 'node:assert/strict';

import { applyLoadedEnvToProcess } from './env.mjs';

test('applyLoadedEnvToProcess 用本地 env 覆盖同名进程变量', () => {
  const target = {
    MONGODB_URI: 'mongodb://old-value',
    MONGODB_DB: 'old-db',
    KEEP_ME: '1',
  };

  applyLoadedEnvToProcess(
    {
      MONGODB_URI: 'mongodb://new-value',
      MONGODB_DB: 'new-db',
      VITE_API_WRITE_KEY: 'abc',
    },
    target,
  );

  assert.deepEqual(target, {
    MONGODB_URI: 'mongodb://new-value',
    MONGODB_DB: 'new-db',
    KEEP_ME: '1',
    VITE_API_WRITE_KEY: 'abc',
  });
});
