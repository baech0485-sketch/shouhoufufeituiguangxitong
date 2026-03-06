import fs from 'node:fs';
import path from 'node:path';

export const EXPECTED_MONGODB_DB = 'shouhoufufeituiguang';
const DEFAULT_ENV_FILE_NAMES = ['.env.mongodb-sync.local', '.env.local'];

export function parseEnvText(text) {
  const env = {};

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const separatorIndex = line.indexOf('=');
    if (separatorIndex <= 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();
    if (!key) {
      continue;
    }

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

function resolveEnvFilePath(projectDir, explicitEnvFile = '') {
  if (explicitEnvFile) {
    const absolutePath = path.resolve(projectDir, explicitEnvFile);
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`未找到指定的数据库配置文件：${absolutePath}`);
    }
    return absolutePath;
  }

  for (const fileName of DEFAULT_ENV_FILE_NAMES) {
    const absolutePath = path.resolve(projectDir, fileName);
    if (fs.existsSync(absolutePath)) {
      return absolutePath;
    }
  }

  throw new Error(`未找到项目本地数据库配置文件，请创建 ${DEFAULT_ENV_FILE_NAMES.join(' 或 ')}`);
}

export function extractMongoHosts(mongoUri) {
  const normalizedUri = mongoUri.replace(/^mongodb(\+srv)?:\/\//, '');
  const withoutAuth = normalizedUri.includes('@') ? normalizedUri.split('@').slice(1).join('@') : normalizedUri;
  return withoutAuth.split('/')[0].split('?')[0] || '未知主机';
}

export function readProjectMongoConfig(projectDir = process.cwd(), explicitEnvFile = '') {
  const envFilePath = resolveEnvFilePath(projectDir, explicitEnvFile);
  const envText = fs.readFileSync(envFilePath, 'utf8');
  const env = parseEnvText(envText);
  const mongoUri = env.MONGODB_URI?.trim();
  const dbName = env.MONGODB_DB?.trim();

  if (!mongoUri) {
    throw new Error(`数据库配置文件缺少 MONGODB_URI：${envFilePath}`);
  }
  if (!dbName) {
    throw new Error(`数据库配置文件缺少 MONGODB_DB：${envFilePath}`);
  }
  if (dbName !== EXPECTED_MONGODB_DB) {
    throw new Error(`数据库确认失败：当前配置为 ${dbName}，预期必须是 ${EXPECTED_MONGODB_DB}`);
  }

  return {
    envFilePath,
    mongoUri,
    dbName,
    mongoHosts: extractMongoHosts(mongoUri),
  };
}