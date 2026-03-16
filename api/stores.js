import { ObjectId } from 'mongodb';
import { getDb } from './_lib/mongodb.js';
import { requireWriteAccess } from './_lib/auth.js';
import { handleApiError, methodNotAllowed, readJsonBody, sendJson } from './_lib/http.js';
import { mapStore } from './_lib/mappers.js';
import { buildStoreListQuery } from './_lib/store-list-query.js';
import { buildLatestStoreIdsByStaff } from './_lib/store-list-staff.js';
import {
  deriveStoreStatus,
  MANUAL_PROMOTING_STATUS,
} from './_lib/store-status.js';
import { parseRequiredTextFields } from './_lib/validation.js';

function parsePositiveInt(value, defaultValue, maxValue = Number.MAX_SAFE_INTEGER) {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return defaultValue;
  }
  return Math.min(parsed, maxValue);
}

export default async function handler(req, res) {
  if (!requireWriteAccess(req, res)) {
    return;
  }

  if (req.method === 'GET') {
    try {
      const db = await getDb();
      const page = parsePositiveInt(req.query.page, 1);
      const pageSize = parsePositiveInt(req.query.pageSize, 10, 100);
      const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
      const platform = typeof req.query.platform === 'string' ? req.query.platform.trim() : '';
      const status = typeof req.query.status === 'string' ? req.query.status.trim() : '';
      const staff = typeof req.query.staff === 'string' ? req.query.staff.trim() : '';

      const query = buildStoreListQuery({
        search,
        platform,
        status,
      });

      if (staff) {
        const latestFollowUps = await db
          .collection('followups')
          .find(
            {},
            {
              projection: {
                storeId: 1,
                staffName: 1,
              },
            },
          )
          .sort({ createdAt: -1 })
          .toArray();

        const matchedStoreIds = buildLatestStoreIdsByStaff(latestFollowUps, staff)
          .filter((storeId) => ObjectId.isValid(storeId))
          .map((storeId) => new ObjectId(storeId));

        if (matchedStoreIds.length === 0) {
          sendJson(res, 200, {
            items: [],
            page,
            pageSize,
            total: 0,
            totalPages: 1,
          });
          return;
        }

        query._id = { $in: matchedStoreIds };
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
      const required = parseRequiredTextFields(body, ['name', 'platform', 'openDate']);
      if (!required.ok) {
        sendJson(res, 400, {
          message: `缺少必填字段：${required.missingFields.join('/')}`,
        });
        return;
      }
      const { name, platform, openDate } = required.values;

      const now = new Date();
      const storeDoc = {
        name,
        platform,
        openDate,
        status: '待跟进',
        statusSource: 'derived',
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

  if (req.method === 'PATCH') {
    try {
      const body = await readJsonBody(req);
      const id = typeof body?.id === 'string' ? body.id.trim() : '';
      const operation = typeof body?.operation === 'string' ? body.operation.trim() : '';

      if (!id || !operation) {
        sendJson(res, 400, { message: '缺少必填字段：id/operation' });
        return;
      }

      if (!ObjectId.isValid(id)) {
        sendJson(res, 400, { message: 'id 格式不正确' });
        return;
      }

      const db = await getDb();
      const storeObjectId = new ObjectId(id);
      const store = await db.collection('stores').findOne({ _id: storeObjectId });

      if (!store) {
        sendJson(res, 404, { message: '店铺不存在' });
        return;
      }

      const now = new Date();

      if (operation === 'mark-promoting') {
        await db.collection('stores').updateOne(
          { _id: storeObjectId },
          {
            $set: {
              status: MANUAL_PROMOTING_STATUS,
              statusSource: 'manual',
              updatedAt: now,
            },
          },
        );

        sendJson(res, 200, mapStore({ ...store, status: MANUAL_PROMOTING_STATUS }));
        return;
      }

      if (operation === 'restore-auto-status') {
        const [rechargeRecord, followUpRecord] = await Promise.all([
          db.collection('recharges').findOne({ storeId: id }, { projection: { _id: 1 } }),
          db.collection('followups').findOne({ storeId: id }, { projection: { _id: 1 } }),
        ]);
        const status = deriveStoreStatus(Boolean(rechargeRecord), Boolean(followUpRecord));

        await db.collection('stores').updateOne(
          { _id: storeObjectId },
          {
            $set: {
              status,
              statusSource: 'derived',
              updatedAt: now,
            },
          },
        );

        sendJson(res, 200, mapStore({ ...store, status }));
        return;
      }

      sendJson(res, 400, { message: '不支持的店铺状态操作' });
    } catch (error) {
      handleApiError(res, error);
    }
    return;
  }

  methodNotAllowed(res, ['GET', 'POST', 'PATCH']);
}
