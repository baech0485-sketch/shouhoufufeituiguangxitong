import { FollowUp, Recharge, Store, StoreStatus } from './types';

interface ApiErrorPayload {
  message?: string;
}

export interface StoreListQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  platform?: string;
  status?: string;
}

export interface StoreListResponse {
  items: Store[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export type StoreFilterQuery = Omit<StoreListQuery, 'page' | 'pageSize'>;

export interface StorePlatformItem {
  id: string;
  platform: string;
}

export interface DeleteRecordResponse {
  id: string;
  storeId: string;
  storeStatus: StoreStatus;
}

function buildWriteAuthHeaders(init?: RequestInit) {
  const method = (init?.method || 'GET').toUpperCase();
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    return {};
  }

  const writeKey = import.meta.env.VITE_API_WRITE_KEY?.trim();
  if (!writeKey) {
    return {};
  }

  return {
    'x-api-key': writeKey,
  };
}

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...buildWriteAuthHeaders(init),
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
  list(query: StoreListQuery = {}) {
    const params = new URLSearchParams();
    if (query.page) {
      params.set('page', String(query.page));
    }
    if (query.pageSize) {
      params.set('pageSize', String(query.pageSize));
    }
    if (query.search) {
      params.set('search', query.search);
    }
    if (query.platform) {
      params.set('platform', query.platform);
    }
    if (query.status) {
      params.set('status', query.status);
    }

    const queryString = params.toString();
    const url = queryString ? `/api/stores?${queryString}` : '/api/stores';
    return requestJson<StoreListResponse>(url);
  },
  async listAll(query: StoreFilterQuery = {}) {
    const pageSize = 100;
    const firstPage = await storeApi.list({
      ...query,
      page: 1,
      pageSize,
    });
    const allStores = [...firstPage.items];

    for (let page = 2; page <= firstPage.totalPages; page += 1) {
      const response = await storeApi.list({
        ...query,
        page,
        pageSize,
      });
      allStores.push(...response.items);
    }

    return allStores;
  },
  listPlatforms() {
    return requestJson<StorePlatformItem[]>('/api/store-platforms');
  },
  create(payload: Omit<Store, 'id' | 'status' | 'storeCode'>) {
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
  remove(id: string) {
    const query = `?id=${encodeURIComponent(id)}`;
    return requestJson<DeleteRecordResponse>(`/api/followups${query}`, {
      method: 'DELETE',
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
  remove(id: string) {
    const query = `?id=${encodeURIComponent(id)}`;
    return requestJson<DeleteRecordResponse>(`/api/recharges${query}`, {
      method: 'DELETE',
    });
  },
};
