export function sendJson(res, statusCode, payload) {
  res.status(statusCode).json(payload);
}

export function methodNotAllowed(res, allowedMethods) {
  res.setHeader('Allow', allowedMethods.join(', '));
  sendJson(res, 405, { message: `仅支持 ${allowedMethods.join(', ')} 请求` });
}

export async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (typeof req.body === 'string' && req.body.trim()) {
    return JSON.parse(req.body);
  }
  return {};
}

export function handleApiError(res, error) {
  console.error('API 执行失败:', error);
  sendJson(res, 500, { message: '服务器内部错误，请稍后重试' });
}
