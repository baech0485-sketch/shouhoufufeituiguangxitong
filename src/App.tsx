import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from './components/Sidebar';
import StoreList from './components/StoreList';
import StoreDetailModal from './components/StoreDetailModal';
import Dashboard from './components/Dashboard';
import { Store, FollowUp, Recharge, ViewState } from './types';
import { followUpApi, rechargeApi, storeApi, StorePlatformItem } from './api';
import { buildAfterSalesStaffOptions } from './utils/afterSalesStaff.js';
import { getContentContainerClassName } from './layout/contentWidth.js';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [storePlatforms, setStorePlatforms] = useState<StorePlatformItem[]>([]);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [recharges, setRecharges] = useState<Recharge[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [storeListRefreshKey, setStoreListRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isUpdatingStoreStatus, setIsUpdatingStoreStatus] = useState(false);

  const staffOptions = useMemo(() => {
    return buildAfterSalesStaffOptions([
      ...followUps.map((item) => item.staffName),
      ...recharges.map((item) => item.staffName),
    ]);
  }, [followUps, recharges]);

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

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />

      <main className="flex-1 overflow-y-auto">
        <div
          className={`${getContentContainerClassName(currentView)} px-6 py-8 md:px-8 lg:py-10`}
        >
          {errorMessage && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}
          {isLoading && (
            <div className="mb-6 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
              正在加载云端数据...
            </div>
          )}
          {currentView === 'dashboard' && (
            <Dashboard
              storePlatforms={storePlatforms}
              recharges={recharges}
              followUps={followUps}
            />
          )}
          {currentView === 'list' && (
            <StoreList
              onSelectStore={setSelectedStore}
              refreshKey={storeListRefreshKey}
              followUps={followUps}
              recharges={recharges}
              staffOptions={staffOptions}
            />
          )}
        </div>
      </main>

      {selectedStore && (
        <StoreDetailModal
          store={selectedStore}
          followUps={followUps.filter(f => f.storeId === selectedStore.id)}
          recharges={recharges.filter(r => r.storeId === selectedStore.id)}
          onClose={() => setSelectedStore(null)}
          onAddFollowUp={handleAddFollowUp}
          onAddRecharge={handleAddRecharge}
          onDeleteFollowUp={handleDeleteFollowUp}
          onDeleteRecharge={handleDeleteRecharge}
          onMarkStoreAsPromoting={handleMarkStoreAsPromoting}
          onRestoreStoreAutoStatus={handleRestoreStoreAutoStatus}
          isUpdatingStoreStatus={isUpdatingStoreStatus}
          staffOptions={staffOptions}
        />
      )}
    </div>
  );
}
