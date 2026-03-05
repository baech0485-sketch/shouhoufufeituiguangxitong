import { ObjectId } from 'mongodb';
import { getDb } from './_lib/mongodb.js';
import { handleApiError, methodNotAllowed, readJsonBody, sendJson } from './_lib/http.js';
import { mapRecharge } from './_lib/mappers.js';
import { recalculateStoreStatus } from './_lib/store-status.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const db = await getDb();
      const { storeId } = req.query;
      const query = typeof storeId === 'string' ? { storeId } : {};
      const recharges = await db
        .collection('recharges')
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();

      sendJson(res, 200, recharges.map(mapRecharge));
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
      const screenshotUrl =
        typeof body.screenshotUrl === 'string' ? body.screenshotUrl.trim() : '';
      const staffName = typeof body.staffName === 'string' ? body.staffName.trim() : '';
      const amount =
        typeof body.amount === 'number' ? body.amount : Number.parseFloat(String(body.amount));

      if (!storeId || !date || !staffName || Number.isNaN(amount)) {
        sendJson(res, 400, { message: '缺少必填字段：storeId/date/amount/staffName' });
        return;
      }

      if (!ObjectId.isValid(storeId)) {
        sendJson(res, 400, { message: 'storeId 格式不正确' });
        return;
      }

      const now = new Date();
      const rechargeDoc = {
        storeId,
        amount,
        date,
        screenshotUrl,
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

      const result = await db.collection('recharges').insertOne(rechargeDoc);
      await db.collection('stores').updateOne(
        { _id: storeObjectId },
        { $set: { status: '已充值', updatedAt: now } },
      );

      sendJson(res, 201, mapRecharge({ ...rechargeDoc, _id: result.insertedId }));
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
      const rechargeObjectId = new ObjectId(id);
      const existingRecharge = await db.collection('recharges').findOne({ _id: rechargeObjectId });

      if (!existingRecharge) {
        sendJson(res, 404, { message: '充值记录不存在' });
        return;
      }

      await db.collection('recharges').deleteOne({ _id: rechargeObjectId });
      const storeStatus = await recalculateStoreStatus(db, existingRecharge.storeId, new Date());

      sendJson(res, 200, {
        id,
        storeId: existingRecharge.storeId,
        storeStatus: storeStatus || '待跟进',
      });
    } catch (error) {
      handleApiError(res, error);
    }
    return;
  }

  methodNotAllowed(res, ['GET', 'POST', 'DELETE']);
}
