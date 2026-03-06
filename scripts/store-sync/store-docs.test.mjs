import test from 'node:test';
import assert from 'node:assert/strict';
import { buildStoreDoc, buildStoreFilter } from './store-docs.mjs';

test('buildStoreDoc 能把表格行映射为门店文档', () => {
  const now = new Date('2026-03-06T10:00:00.000Z');
  const doc = buildStoreDoc({
    店铺ID: 'S001',
    录入日期: '2026/03/06 09:00:00',
    店铺名: '测试门店',
    商家ID: 'M001',
    微信群名: '测试群',
    城市: '杭州',
    开单销售: '张三',
    合同签订日期: '2026-03-01',
    运营模式: '代运营',
    负责运营: '李四',
    外卖平台: '饿了么餐饮',
    店铺状态: '已沟通',
    解约日期: '',
    解约合作天数: '12',
    创建时间: '2026-03-01 08:00:00',
    更新时间: '2026-03-06 09:00:00',
  }, now);

  assert.equal(doc.sourceStoreId, 'S001');
  assert.equal(doc.name, '测试门店');
  assert.equal(doc.platform, '饿了么餐饮');
  assert.equal(doc.status, '已跟进');
  assert.equal(doc.openDate, '2026-03-06');
  assert.equal(doc.cooperationDays, 12);
  assert.equal(doc.updatedAt, now);
});

test('buildStoreFilter 在存在店铺ID时优先使用店铺ID', () => {
  assert.deepEqual(buildStoreFilter({ sourceStoreId: 'S001', name: '测试门店' }), { sourceStoreId: 'S001' });
  assert.deepEqual(
    buildStoreFilter({ sourceStoreId: '', name: '测试门店', platform: '美团餐饮', openDate: '2026-03-06' }),
    { name: '测试门店', platform: '美团餐饮', openDate: '2026-03-06' },
  );
});