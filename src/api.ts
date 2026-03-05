import { FollowUp, Recharge, Store } from './types';

interface ApiErrorPayload {
  message?: string;
}

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    let message = '请求失败，请稍后重试';
    try {
      const payload = (await response.json()) as ApiErrorPayload;
      if (payload.message) {
        message = payload.message;
      }
    } catch {
      // 忽略 JSON 解析失败，保留默认错误信息
    }
    throw new Error(message);
  }

  return (await response.json()) as T;
}

export const storeApi = {
  list() {
    return requestJson<Store[]>('/api/stores');
  },
  create(payload: Omit<Store, 'id' | 'status'>) {
    return requestJson<Store>('/api/stores', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

export const followUpApi = {
  list(storeId?: string) {
    const query = storeId ? `?storeId=${encodeURIComponent(storeId)}` : '';
    return requestJson<FollowUp[]>(`/api/followups${query}`);
  },
  create(payload: Omit<FollowUp, 'id'>) {
    return requestJson<FollowUp>('/api/followups', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

export const rechargeApi = {
  list(storeId?: string) {
    const query = storeId ? `?storeId=${encodeURIComponent(storeId)}` : '';
    return requestJson<Recharge[]>(`/api/recharges${query}`);
  },
  create(payload: Omit<Recharge, 'id'>) {
    return requestJson<Recharge>('/api/recharges', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
