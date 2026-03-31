import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../stores.js';

function createMockResponse() {
  return {
    statusCode: 200,
    payload: null,
    headers: {},
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.payload = body;
      return this;
    },
    setHeader(name, value) {
      this.headers[name] = value;
      return this;
    },
  };
}

test('POST /api/stores 会保存商家ID并在缺少开单日期时默认当天', async () => {
  const insertedDocs = [];
  const today = new Date().toISOString().slice(0, 10);
  const fakeDb = {
    collection(name) {
      assert.equal(name, 'stores');
      return {
        async insertOne(doc) {
          insertedDocs.push(doc);
          return {
            insertedId: {
              toString() {
                return 'store-1';
              },
            },
          };
        },
      };
    },
  };

  const originalMongoUri = process.env.MONGODB_URI;
  const originalMongoDb = process.env.MONGODB_DB;
  const originalClientPromise = globalThis.__mongoClientPromise;
  const originalClientUri = globalThis.__mongoClientUri;

  process.env.MONGODB_URI = 'mongodb://unit-test';
  process.env.MONGODB_DB = 'shouhoufufeituiguang';
  globalThis.__mongoClientPromise = Promise.resolve({
    db() {
      return fakeDb;
    },
  });
  globalThis.__mongoClientUri = 'mongodb://unit-test';

  try {
    const req = {
      method: 'POST',
      headers: {},
      body: {
        name: '霸王茶姬测试店',
        merchantId: '31880507',
        platform: '淘宝闪购',
      },
    };
    const res = createMockResponse();

    await handler(req, res);

    assert.equal(res.statusCode, 201);
    assert.equal(insertedDocs.length, 1);
    assert.equal(insertedDocs[0].merchantId, '31880507');
    assert.equal(insertedDocs[0].platform, '淘宝闪购');
    assert.equal(insertedDocs[0].openDate, today);
    assert.equal(res.payload?.merchantId, '31880507');
    assert.equal(res.payload?.platform, '淘宝闪购');
    assert.equal(res.payload?.openDate, today);
  } finally {
    if (originalMongoUri) {
      process.env.MONGODB_URI = originalMongoUri;
    } else {
      delete process.env.MONGODB_URI;
    }

    if (originalMongoDb) {
      process.env.MONGODB_DB = originalMongoDb;
    } else {
      delete process.env.MONGODB_DB;
    }

    if (originalClientPromise) {
      globalThis.__mongoClientPromise = originalClientPromise;
    } else {
      delete globalThis.__mongoClientPromise;
    }

    if (originalClientUri) {
      globalThis.__mongoClientUri = originalClientUri;
    } else {
      delete globalThis.__mongoClientUri;
    }
  }
});
