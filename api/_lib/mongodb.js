import { MongoClient } from 'mongodb';

const dbName = process.env.MONGODB_DB || 'shouhoufufeituiguang';

export async function getDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('缺少环境变量 MONGODB_URI');
  }

  if (!globalThis.__mongoClientPromise || globalThis.__mongoClientUri !== uri) {
    const client = new MongoClient(uri, {
      maxPoolSize: 10,
    });
    globalThis.__mongoClientPromise = client.connect();
    globalThis.__mongoClientUri = uri;
  }

  const client = await globalThis.__mongoClientPromise;
  return client.db(dbName);
}
