import { MongoClient } from 'mongodb';
import { buildStoreFilter } from './store-docs.mjs';

const BATCH_SIZE = 300;

export function buildInsertOnlyOperation(doc) {
  return {
    updateOne: {
      filter: buildStoreFilter(doc),
      update: {
        $setOnInsert: {
          ...doc,
          createdAt: new Date(),
        },
      },
      upsert: true,
    },
  };
}

export async function upsertStoresToMongo({ mongoUri, dbName, storeDocs, filePath }) {
  const client = new MongoClient(mongoUri, { maxPoolSize: 10 });
  await client.connect();

  try {
    const db = client.db(dbName);
    const storesCollection = db.collection('stores');

    await storesCollection.createIndex({ sourceStoreId: 1 }, { unique: true, sparse: true });
    await storesCollection.createIndex({ openDate: -1, updatedAt: -1 });
    await storesCollection.createIndex({ name: 1 });

    let processedCount = 0;
    let ignoredCount = 0;
    let insertedCount = 0;
    let skippedExistingCount = 0;

    for (let start = 0; start < storeDocs.length; start += BATCH_SIZE) {
      const batchDocs = storeDocs.slice(start, start + BATCH_SIZE);
      const operations = [];

      for (const doc of batchDocs) {
        if (!doc.name) {
          ignoredCount += 1;
          continue;
        }
        operations.push(buildInsertOnlyOperation(doc));
      }

      if (!operations.length) {
        continue;
      }

      const result = await storesCollection.bulkWrite(operations, { ordered: false });
      processedCount += operations.length;
      insertedCount += result.upsertedCount;
      skippedExistingCount += result.matchedCount;
    }

    return {
      filePath,
      dbName,
      totalRows: storeDocs.length,
      processedCount,
      ignoredCount,
      insertedCount,
      skippedExistingCount,
    };
  } finally {
    await client.close();
  }
}
