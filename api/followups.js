import { ObjectId } from 'mongodb';
import { getDb } from './_lib/mongodb.js';
import { requireWriteAccess } from './_lib/auth.js';
import {
  handleApiError,
  methodNotAllowed,
  readJsonBody,
  sendJson,
} from './_lib/http.js';
import { mapFollowUp } from './_lib/mappers.js';
import { recalculateStoreStatus } from './_lib/store-status.js';
import { getTrimmedText, parseRequiredTextFields } from './_lib/validation.js';
import { parseOrderConversionRate30d } from '../src/utils/promotionEligibility.js';

export default async function handler(req, res) {
  if (!requireWriteAccess(req, res)) {
    return;
  }

  if (req.method === 'GET') {
    try {
      const db = await getDb();
      const { storeId } = req.query;
      const query = typeof storeId === 'string' ? { storeId } : {};
      const followUps = await db
        .collection('followups')
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();

      sendJson(res, 200, followUps.map(mapFollowUp));
    } catch (error) {
      handleApiError(res, error);
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const body = await readJsonBody(req);
      const required = parseRequiredTextFields(body, [
        'storeId',
        'date',
        'communicationType',
        'intention',
        'staffName',
      ]);

      if (!required.ok) {
        sendJson(res, 400, {
          message: `缺少必填字段：${required.missingFields.join('/')}`,
        });
        return;
      }

      const { storeId, date, communicationType, intention, staffName } = required.values;
      const notes = getTrimmedText(body.notes);
      const rawOrderConversionRate30d = body.orderConversionRate30d;
      const orderConversionRate30d = parseOrderConversionRate30d(rawOrderConversionRate30d);

      if (
        rawOrderConversionRate30d !== ''
        && rawOrderConversionRate30d !== null
        && rawOrderConversionRate30d !== undefined
        && orderConversionRate30d === null
      ) {
        sendJson(res, 400, {
          message: '30天下单转化率必须是 0 到 100 之间的数字',
        });
        return;
      }

      if (!ObjectId.isValid(storeId)) {
        sendJson(res, 400, { message: 'storeId 格式不正确' });
        return;
      }

      const now = new Date();
      const followUpDoc = {
        storeId,
        date,
        communicationType,
        intention,
        notes,
        staffName,
        orderConversionRate30d,
        createdAt: now,
      };

      const db = await getDb();
      const storeObjectId = new ObjectId(storeId);
      const store = await db.collection('stores').findOne({ _id: storeObjectId });

      if (!store) {
        sendJson(res, 404, { message: '店铺不存在' });
        return;
      }

      const result = await db.collection('followups').insertOne(followUpDoc);
      await db.collection('stores').updateOne(
        { _id: storeObjectId, status: '待跟进' },
        { $set: { status: '已跟进', updatedAt: now } },
      );

      sendJson(res, 201, mapFollowUp({ ...followUpDoc, _id: result.insertedId }));
    } catch (error) {
      handleApiError(res, error);
    }
    return;
  }

  if (req.method === 'DELETE') {
    try {
      const id = typeof req.query.id === 'string' ? req.query.id.trim() : '';
      if (!id) {
        sendJson(res, 400, { message: '缺少必填字段：id' });
        return;
      }

      if (!ObjectId.isValid(id)) {
        sendJson(res, 400, { message: 'id 格式不正确' });
        return;
      }

      const db = await getDb();
      const followUpObjectId = new ObjectId(id);
      const existingFollowUp = await db
        .collection('followups')
        .findOne({ _id: followUpObjectId });

      if (!existingFollowUp) {
        sendJson(res, 404, { message: '跟进记录不存在' });
        return;
      }

      await db.collection('followups').deleteOne({ _id: followUpObjectId });
      const storeStatus = await recalculateStoreStatus(
        db,
        existingFollowUp.storeId,
        new Date(),
      );

      sendJson(res, 200, {
        id,
        storeId: existingFollowUp.storeId,
        storeStatus: storeStatus || '待跟进',
      });
    } catch (error) {
      handleApiError(res, error);
    }
    return;
  }

  methodNotAllowed(res, ['GET', 'POST', 'DELETE']);
}
