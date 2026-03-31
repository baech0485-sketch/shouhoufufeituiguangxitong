import { useEffect, useState } from 'react';
import {
  followUpApi,
  rechargeApi,
  storeApi,
  StorePlatformItem,
  type CreateStorePayload,
} from '../api';
import { FollowUp, Recharge, Store } from '../types';

export function useAppStoreData() {
  const [storePlatforms, setStorePlatforms] = useState<StorePlatformItem[]>([]);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [recharges, setRecharges] = useState<Recharge[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [storeListRefreshKey, setStoreListRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isUpdatingStoreStatus, setIsUpdatingStoreStatus] = useState(false);

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const [followUpData, rechargeData, storePlatformData] = await Promise.all([
          followUpApi.list(),
          rechargeApi.list(),
          storeApi.listPlatforms(),
        ]);
        setStorePlatforms(storePlatformData);
        setFollowUps(followUpData);
        setRecharges(rechargeData);
      } catch (error) {
        const message = error instanceof Error ? error.message : '初始化数据失败';
        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    };

    void initializeData();
  }, []);

  const handleAddStore = async (newStore: CreateStorePayload) => {
    setErrorMessage('');
    try {
      const createdStore = await storeApi.create(newStore);
      setStorePlatforms((prevPlatforms) => [
        ...prevPlatforms,
        {
          id: createdStore.id,
          platform: createdStore.platform,
        },
      ]);
      setStoreListRefreshKey((prevKey) => prevKey + 1);
    } catch (error) {
      const message = error instanceof Error ? error.message : '新增店铺失败';
      setErrorMessage(message);
      throw error;
    }
  };

  const handleAddFollowUp = (newFollowUp: Omit<FollowUp, 'id'>) => {
    setErrorMessage('');
    void (async () => {
      try {
        const createdFollowUp = await followUpApi.create(newFollowUp);
        setFollowUps((prevFollowUps) => [createdFollowUp, ...prevFollowUps]);
        setStoreListRefreshKey((prevKey) => prevKey + 1);
        setSelectedStore((prevStore) =>
          prevStore
          && prevStore.id === newFollowUp.storeId
          && prevStore.status === '待跟进'
            ? { ...prevStore, status: '已跟进' }
            : prevStore,
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : '新增跟进记录失败';
        setErrorMessage(message);
      }
    })();
  };

  const handleAddRecharge = (newRecharge: Omit<Recharge, 'id'>) => {
    setErrorMessage('');
    void (async () => {
      try {
        const createdRecharge = await rechargeApi.create(newRecharge);
        setRecharges((prevRecharges) => [createdRecharge, ...prevRecharges]);
        setStoreListRefreshKey((prevKey) => prevKey + 1);
        setSelectedStore((prevStore) =>
          prevStore
          && prevStore.id === newRecharge.storeId
          && prevStore.status !== '已在推广'
            ? { ...prevStore, status: '已充值' }
            : prevStore,
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : '新增充值记录失败';
        setErrorMessage(message);
      }
    })();
  };

  const handleDeleteFollowUp = async (followUpId: string) => {
    setErrorMessage('');
    try {
      const deletedFollowUp = await followUpApi.remove(followUpId);
      setFollowUps((prevFollowUps) =>
        prevFollowUps.filter((followUp) => followUp.id !== followUpId),
      );
      setStoreListRefreshKey((prevKey) => prevKey + 1);
      setSelectedStore((prevStore) =>
        prevStore && prevStore.id === deletedFollowUp.storeId
          ? { ...prevStore, status: deletedFollowUp.storeStatus }
          : prevStore,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : '删除跟进记录失败';
      setErrorMessage(message);
      throw error;
    }
  };

  const handleDeleteRecharge = async (rechargeId: string) => {
    setErrorMessage('');
    try {
      const deletedRecharge = await rechargeApi.remove(rechargeId);
      setRecharges((prevRecharges) =>
        prevRecharges.filter((recharge) => recharge.id !== rechargeId),
      );
      setStoreListRefreshKey((prevKey) => prevKey + 1);
      setSelectedStore((prevStore) =>
        prevStore && prevStore.id === deletedRecharge.storeId
          ? { ...prevStore, status: deletedRecharge.storeStatus }
          : prevStore,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : '删除充值记录失败';
      setErrorMessage(message);
      throw error;
    }
  };

  const handleMarkStoreAsPromoting = async (storeId: string) => {
    setErrorMessage('');
    setIsUpdatingStoreStatus(true);
    try {
      const updatedStore = await storeApi.updateStatus({
        id: storeId,
        operation: 'mark-promoting',
      });
      setSelectedStore(updatedStore);
      setStoreListRefreshKey((prevKey) => prevKey + 1);
    } catch (error) {
      const message = error instanceof Error ? error.message : '更新店铺状态失败';
      setErrorMessage(message);
      throw error;
    } finally {
      setIsUpdatingStoreStatus(false);
    }
  };

  const handleRestoreStoreAutoStatus = async (storeId: string) => {
    setErrorMessage('');
    setIsUpdatingStoreStatus(true);
    try {
      const updatedStore = await storeApi.updateStatus({
        id: storeId,
        operation: 'restore-auto-status',
      });
      setSelectedStore(updatedStore);
      setStoreListRefreshKey((prevKey) => prevKey + 1);
    } catch (error) {
      const message = error instanceof Error ? error.message : '恢复店铺自动状态失败';
      setErrorMessage(message);
      throw error;
    } finally {
      setIsUpdatingStoreStatus(false);
    }
  };

  return {
    storePlatforms,
    followUps,
    recharges,
    selectedStore,
    storeListRefreshKey,
    isLoading,
    errorMessage,
    isUpdatingStoreStatus,
    setSelectedStore,
    handleAddStore,
    handleAddFollowUp,
    handleAddRecharge,
    handleDeleteFollowUp,
    handleDeleteRecharge,
    handleMarkStoreAsPromoting,
    handleRestoreStoreAutoStatus,
  };
}
