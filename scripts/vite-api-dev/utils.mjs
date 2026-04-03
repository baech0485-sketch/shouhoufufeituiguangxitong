import fs from 'node:fs';
import path from 'node:path';

export function parseApiRequestUrl(requestUrl) {
  const parsedUrl = new URL(requestUrl, 'http://127.0.0.1');
  const query = {};

  for (const [key, value] of parsedUrl.searchParams.entries()) {
    if (key in query) {
      const currentValue = query[key];
      query[key] = Array.isArray(currentValue)
        ? [...currentValue, value]
        : [currentValue, value];
      continue;
    }
    query[key] = value;
  }

  return {
    pathname: parsedUrl.pathname,
    query,
  };
}

export function resolveApiModulePath(projectRoot, pathname) {
  if (!pathname.startsWith('/api/')) {
    return null;
  }

  const filePath = path.resolve(projectRoot, `.${pathname}.js`);
  return fs.existsSync(filePath) ? filePath : null;
}
