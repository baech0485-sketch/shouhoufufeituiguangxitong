import test from 'node:test';
import assert from 'node:assert/strict';
import { buildInsertOnlyOperation } from './upsert-stores.mjs';

test('只在新增时写入，不覆盖已有记录', () => {
  const doc = {
    sourceStoreId: 'S001',
    name: '测试门店',
    platform: '美团餐饮',
    openDate: '2026-03-06',
    status: '待跟进',
  };

  const operation = buildInsertOnlyOperation(doc);
  assert.deepEqual(operation.updateOne.filter, { sourceStoreId: 'S001' });
  assert.equal(operation.updateOne.upsert, true);
  assert.ok(operation.updateOne.update.$setOnInsert);
  assert.equal(operation.updateOne.update.$set, undefined);
  assert.equal(operation.updateOne.update.$setOnInsert.name, '测试门店');
  assert.equal(operation.updateOne.update.$setOnInsert.status, '待跟进');
  assert.ok(operation.updateOne.update.$setOnInsert.createdAt instanceof Date);
});
