import fs from 'node:fs';
import path from 'node:path';

function parseEnvText(text) {
  const result = {};

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
    if (
      (value.startsWith('"') && value.endsWith('"'))
      || (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    result[key] = value;
  }

  return result;
}

export function loadProjectDevEnv(projectRoot, baseEnv = {}) {
  const envFilePath = path.resolve(projectRoot, '.env.local');
  if (!fs.existsSync(envFilePath)) {
    return {};
  }

  const fileEnv = parseEnvText(fs.readFileSync(envFilePath, 'utf8'));
  const mergedEnv = {
    ...baseEnv,
    ...fileEnv,
  };

  const scopedEnv = {};
  ['MONGODB_URI', 'MONGODB_DB', 'API_WRITE_KEY', 'VITE_API_WRITE_KEY'].forEach((key) => {
    if (mergedEnv[key] !== undefined) {
      scopedEnv[key] = mergedEnv[key];
    }
  });

  return scopedEnv;
}
