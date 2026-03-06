import process from 'node:process';
import { MongoClient, ObjectId } from 'mongodb';
import { readProjectMongoConfig } from './store-sync/config.mjs';
import { deriveStoreStatus } from '../api/_lib/store-status.js';

function parseArgs(argv) {
  const options = { checkOnly: false, configFile: '', merchantId: '', storeId: '' };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--check-only') {
      options.checkOnly = true;
      continue;
    }
    if (argument === '--config-file') {
      options.configFile = argv[index + 1] || '';
      index += 1;
      continue;
    }
    if (argument === '--merchant-id') {
      options.merchantId = argv[index + 1] || '';
      index += 1;
      continue;
    }
    if (argument === '--store-id') {
      options.storeId = argv[index + 1] || '';
      index += 1;
    }
  }

  return options;
}

function buildStoreFilter({ merchantId, storeId }) {
  if (storeId) {
    if (!ObjectId.isValid(storeId)) {
      throw new Error(`storeId \u683c\u5f0f\u4e0d\u6b63\u786e\uff1a${storeId}`);
    }
    return { _id: new ObjectId(storeId) };
  }
  if (merchantId) {
    return { merchantId };
  }
  return {};
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const mongoConfig = readProjectMongoConfig(process.cwd(), options.configFile);
  const client = new MongoClient(mongoConfig.mongoUri, { maxPoolSize: 10 });
  await client.connect();

  try {
    const db = client.db(mongoConfig.dbName);
    const storeFilter = buildStoreFilter(options);
    const stores = await db.collection('stores').find(storeFilter, {
      projection: { merchantId: 1, name: 1, status: 1 },
    }).toArray();

    const storeIds = stores.map((store) => String(store._id));
    const relationFilter = storeIds.length ? { storeId: { $in: storeIds } } : {};
    const [followupStoreIds, rechargeStoreIds] = await Promise.all([
      db.collection('followups').distinct('storeId', relationFilter),
      db.collection('recharges').distinct('storeId', relationFilter),
    ]);

    const followupSet = new Set(followupStoreIds);
    const rechargeSet = new Set(rechargeStoreIds);
    const changes = [];
    const operations = [];

    for (const store of stores) {
      const storeId = String(store._id);
      const expectedStatus = deriveStoreStatus(rechargeSet.has(storeId), followupSet.has(storeId));
      const currentStatus = store.status || '\u5f85\u8ddf\u8fdb';
      if (currentStatus === expectedStatus) {
        continue;
      }

      changes.push({
        storeId,
        merchantId: store.merchantId || '',
        name: store.name || '',
        fromStatus: currentStatus,
        toStatus: expectedStatus,
      });
      operations.push({
        updateOne: {
          filter: { _id: store._id },
          update: { $set: { status: expectedStatus, updatedAt: new Date() } },
        },
      });
    }

    console.log(`\u6570\u636e\u5e93\u540d\u79f0\uff1a${mongoConfig.dbName}`);
    console.log(`\u626b\u63cf\u5e97\u94fa\u6570\uff1a${stores.length}`);
    console.log(`\u5f85\u4fee\u6b63\u72b6\u6001\u6570\uff1a${changes.length}`);
    console.log(`\u6a21\u5f0f\uff1a${options.checkOnly ? '\u4ec5\u68c0\u67e5' : '\u6b63\u5f0f\u4fee\u6b63'}`);
    if (changes.length > 0) {
      console.log('\u793a\u4f8b\u53d8\u66f4\uff1a');
      for (const item of changes.slice(0, 10)) {
        console.log(`- ${item.merchantId || item.storeId} ${item.name}\uff1a${item.fromStatus} -> ${item.toStatus}`);
      }
    }

    if (options.checkOnly || operations.length === 0) {
      return;
    }

    const result = await db.collection('stores').bulkWrite(operations, { ordered: false });
    console.log(`\u5b9e\u9645\u4fee\u6b63\u6570\uff1a${result.modifiedCount}`);
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error(`\u72b6\u6001\u4fee\u6b63\u5931\u8d25\uff1a${error.message}`);
  process.exit(1);
});
