import { getDb } from './_lib/mongodb.js';
import { requireWriteAccess } from './_lib/auth.js';
import { handleApiError, methodNotAllowed, sendJson } from './_lib/http.js';
import { mapStorePlatform } from './_lib/mappers.js';

export default async function handler(req, res) {
  if (!requireWriteAccess(req, res)) {
    return;
  }

  if (req.method !== 'GET') {
    methodNotAllowed(res, ['GET']);
    return;
  }

  try {
    const db = await getDb();
    const stores = await db
      .collection('stores')
      .find(
        {},
        {
          projection: {
            platform: 1,
          },
        },
      )
      .toArray();

    sendJson(res, 200, stores.map(mapStorePlatform));
  } catch (error) {
    handleApiError(res, error);
  }
}
