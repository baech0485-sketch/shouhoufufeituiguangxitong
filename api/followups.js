import { ObjectId } from 'mongodb';
import { getDb } from './_lib/mongodb.js';
import { handleApiError, methodNotAllowed, readJsonBody, sendJson } from './_lib/http.js';
import { mapFollowUp } from './_lib/mappers.js';

export default async function handler(req, res) {
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
      const storeId = typeof body.storeId === 'string' ? body.storeId.trim() : '';
      const date = typeof body.date === 'string' ? body.date.trim() : '';
      const communicationType =
        typeof body.communicationType === 'string' ? body.communicationType.trim() : '';
      const intention = typeof body.intention === 'string' ? body.intention.trim() : '';
      const notes = typeof body.notes === 'string' ? body.notes.trim() : '';
      const staffName = typeof body.staffName === 'string' ? body.staffName.trim() : '';

      if (!storeId || !date || !communicationType || !intention || !staffName) {
        sendJson(res, 400, { message: '缺少必填字段：storeId/date/communicationType/intention/staffName' });
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

  methodNotAllowed(res, ['GET', 'POST']);
}
