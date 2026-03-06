import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { EXPECTED_MONGODB_DB, parseEnvText, readProjectMongoConfig } from './config.mjs';

test('parseEnvText 能解析注释、引号和值', () => {
  const env = parseEnvText('# 注释\nMONGODB_URI="mongodb://demo"\nMONGODB_DB=shouhoufufeituiguang\n');
  assert.equal(env.MONGODB_URI, 'mongodb://demo');
  assert.equal(env.MONGODB_DB, EXPECTED_MONGODB_DB);
});

test('readProjectMongoConfig 只接受正确数据库名', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mongo-config-'));
  const envFilePath = path.join(tempDir, '.env.mongodb-sync.local');
  fs.writeFileSync(envFilePath, 'MONGODB_URI="mongodb://demo"\nMONGODB_DB="chengshang_tools"\n', 'utf8');

  assert.throws(() => readProjectMongoConfig(tempDir), /数据库确认失败/);
});

test('readProjectMongoConfig 优先读取项目本地配置', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mongo-config-'));
  const envFilePath = path.join(tempDir, '.env.mongodb-sync.local');
  fs.writeFileSync(envFilePath, 'MONGODB_URI="mongodb://demo"\nMONGODB_DB="shouhoufufeituiguang"\n', 'utf8');

  const config = readProjectMongoConfig(tempDir);
  assert.equal(path.basename(config.envFilePath), '.env.mongodb-sync.local');
  assert.equal(config.dbName, EXPECTED_MONGODB_DB);
  assert.equal(config.mongoUri, 'mongodb://demo');
});