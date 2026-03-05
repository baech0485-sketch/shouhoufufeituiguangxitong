import { getDb } from './_lib/mongodb.js';
import { handleApiError, methodNotAllowed, readJsonBody, sendJson } from './_lib/http.js';
import { mapStore } from './_lib/mappers.js';

function parsePositiveInt(value, defaultValue, maxValue = Number.MAX_SAFE_INTEGER) {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return defaultValue;
  }
  return Math.min(parsed, maxValue);
}

function escapeRegex(input) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const db = await getDb();
      const page = parsePositiveInt(req.query.page, 1);
      const pageSize = parsePositiveInt(req.query.pageSize, 10, 100);
      const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
      const platform = typeof req.query.platform === 'string' ? req.query.platform.trim() : '';
      const status = typeof req.query.status === 'string' ? req.query.status.trim() : '';

      const query = {};
      if (search) {
        query.name = { $regex: escapeRegex(search), $options: 'i' };
      }
      if (platform) {
        query.platform = platform;
      }
      if (status) {
        query.status = status;
      }

      const skip = (page - 1) * pageSize;
      const [stores, total] = await Promise.all([
        db
          .collection('stores')
          .find(query)
          .sort({ openDate: -1, updatedAt: -1, createdAt: -1 })
          .skip(skip)
          .limit(pageSize)
          .toArray(),
        db.collection('stores').countDocuments(query),
      ]);

      const totalPages = Math.max(1, Math.ceil(total / pageSize));
      sendJson(res, 200, {
        items: stores.map(mapStore),
        page,
        pageSize,
        total,
        totalPages,
      });
    } catch (error) {
      handleApiError(res, error);
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const body = await readJsonBody(req);
      const name = typeof body.name === 'string' ? body.name.trim() : '';
      const platform = typeof body.platform === 'string' ? body.platform.trim() : '';
      const openDate = typeof body.openDate === 'string' ? body.openDate.trim() : '';

      if (!name || !platform || !openDate) {
        sendJson(res, 400, { message: '缺少必填字段：name/platform/openDate' });
        return;
      }

      const now = new Date();
      const storeDoc = {
        name,
        platform,
        openDate,
        status: '待跟进',
        createdAt: now,
        updatedAt: now,
      };

      const db = await getDb();
      const result = await db.collection('stores').insertOne(storeDoc);
      sendJson(res, 201, mapStore({ ...storeDoc, _id: result.insertedId }));
    } catch (error) {
      handleApiError(res, error);
    }
    return;
  }

  methodNotAllowed(res, ['GET', 'POST']);
}
