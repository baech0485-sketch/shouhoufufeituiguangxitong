import { getDb } from './_lib/mongodb.js';
import { handleApiError, methodNotAllowed, readJsonBody, sendJson } from './_lib/http.js';
import { mapStore } from './_lib/mappers.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const db = await getDb();
      const stores = await db.collection('stores').find({}).sort({ createdAt: -1 }).toArray();
      sendJson(res, 200, stores.map(mapStore));
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
