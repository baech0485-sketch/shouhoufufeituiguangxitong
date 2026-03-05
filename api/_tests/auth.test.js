import test from 'node:test';
import assert from 'node:assert/strict';
import { requireWriteAccess } from '../_lib/auth.js';

function createMockResponse() {
  const response = {
    statusCode: 200,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.payload = body;
      return this;
    },
  };
  return response;
}

test('GET 请求总是允许访问', () => {
  const req = {
    method: 'GET',
    headers: {},
  };
  const res = createMockResponse();

  assert.equal(requireWriteAccess(req, res), true);
  assert.equal(res.statusCode, 200);
});

test('未配置 API_WRITE_KEY 时允许写请求', () => {
  const req = {
    method: 'POST',
    headers: {},
  };
  const res = createMockResponse();
  const originalKey = process.env.API_WRITE_KEY;
  delete process.env.API_WRITE_KEY;

  try {
    assert.equal(requireWriteAccess(req, res), true);
    assert.equal(res.statusCode, 200);
  } finally {
    if (originalKey) {
      process.env.API_WRITE_KEY = originalKey;
    }
  }
});

test('配置 API_WRITE_KEY 且请求未携带密钥时拒绝写请求', () => {
  const req = {
    method: 'DELETE',
    headers: {},
  };
  const res = createMockResponse();
  const originalKey = process.env.API_WRITE_KEY;
  process.env.API_WRITE_KEY = 'secret-key';

  try {
    assert.equal(requireWriteAccess(req, res), false);
    assert.equal(res.statusCode, 401);
    assert.equal(res.payload?.message, '未授权：缺少或无效的写入密钥');
  } finally {
    if (originalKey) {
      process.env.API_WRITE_KEY = originalKey;
    } else {
      delete process.env.API_WRITE_KEY;
    }
  }
});

test('配置 API_WRITE_KEY 且请求携带正确 x-api-key 时允许写请求', () => {
  const req = {
    method: 'POST',
    headers: {
      'x-api-key': 'secret-key',
    },
  };
  const res = createMockResponse();
  const originalKey = process.env.API_WRITE_KEY;
  process.env.API_WRITE_KEY = 'secret-key';

  try {
    assert.equal(requireWriteAccess(req, res), true);
    assert.equal(res.statusCode, 200);
  } finally {
    if (originalKey) {
      process.env.API_WRITE_KEY = originalKey;
    } else {
      delete process.env.API_WRITE_KEY;
    }
  }
});
